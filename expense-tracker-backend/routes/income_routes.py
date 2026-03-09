from flask import Blueprint, request, jsonify
from models.income import add_income, get_income, delete_income
from flask_jwt_extended import jwt_required, get_jwt_identity
from utils.categorizer import categorize_income

income_bp = Blueprint('income', __name__)

@income_bp.route('/income', methods=['POST'])
@jwt_required()
def add_income_route():
    data = request.get_json()
    user_id = get_jwt_identity()
    add_income(user_id, data['title'], data['amount'], data.get('source', ''))
    return jsonify({"message": "Income added successfully"}), 201

@income_bp.route('/income', methods=['GET'])
@jwt_required()
def get_income_route():
    user_id = get_jwt_identity()
    incomes = get_income(user_id)
    return jsonify([dict(i) for i in incomes]), 200

@income_bp.route('/income/<int:id>', methods=['DELETE'])
@jwt_required()
def delete_income_route(id):
    delete_income(id)
    return jsonify({"message": "Income deleted"}), 200

@income_bp.route('/income/categorize', methods=['POST'])
def categorize_income_route():
    data = request.get_json()
    desc = data.get('description', '')
    source = categorize_income(desc) if len(desc) >= 1 else "Other"
    return jsonify({ "source": source }), 200
