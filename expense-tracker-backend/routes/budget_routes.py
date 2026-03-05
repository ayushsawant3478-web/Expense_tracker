from flask import Blueprint, request, jsonify
from models.budget import set_budget, get_budgets
from flask_jwt_extended import jwt_required, get_jwt_identity

budget_bp = Blueprint('budget', __name__)

@budget_bp.route('/budget', methods=['POST'])
@jwt_required()
def set_budget_route():
    data = request.get_json()
    user_id = get_jwt_identity()
    set_budget(user_id, data['category'], data['limit_amount'], data['month'])
    return jsonify({"message": "Budget set successfully"}), 201

@budget_bp.route('/budget', methods=['GET'])
@jwt_required()
def get_budget_route():
    user_id = get_jwt_identity()
    budgets = get_budgets(user_id)
    return jsonify([dict(b) for b in budgets]), 200