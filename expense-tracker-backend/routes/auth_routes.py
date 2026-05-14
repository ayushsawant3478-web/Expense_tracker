from google.oauth2 import id_token
from google.auth.transport import requests as google_requests
import os
from flask import Blueprint, request, jsonify
from models.user import create_user, get_user_by_email, update_last_login, get_user_by_id
from models.security import (
    record_failed_login, get_failed_login_count,
    lock_user_account, is_account_locked,
    log_suspicious_event, clear_failed_logins
)
from models.session import create_session, end_session, end_all_sessions, log_password_change
from utils.password_validator import validate_password
from flask_bcrypt import Bcrypt
from flask_jwt_extended import (
    create_access_token, jwt_required, get_jwt_identity, get_jwt
)
import secrets

auth_bp = Blueprint('auth', __name__)
bcrypt = Bcrypt()

FAILED_LOGIN_THRESHOLD = 5    # attempts
FAILED_LOGIN_WINDOW    = 10   # minutes
LOCK_DURATION_MINUTES  = 30   # how long to lock the account

# ──────────────────────────────────────────────────────────────────────────────
# Password validation endpoint (public, no auth needed)
# ──────────────────────────────────────────────────────────────────────────────

@auth_bp.route('/validate-password', methods=['POST', 'OPTIONS'])
def validate_password_route():
    if request.method == 'OPTIONS':
        return '', 200
    data = request.get_json()
    result = validate_password(data.get('password', ''))
    return jsonify(result), 200

# ──────────────────────────────────────────────────────────────────────────────
# Register
# ──────────────────────────────────────────────────────────────────────────────

@auth_bp.route('/register', methods=['POST', 'OPTIONS'])
def register():
    if request.method == 'OPTIONS':
        return '', 200
    data = request.get_json()

    # Server-side password strength validation
    pw = data.get('password', '')
    validation = validate_password(pw)
    if not validation['valid']:
        return jsonify({
            "message": "Password does not meet requirements",
            "errors": validation['errors']
        }), 400

    hashed_password = bcrypt.generate_password_hash(pw).decode('utf-8')
    create_user(data['name'], data['email'], hashed_password)
    return jsonify({"message": "User registered successfully"}), 201

# ──────────────────────────────────────────────────────────────────────────────
# Login
# ──────────────────────────────────────────────────────────────────────────────

@auth_bp.route('/login', methods=['POST', 'OPTIONS'])
def login():
    if request.method == 'OPTIONS':
        return '', 200

    data = request.get_json()
    email = data.get('email', '').strip().lower()
    ip = request.remote_addr

    # ── 1. Account lock check ──────────────────────────────────────────────
    locked, locked_until = is_account_locked(email)
    if locked:
        return jsonify({
            "message": f"Account temporarily locked due to too many failed login attempts. "
                       f"Try again after {LOCK_DURATION_MINUTES} minutes.",
            "locked": True
        }), 423

    # ── 2. Credential check ────────────────────────────────────────────────
    user = get_user_by_email(email)
    if not user or not bcrypt.check_password_hash(user['password'], data.get('password', '')):
        record_failed_login(email, ip)
        count = get_failed_login_count(email, FAILED_LOGIN_WINDOW)
        print(f"[SECURITY] Failed login for {email} — {count}/{FAILED_LOGIN_THRESHOLD} in last {FAILED_LOGIN_WINDOW} min")

        if count >= FAILED_LOGIN_THRESHOLD:
            lock_user_account(email, LOCK_DURATION_MINUTES)
            log_suspicious_event(
                event_type='ACCOUNT_LOCKED',
                detail=f"{count} failed login attempts in {FAILED_LOGIN_WINDOW} minutes from IP {ip}. Account locked for {LOCK_DURATION_MINUTES} min.",
                email=email,
                user_id=user['id'] if user else None,
                severity='high'
            )
            return jsonify({
                "message": f"Too many failed attempts. Account locked for {LOCK_DURATION_MINUTES} minutes.",
                "locked": True
            }), 423

        return jsonify({"message": "Invalid credentials"}), 401

    # ── 3. Successful login ────────────────────────────────────────────────
    update_last_login(user['id'])
    clear_failed_logins(email)

    # Detect impossible login frequency
    from models.logs import get_logs_by_user
    from datetime import datetime, timedelta
    recent_logins = [
        l for l in get_logs_by_user(user['id'])
        if l['action'] == 'User logged in'
        and datetime.now() - l['timestamp'].replace(tzinfo=None) < timedelta(hours=1)
    ]
    if len(recent_logins) >= 20:
        log_suspicious_event(
            event_type='IMPOSSIBLE_LOGIN_FREQUENCY',
            detail=f"User logged in {len(recent_logins)+1} times in the last hour.",
            email=user['email'],
            user_id=user['id'],
            severity='high'
        )

    from models.logs import create_log
    create_log(user['id'], 'User logged in')

    token = create_access_token(identity=str(user['id']))

    # ── 4. Create session record ───────────────────────────────────────────
    # Decode the JTI from the token for session tracking
    import jwt as pyjwt
    decoded = pyjwt.decode(token, options={"verify_signature": False})
    jti = decoded.get('jti', '')
    user_agent = request.headers.get('User-Agent', '')[:200]
    create_session(user['id'], jti, ip, user_agent)

    role_to_send = user.get('role', 'user')
    if user['email'] == 'admin@trackify.com':
        role_to_send = 'admin'

    # Check password expiry (optional: warn if >90 days)
    from models.session import check_password_expiry
    expired, days = check_password_expiry(user['id'], max_days=90)
    password_warning = None
    if expired:
        password_warning = f"Your password was last changed {days} days ago. Please update it for security."

    return jsonify({
        "token": token,
        "user": {
            "id": user['id'],
            "username": user['name'],
            "email": user['email'],
            "role": role_to_send
        },
        "password_warning": password_warning
    }), 200

