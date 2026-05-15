from flask import Blueprint, request, jsonify
from models.expense import add_expense, get_expenses_by_user, get_all_expenses, delete_expense
from models.user import get_user_by_id
from models.logs import create_log
from models.security import get_excessive_deleters, log_suspicious_event
from flask_jwt_extended import jwt_required, get_jwt_identity
from utils.categorizer import categorize_expense

expense_bp = Blueprint('expense', __name__)

@expense_bp.route('/expenses', methods=['POST'])
@jwt_required()
def add_expense_route():
    data = request.get_json()
    user_id = get_jwt_identity()
    add_expense(user_id, data['title'], data['amount'], data['category'], data.get('note', ''), data.get('date'))
    create_log(user_id, f'Added expense: {data["title"]} ₹{data["amount"]}')
    return jsonify({"message": "Expense added successfully"}), 201

@expense_bp.route('/expenses', methods=['GET'])
@jwt_required()
def get_expenses_route():
    user_id = get_jwt_identity()
    user = get_user_by_id(user_id)
    
    if user and user['role'] == 'admin':
        expenses = get_all_expenses()
    else:
        expenses = get_expenses_by_user(user_id)
    
    return jsonify([dict(e) for e in expenses]), 200

@expense_bp.route('/expenses/<int:id>', methods=['DELETE'])
@jwt_required()
def delete_expense_route(id):
    user_id = get_jwt_identity()
    delete_expense(id)
    create_log(user_id, f'Deleted expense ID: {id}')

    # Excessive deletion check: >5 deletions in 1 hour triggers a security alert
    deleters = get_excessive_deleters(threshold=5, hours=1)
    for d in deleters:
        if str(d['id']) == str(user_id):
            user = get_user_by_id(user_id)
            log_suspicious_event(
                event_type='EXCESSIVE_DELETIONS',
                detail=f"User deleted {d['deletion_count']} expenses within 1 hour.",
                email=user['email'] if user else None,
                user_id=int(user_id),
                severity='high'
            )
            break

    return jsonify({"message": "Expense deleted"}), 200

@expense_bp.route('/expenses/categorize', methods=['POST'])
def categorize_expense_route():
    data = request.get_json()
    desc = data.get('description', '')
    category = categorize_expense(desc) if len(desc) >= 1 else "Other"
    return jsonify({ "category": category }), 200
