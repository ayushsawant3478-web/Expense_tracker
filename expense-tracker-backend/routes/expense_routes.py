from flask import Blueprint, request, jsonify
from models.expense import add_expense, get_expenses, delete_expense
from flask_jwt_extended import jwt_required, get_jwt_identity
from utils.categorizer import categorize_expense

expense_bp = Blueprint('expense', __name__)

@expense_bp.route('/expenses', methods=['POST'])
@jwt_required()
def add_expense_route():
    data = request.get_json()
    user_id = get_jwt_identity()
    add_expense(user_id, data['title'], data['amount'], data['category'], data.get('note', ''))
    return jsonify({"message": "Expense added successfully"}), 201

@expense_bp.route('/expenses', methods=['GET'])
@jwt_required()
def get_expenses_route():
    user_id = get_jwt_identity()
    expenses = get_expenses(user_id)
    return jsonify([dict(e) for e in expenses]), 200

@expense_bp.route('/expenses/<int:id>', methods=['DELETE'])
@jwt_required()
def delete_expense_route(id):
    delete_expense(id)
    return jsonify({"message": "Expense deleted"}), 200

@expense_bp.route('/expenses/categorize', methods=['POST'])
def categorize_expense_route():
    data = request.get_json()
    desc = data.get('description', '')
    category = categorize_expense(desc) if len(desc) >= 1 else "Other"
    return jsonify({ "category": category }), 200