# ──────────────────────────────────────────────────────────────────────────────
# Logout (ends session)
# ──────────────────────────────────────────────────────────────────────────────

@auth_bp.route('/logout', methods=['POST', 'OPTIONS'])
@jwt_required()
def logout():
    if request.method == 'OPTIONS':
        return '', 200
    jti = get_jwt().get('jti', '')
    user_id = get_jwt_identity()
    end_session(jti)
    from models.logs import create_log
    create_log(user_id, 'User logged out')
    return jsonify({"message": "Logged out successfully"}), 200

# ──────────────────────────────────────────────────────────────────────────────
# Change Password
# ──────────────────────────────────────────────────────────────────────────────

@auth_bp.route('/change-password', methods=['POST', 'OPTIONS'])
@jwt_required()
def change_password():
    if request.method == 'OPTIONS':
        return '', 200

    data = request.get_json()
    user_id = get_jwt_identity()
    user = get_user_by_id(user_id)
    if not user:
        return jsonify({"message": "User not found"}), 404

    current_password = data.get('current_password', '')
    new_password = data.get('new_password', '')

    # Verify current password
    if not bcrypt.check_password_hash(user['password'], current_password):
        return jsonify({"message": "Current password is incorrect"}), 401

    # Validate new password strength
    validation = validate_password(new_password)
    if not validation['valid']:
        return jsonify({
            "message": "New password does not meet requirements",
            "errors": validation['errors']
        }), 400

    # Update password
    from database.db import get_db
    hashed = bcrypt.generate_password_hash(new_password).decode('utf-8')
    conn = get_db()
    cur = conn.cursor()
    cur.execute("UPDATE users SET password = %s WHERE id = %s", (hashed, user_id))
    conn.commit()
    cur.close()
    conn.close()

    # Log the change
    ip = request.remote_addr
    log_password_change(user_id, ip, method='manual')

    from models.logs import create_log
    create_log(user_id, 'Password changed')

    # End all other sessions (force re-login everywhere else)
    jti = get_jwt().get('jti', '')
    end_all_sessions(user_id)
    # Re-activate the current session
    create_session(user_id, jti, ip, request.headers.get('User-Agent', '')[:200])

    return jsonify({"message": "Password changed successfully"}), 200

# ──────────────────────────────────────────────────────────────────────────────
# Google Login
# ──────────────────────────────────────────────────────────────────────────────

@auth_bp.route('/auth/google', methods=['POST', 'OPTIONS'])
def google_login():
    if request.method == 'OPTIONS':
        return '', 200
    try:
        data = request.get_json()
        token = data.get('credential')

        id_info = id_token.verify_oauth2_token(
            token,
            google_requests.Request(),
            os.getenv("GOOGLE_CLIENT_ID"),
            clock_skew_in_seconds=10
        )

        email = id_info.get('email')
        name = id_info.get('name', email.split('@')[0])

        user = get_user_by_email(email)
        if not user:
            hashed = bcrypt.generate_password_hash(
                secrets.token_hex(16)
            ).decode('utf-8')
            create_user(name, email, hashed)
            user = get_user_by_email(email)

        update_last_login(user['id'])
        from models.logs import create_log
        create_log(user['id'], 'User logged in via Google')

        access_token = create_access_token(identity=str(user['id']))

        # Create session for Google login too
        import jwt as pyjwt
        decoded = pyjwt.decode(access_token, options={"verify_signature": False})
        jti = decoded.get('jti', '')
        ip = request.remote_addr
        user_agent = request.headers.get('User-Agent', '')[:200]
        create_session(user['id'], jti, ip, user_agent)

        return jsonify({
            "token": access_token,
            "user": {
                "id": user['id'],
                "username": user['name'],
                "email": user['email'],
                "role": user.get('role', 'user')
            }
        }), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 400