from flask import Blueprint, jsonify, request
from services.recipe_service import RecipeService
from services.user_service import UserService

recipe_bp = Blueprint("recipe", __name__)

# Get All Recipes
@recipe_bp.route("/recipes", methods=["GET"])
def get_all_recipes():
    recipes = RecipeService.get_all_recipes()
    return jsonify(recipes), 200

# Set Seed Dummy Data
@recipe_bp.route("/recipes/seed", methods=["POST"])
def seed_dummy_data():
    RecipeService.seed_dummy_data()
    return jsonify({"message": "Dummy data seeded successfully"}), 200

# Get Recipe By ID
@recipe_bp.route("/recipes/<int:recipe_id>", methods=["GET"])
def get_recipe_by_id(recipe_id):
    recipe = RecipeService.get_recipe_by_id(recipe_id)
    if recipe:
        return jsonify(recipe), 200
    return jsonify({"error": "Recipe not found"}), 404

# Create Recipe
@recipe_bp.route("/recipes", methods=["POST"])
def create_recipe():
    data = request.get_json()
    new_recipe = RecipeService.create_recipe(data)
    return jsonify(new_recipe), 201

# Delete Recipe By ID
@recipe_bp.route("/recipes/delete/<int:recipe_id>", methods=["DELETE"])
def delete_recipe(recipe_id):
    success = RecipeService.delete_recipe_by_id(recipe_id)
    if success:
        return jsonify({"message": "Recipe deleted successfully"}), 200
    return jsonify({"error": "Recipe not found"}), 404

# Delete All Recipes
@recipe_bp.route("/recipes/deleteAll", methods=["DELETE"])
def delete_all_recipe():
    deleted_count = RecipeService.delete_all_recipe()

    if deleted_count > 0:
        return jsonify({
            "message": "All recipes deleted successfully",
            "deleted_count": deleted_count
        }), 200
    
    return jsonify({
            "message": "No recipes found",
            "deleted_count": deleted_count    
        }), 200
    
# Update Recipe By Recipe Creator
@recipe_bp.route("/recipes/update/<int:recipe_id>", methods=["PUT"])
def update_recipe(recipe_id):
    data = request.get_json()
    updated_recipe = RecipeService.update_recipe(recipe_id, data)
    if updated_recipe:
        return jsonify(updated_recipe), 200
    return jsonify({"error": "Recipe not found or update failed"}), 404

# Get Recipes By Tags
@recipe_bp.route("/recipes/filter", methods=["GET"])
def get_recipes_by_tags():
    tags = request.args.getlist('tags')
    if not tags:
        return jsonify({"error": "No tags provided"}), 400
    
    filtered_recipes = RecipeService.get_recipes_by_tags(tags)
    return jsonify(filtered_recipes), 200

# Toggle recipe bookmark
@recipe_bp.route("/recipes/<int:recipe_id>/bookmark", methods=["POST"])
def toggle_bookmark(recipe_id):
    data = request.get_json()
    username = data.get("username")
    
    if not username:
        return jsonify({"error": "Username is required"}), 400
    
    result = RecipeService.toggle_bookmark(username, recipe_id)
    if result.get("error"):
        return jsonify(result), 400
    return jsonify(result), 200

# Get user's bookmarked recipes
@recipe_bp.route("/recipes/bookmarks/<string:username>", methods=["GET"])
def get_bookmarked_recipes(username):
    bookmarked_recipes = RecipeService.get_user_bookmarks(username)
    return jsonify(bookmarked_recipes), 200

# Toggle following a user
@recipe_bp.route("/users/<string:username>/follow", methods=["POST"])
def toggle_follow_user(username):
    data = request.get_json()
    follower_username = data.get("follower_username")
    
    if not follower_username:
        return jsonify({"error": "Follower username is required"}), 400
    
    if follower_username == username:
        return jsonify({"error": "Users cannot follow themselves."}), 400
    
    result = UserService.toggle_follow(follower_username, username)
    if result.get("error"):
        return jsonify(result), 400
    return jsonify(result), 200



# Get all recipes created by a user
@recipe_bp.route("/recipes/user/<string:username>", methods=["GET"])
def get_user_recipes(username):
    recipes = RecipeService.get_user_recipes(username)
    return jsonify(recipes), 200
