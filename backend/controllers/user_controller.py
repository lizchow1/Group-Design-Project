# controllers/user_controller.py

from flask import Blueprint, jsonify, request
from services.user_service import UserService

user_bp = Blueprint("user", __name__)

# Seed Dummy Users Randomly (one request will generate 2 different users)
@user_bp.route("/users/seed", methods=["POST"])
def seed_dummy_users():
    seeded_users = UserService.seed_dummy_data()
    return jsonify({
        "message": "Dummy users seeded successfully",
        "seeded_users": seeded_users
    }), 200

# User Registration
@user_bp.route("/users/register", methods=["POST"])
def register_user():
    data = request.get_json()
    result = UserService.register_user(data)
    if result.get("error"):
        return jsonify(result), 400
    return jsonify(result), 201

# User Login
@user_bp.route("/users/login", methods=["POST"])
def login_user():
    data = request.get_json()
    result = UserService.login_user(data)
    if result.get("error"):
        return jsonify(result), 400
    return jsonify(result), 200

# Get User By ID
@user_bp.route("/users/<int:user_id>", methods=["GET"])
def get_user_by_id(user_id):
    user = UserService.get_user_by_id(user_id)
    if user:
        return jsonify(user), 200
    return jsonify({"error": "User not found"}), 404

# Get User By Username
@user_bp.route("/users/username/<string:username>", methods=["GET"])
def get_user_by_username(username):
    user = UserService.get_user_by_username(username)
    if user:
        return jsonify(user), 200
    return jsonify({"error": "User not found"}), 404

# Update User Profile
@user_bp.route("/users/profile", methods=["PUT"])
def update_user_profile():
    data = request.get_json()
    result = UserService.update_user_profile(data)
    if result.get("error"):
        return jsonify(result), 400
    return jsonify(result), 200
