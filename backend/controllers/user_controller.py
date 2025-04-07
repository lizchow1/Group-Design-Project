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

# Get User By Firebase UID
@user_bp.route("/users/firebase/<string:firebase_uid>", methods=["GET"])
def get_user_by_firebase_uid(firebase_uid):
    user = UserService.get_user_by_firebase_uid(firebase_uid)
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

# Delete User by Firebase UID
@user_bp.route("/users/firebase/<string:firebase_uid>", methods=["DELETE"])
def delete_user(firebase_uid):
    result = UserService.delete_user(firebase_uid)
    if result.get("error"):
        return jsonify(result), 404
    return jsonify(result), 200

# Follow a user
@user_bp.route("/users/<string:username>/follow", methods=["POST"])
def follow_user(username):
    data = request.get_json() or {}
    data["username"] = username 
    result = UserService.follow_user(data)
    if result.get("error"):
        return jsonify(result), 400
    return jsonify(result), 201

# Unfollow a user
@user_bp.route("/users/<string:username>/unfollow", methods=["POST"])
def unfollow_user(username):
    data = request.get_json() or {}
    data["username"] = username 
    result = UserService.unfollow_user(data)
    if result.get("error"):
        return jsonify(result), 400
    return jsonify(result), 200

# Get user followers
@user_bp.route("/users/<string:username>/followers", methods=["GET"])
def get_followers(username):
    page = request.args.get('page', 1, type=int)
    per_page = request.args.get('per_page', 20, type=int)
    result = UserService.get_followers(username, page, per_page)
    if result.get("error"):
        return jsonify(result), 404
    return jsonify(result), 200

# Get users that a user is following
@user_bp.route("/users/<string:username>/following", methods=["GET"])
def get_following(username):
    page = request.args.get('page', 1, type=int)
    per_page = request.args.get('per_page', 20, type=int)
    result = UserService.get_following(username, page, per_page)
    if result.get("error"):
        return jsonify(result), 404
    return jsonify(result), 200

# Check if current user is following another user
@user_bp.route("/users/<string:username>/follow/check", methods=["POST"])
def check_follow_status(username):
    data = request.get_json() or {}
    data["username"] = username
    result = UserService.check_follow_status(data)
    if result.get("error"):
        return jsonify(result), 400
    return jsonify(result), 200

