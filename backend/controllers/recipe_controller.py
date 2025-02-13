# controllers/recipe_controller.py

from flask import Blueprint, jsonify, request
from services.recipe_service import RecipeService

recipe_bp = Blueprint("recipe_bp", __name__)

# The front end can generate a POST to set dummy data
@recipe_bp.route("/recipes/seed", methods=["POST"])
def seed_data():
    RecipeService.seed_dummy_data()
    return jsonify({"message": "Dummy recipes seeded"}), 201

# return all recipes
@recipe_bp.route("/recipes", methods=["GET"])
def get_all_recipes():
    recipes = RecipeService.get_all_recipes()
    return jsonify([r.to_dict() for r in recipes]), 200

# get the recipe by id
@recipe_bp.route("/recipes/<int:recipe_id>", methods=["GET"])
def get_recipe(recipe_id):
    recipe = RecipeService.get_recipe_by_id(recipe_id)
    if not recipe:
        return jsonify({"error": "Recipe not found"}), 404
    return jsonify(recipe.to_dict()), 200
