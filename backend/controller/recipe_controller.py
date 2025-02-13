# controllers/user_controller.py
from flask import Blueprint, request, jsonify
from flask_cors import cross_origin
from service.user_service import get_users, create_user, remove_user

users_bp = Blueprint('users', __name__)

# 获取所有用户
@users_bp.route('/users', methods=['GET'])
@cross_origin(origin='http://localhost:5173')
def get_all_users():
    return jsonify(get_users())

# 添加用户
@users_bp.route('/users', methods=['POST'])
@cross_origin(origin='http://localhost:5173')
def add_user():
    data = request.get_json()
    if not data or 'name' not in data or 'age' not in data:
        return jsonify({'error': 'Invalid data'}), 400

    create_user(data['name'], data['age'])
    return jsonify({'message': 'User created'}), 201

# 删除用户
@users_bp.route('/users/<int:user_id>', methods=['DELETE'])
@cross_origin(origin='http://localhost:5173')
def delete_user_by_id(user_id):
    remove_user(user_id)
    return jsonify({'message': 'User deleted'})
