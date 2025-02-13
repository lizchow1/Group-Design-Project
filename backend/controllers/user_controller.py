from flask import Blueprint, jsonify, request
from services.user_service import UserService

user_bp = Blueprint("user_bp", __name__)

@user_bp.route("/users", methods=["GET"])
def get_users():
    return jsonify(UserService.get_all_users())

@user_bp.route("/users", methods=["POST"])
def add_user():
    data = request.get_json()
    response = UserService.create_user(data)
    return jsonify(response)
