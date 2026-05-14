from flask import Blueprint, jsonify, request
from flask_jwt_extended import jwt_required, get_jwt_identity
from models.user import get_user_by_id, get_all_users, update_user_role
from models.logs import get_all_logs
from models.expense import get_all_expenses
from models.income import get_all_income
from models.budget import get_all_budgets
from models.goal import get_all_goals
from models.security import (
    get_total_failed_logins, get_failed_logins_by_email,
    get_all_suspicious_events, get_recent_suspicious_count,
    get_deletion_count, get_active_users, get_excessive_deleters
)
from models.session import get_all_sessions_summary, get_active_sessions, get_password_change_logs

admin_bp = Blueprint('admin', __name__)

@admin_bp.route('/admin/users', methods=['GET'])
@jwt_required()
def get_users():
    user_id = get_jwt_identity()
    user = get_user_by_id(user_id)
    if not user or user['role'] != 'admin':
        return jsonify({'error': 'Forbidden'}), 403
    users = get_all_users()
    return jsonify([dict(u) for u in users]), 200

@admin_bp.route('/admin/users/<int:user_id>/role', methods=['PUT'])
@jwt_required()
def update_user_role_route(user_id):
    current_user_id = get_jwt_identity()
    current_user = get_user_by_id(current_user_id)
    if not current_user or current_user['role'] != 'admin':
        return jsonify({'error': 'Forbidden'}), 403
    update_user_role(user_id, 'admin')
    return jsonify({'message': 'User role updated'}), 200

@admin_bp.route('/admin/logs', methods=['GET'])
@jwt_required()
def get_logs():
    user_id = get_jwt_identity()
    user = get_user_by_id(user_id)
    if not user or user['role'] != 'admin':
        return jsonify({'error': 'Forbidden'}), 403
    logs = get_all_logs()
    return jsonify([dict(l) for l in logs]), 200

@admin_bp.route('/admin/expenses', methods=['GET'])
@jwt_required()
def get_all_expenses_route():
    user_id = get_jwt_identity()
    user = get_user_by_id(user_id)
    if not user or user['role'] != 'admin':
        return jsonify({'error': 'Forbidden'}), 403
    expenses = get_all_expenses()
    return jsonify([dict(e) for e in expenses]), 200

@admin_bp.route('/admin/income', methods=['GET'])
@jwt_required()
def get_all_income_route():
    user_id = get_jwt_identity()
    user = get_user_by_id(user_id)
    if not user or user['role'] != 'admin':
        return jsonify({'error': 'Forbidden'}), 403
    incomes = get_all_income()
    return jsonify([dict(i) for i in incomes]), 200

@admin_bp.route('/admin/budgets', methods=['GET'])
@jwt_required()
def get_all_budgets_route():
    user_id = get_jwt_identity()
    user = get_user_by_id(user_id)
    if not user or user['role'] != 'admin':
        return jsonify({'error': 'Forbidden'}), 403
    budgets = get_all_budgets()
    return jsonify([dict(b) for b in budgets]), 200

@admin_bp.route('/admin/goals', methods=['GET'])
@jwt_required()
def get_all_goals_route():
    user_id = get_jwt_identity()
    user = get_user_by_id(user_id)
    if not user or user['role'] != 'admin':
        return jsonify({'error': 'Forbidden'}), 403
    goals = get_all_goals()
    return jsonify([dict(g) for g in goals]), 200


@admin_bp.route('/admin/security', methods=['GET'])
@jwt_required()
def get_security_metrics():
    user_id = get_jwt_identity()
    user = get_user_by_id(user_id)
    if not user or user['role'] != 'admin':
        return jsonify({'error': 'Forbidden'}), 403

    suspicious_events = get_all_suspicious_events(limit=50)
    active_users = get_active_users(hours=24)
    failed_by_email = get_failed_logins_by_email()
    excessive = get_excessive_deleters(threshold=5, hours=1)
    sessions_data = get_all_sessions_summary()
    active_sessions_list = get_active_sessions()
    pw_changes = get_password_change_logs(limit=20)

    # Locked accounts: users where locked_until > NOW()
    from database.db import get_db
    import psycopg2.extras
    conn = get_db()
    cur = conn.cursor(cursor_factory=psycopg2.extras.RealDictCursor)
    cur.execute("""
        SELECT id, name, email, locked_until
        FROM users
        WHERE locked_until > NOW()
        ORDER BY locked_until DESC
    """)
    locked_accounts = [dict(r) for r in cur.fetchall()]
    cur.close()
    conn.close()

    return jsonify({
        "total_failed_logins": get_total_failed_logins(),
        "recent_suspicious_count_24h": get_recent_suspicious_count(hours=24),
        "deletion_count_24h": get_deletion_count(hours=24),
        "active_users_24h": len(active_users),
        "active_users_list": [
            {
                "id": u['id'], "name": u['name'], "email": u['email'],
                "action_count": u['action_count'],
                "last_activity": u['last_activity'].isoformat() if u['last_activity'] else None
            } for u in active_users
        ],
        "failed_logins_by_email": [
            {
                "email": r['email'],
                "attempts": r['attempts'],
                "last_attempt": r['last_attempt'].isoformat() if r['last_attempt'] else None
            } for r in failed_by_email
        ],
        "suspicious_events": [
            {
                "id": e['id'],
                "event_type": e['event_type'],
                "detail": e['detail'],
                "severity": e['severity'],
                "email": e['email'] or e.get('user_email'),
                "created_at": e['created_at'].isoformat() if e['created_at'] else None
            } for e in suspicious_events
        ],
        "locked_accounts": [
            {
                "id": a['id'], "name": a['name'], "email": a['email'],
                "locked_until": a['locked_until'].isoformat() if a['locked_until'] else None
            } for a in locked_accounts
        ],
        "excessive_deleters": [
            {"id": d['id'], "name": d['name'], "email": d['email'], "deletion_count": d['deletion_count']}
            for d in excessive
        ],
        "sessions": {
            "total": sessions_data['total_sessions'],
            "active": sessions_data['active_sessions'],
            "active_list": [
                {
                    "id": s['id'], "user_id": s['user_id'],
                    "name": s['name'], "email": s['email'],
                    "ip_address": s['ip_address'],
                    "login_at": s['login_at'].isoformat() if s['login_at'] else None,
                    "last_activity": s['last_activity'].isoformat() if s['last_activity'] else None,
                    "is_active": s['is_active']
                } for s in active_sessions_list
            ],
            "recent": [
                {
                    "id": s['id'], "name": s['name'], "email": s['email'],
                    "ip_address": s['ip_address'],
                    "login_at": s['login_at'].isoformat() if s['login_at'] else None,
                    "logout_at": s['logout_at'].isoformat() if s.get('logout_at') else None,
                    "is_active": s['is_active']
                } for s in sessions_data['recent_sessions']
            ]
        },
        "password_changes": [
            {
                "name": p['name'], "email": p['email'],
                "changed_at": p['changed_at'].isoformat() if p['changed_at'] else None,
                "method": p['method']
            } for p in pw_changes
        ]
    }), 200