from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from models.goal import add_goal, get_goals, update_goal_savings, delete_goal

goal_bp = Blueprint('goal', __name__)

@goal_bp.route('/goals', methods=['POST'])
@jwt_required()
def add_goal_route():
    data = request.get_json()
    user_id = get_jwt_identity()
    add_goal(user_id, data['name'], data['target_amount'], data.get('saved_amount', 0), data.get('deadline'))
    return jsonify({"message": "Goal added successfully"}), 201

@goal_bp.route('/goals', methods=['GET'])
@jwt_required()
def get_goals_route():
    user_id = get_jwt_identity()
    goals = get_goals(user_id)
    return jsonify([dict(g) for g in goals]), 200

@goal_bp.route('/goals/<int:id>', methods=['PUT'])
@jwt_required()
def update_goal_route(id):
    data = request.get_json()
    update_goal_savings(id, data['saved_amount'])
    return jsonify({"message": "Goal updated successfully"}), 200

@goal_bp.route('/goals/<int:id>', methods=['DELETE'])
@jwt_required()
def delete_goal_route(id):
    delete_goal(id)
    return jsonify({"message": "Goal deleted"}), 200
