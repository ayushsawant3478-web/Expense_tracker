"""
Session tracking: login/logout times, active sessions, last activity.
Also: password change logs and optional password expiry.
"""
import psycopg2
import psycopg2.extras
from database.db import get_db

# ──────────────────────────────────────────────────────────────────────────────
# Schema
# ──────────────────────────────────────────────────────────────────────────────

def create_session_tables():
    conn = get_db()
    cur = conn.cursor()

    cur.execute("""
        CREATE TABLE IF NOT EXISTS sessions (
            id SERIAL PRIMARY KEY,
            user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
            token_jti VARCHAR(255) UNIQUE NOT NULL,
            ip_address VARCHAR(45),
            user_agent TEXT,
            login_at TIMESTAMP DEFAULT NOW(),
            logout_at TIMESTAMP,
            last_activity TIMESTAMP DEFAULT NOW(),
            is_active BOOLEAN DEFAULT TRUE
        )
    """)

    cur.execute("""
        CREATE TABLE IF NOT EXISTS password_change_logs (
            id SERIAL PRIMARY KEY,
            user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
            changed_at TIMESTAMP DEFAULT NOW(),
            ip_address VARCHAR(45),
            method VARCHAR(30) DEFAULT 'manual'
        )
    """)

    # Add password_changed_at to users for optional expiry tracking
    cur.execute("ALTER TABLE users ADD COLUMN IF NOT EXISTS password_changed_at TIMESTAMP DEFAULT NOW();")

    conn.commit()
    cur.close()
    conn.close()

# ──────────────────────────────────────────────────────────────────────────────
# Session CRUD
# ──────────────────────────────────────────────────────────────────────────────

def create_session(user_id, token_jti, ip_address=None, user_agent=None):
    conn = get_db()
    cur = conn.cursor()
    cur.execute("""
        INSERT INTO sessions (user_id, token_jti, ip_address, user_agent, login_at, last_activity, is_active)
        VALUES (%s, %s, %s, %s, NOW(), NOW(), TRUE)
    """, (user_id, token_jti, ip_address, user_agent))
    conn.commit()
    cur.close()
    conn.close()

def end_session(token_jti):
    conn = get_db()
    cur = conn.cursor()
    cur.execute("""
        UPDATE sessions
        SET logout_at = NOW(), is_active = FALSE
        WHERE token_jti = %s AND is_active = TRUE
    """, (token_jti,))
    conn.commit()
    cur.close()
    conn.close()

def end_all_sessions(user_id):
    """Logout all active sessions for a user."""
    conn = get_db()
    cur = conn.cursor()
    cur.execute("""
        UPDATE sessions
        SET logout_at = NOW(), is_active = FALSE
        WHERE user_id = %s AND is_active = TRUE
    """, (user_id,))
    conn.commit()
    cur.close()
    conn.close()

def update_session_activity(token_jti):
    conn = get_db()
    cur = conn.cursor()
    cur.execute("""
        UPDATE sessions SET last_activity = NOW()
        WHERE token_jti = %s AND is_active = TRUE
    """, (token_jti,))
    conn.commit()
    cur.close()
    conn.close()

def get_active_sessions(user_id=None):
    """Get all active sessions, optionally filtered by user."""
    conn = get_db()
    cur = conn.cursor(cursor_factory=psycopg2.extras.RealDictCursor)
    if user_id:
        cur.execute("""
            SELECT s.*, u.name, u.email
            FROM sessions s
            JOIN users u ON s.user_id = u.id
            WHERE s.is_active = TRUE AND s.user_id = %s
            ORDER BY s.last_activity DESC
        """, (user_id,))
    else:
        cur.execute("""
            SELECT s.*, u.name, u.email
            FROM sessions s
            JOIN users u ON s.user_id = u.id
            WHERE s.is_active = TRUE
            ORDER BY s.last_activity DESC
        """)
    rows = cur.fetchall()
    cur.close()
    conn.close()
    return rows

def get_all_sessions_summary():
    """Admin overview: total sessions, active count, recent logins."""
    conn = get_db()
    cur = conn.cursor(cursor_factory=psycopg2.extras.RealDictCursor)

    cur.execute("SELECT COUNT(*) AS total FROM sessions")
    total = cur.fetchone()['total']

    cur.execute("SELECT COUNT(*) AS active FROM sessions WHERE is_active = TRUE")
    active = cur.fetchone()['active']

    # Recent sessions (last 24h)
    cur.execute("""
        SELECT s.id, s.user_id, s.ip_address, s.login_at, s.logout_at,
               s.last_activity, s.is_active, u.name, u.email
        FROM sessions s
        JOIN users u ON s.user_id = u.id
        WHERE s.login_at > NOW() - INTERVAL '24 hours'
        ORDER BY s.login_at DESC
        LIMIT 50
    """)
    recent = cur.fetchall()

    cur.close()
    conn.close()
    return {'total_sessions': total, 'active_sessions': active, 'recent_sessions': recent}

# ──────────────────────────────────────────────────────────────────────────────
# Password change logs
# ──────────────────────────────────────────────────────────────────────────────

def log_password_change(user_id, ip_address=None, method='manual'):
    conn = get_db()
    cur = conn.cursor()
    cur.execute("""
        INSERT INTO password_change_logs (user_id, changed_at, ip_address, method)
        VALUES (%s, NOW(), %s, %s)
    """, (user_id, ip_address, method))
    # Also update password_changed_at on the user
    cur.execute("UPDATE users SET password_changed_at = NOW() WHERE id = %s", (user_id,))
    conn.commit()
    cur.close()
    conn.close()

def get_password_change_logs(limit=50):
    conn = get_db()
    cur = conn.cursor(cursor_factory=psycopg2.extras.RealDictCursor)
    cur.execute("""
        SELECT pcl.*, u.name, u.email
        FROM password_change_logs pcl
        JOIN users u ON pcl.user_id = u.id
        ORDER BY pcl.changed_at DESC
        LIMIT %s
    """, (limit,))
    rows = cur.fetchall()
    cur.close()
    conn.close()
    return rows

def check_password_expiry(user_id, max_days=90):
    """Returns (is_expired: bool, days_since_change: int|None)."""
    conn = get_db()
    cur = conn.cursor()
    cur.execute("""
        SELECT password_changed_at FROM users WHERE id = %s
    """, (user_id,))
    row = cur.fetchone()
    cur.close()
    conn.close()
    if not row or row[0] is None:
        return False, None
    from datetime import datetime
    days = (datetime.utcnow() - row[0].replace(tzinfo=None)).days
    return days >= max_days, days
