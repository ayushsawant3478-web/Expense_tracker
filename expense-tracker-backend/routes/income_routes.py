from flask import Blueprint, request, jsonify
from models.income import add_income, get_income_by_user, get_all_income, delete_income
from models.user import get_user_by_id
from models.logs import create_log
from models.security import get_excessive_deleters, log_suspicious_event
from flask_jwt_extended import jwt_required, get_jwt_identity
from utils.categorizer import categorize_income

income_bp = Blueprint('income', __name__)

@income_bp.route('/income', methods=['POST'])
@jwt_required()
def add_income_route():
    data = request.get_json()
    user_id = get_jwt_identity()
    add_income(user_id, data['title'], data['amount'], data.get('source', ''), data.get('date'))
    create_log(user_id, f'Added income: {data["title"]} ₹{data["amount"]}')
    return jsonify({"message": "Income added successfully"}), 201

@income_bp.route('/income', methods=['GET'])
@jwt_required()
def get_income_route():
    user_id = get_jwt_identity()
    user = get_user_by_id(user_id)
    
    if user and user['role'] == 'admin':
        incomes = get_all_income()
    else:
        incomes = get_income_by_user(user_id)
    
    return jsonify([dict(i) for i in incomes]), 200

@income_bp.route('/income/<int:id>', methods=['DELETE'])
@jwt_required()
def delete_income_route(id):
    user_id = get_jwt_identity()
    delete_income(id)
    create_log(user_id, f'Deleted income ID: {id}')

    # Excessive deletion check: >10 deletions in 1 hour
    deleters = get_excessive_deleters(threshold=10, hours=1)
    for d in deleters:
        if str(d['id']) == str(user_id):
            user = get_user_by_id(user_id)
            log_suspicious_event(
                event_type='EXCESSIVE_DELETIONS',
                detail=f"User deleted {d['deletion_count']} income records within 1 hour.",
                email=user['email'] if user else None,
                user_id=int(user_id),
                severity='high'
            )
            break

    return jsonify({"message": "Income deleted"}), 200

@income_bp.route('/income/categorize', methods=['POST'])
def categorize_income_route():
    data = request.get_json()
    desc = data.get('description', '')
    source = categorize_income(desc) if len(desc) >= 1 else "Other"
    return jsonify({ "source": source }), 200
