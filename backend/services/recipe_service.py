from db import db
from models.recipe_model import Recipe
from mappers.recipe_mapper import RecipeMapper
import requests
import random

class RecipeService:

    @staticmethod
    def seed_dummy_data():
        usernames = [
            "chef_ava92", "cookmaster88", "gourmet_guy", "foodie_fan", "kitchenqueen",
            "saucysarah", "grillguru", "bakingboss", "tastytim", "nourishnina",
            "quickchef", "yumilicious", "mealmaster", "snackzilla", "theflavourist"
        ]

        response = requests.get("https://dummyjson.com/recipes?limit=100&skip=0")
        if response.status_code != 200:
            print("Failed to fetch recipes")
            return

        data = response.json()
        recipes = data.get("recipes", [])

        existing_names = {r.name for r in Recipe.query.with_entities(Recipe.name).all()}
        new_recipes = []

        for item in recipes:
            if item["name"] in existing_names:
                continue
            
            prep = item.get("prepTimeMinutes") or 0
            cook = item.get("cookTimeMinutes") or 0
            total_minutes = prep + cook
            cooking_time = f"{total_minutes} mins" if total_minutes else "Unknown"

            tags = ", ".join(item.get("tags", []))
            ingredients = "\n".join(item.get("ingredients", []))
            instructions = "\n".join([f"{idx+1}. {step}" for idx, step in enumerate(item.get("instructions", []))])
            cuisine = item.get("cuisine", "global")
            description = f"A delicious {cuisine.lower()} dish"

            new_recipe = Recipe(
                image=item.get("image", ""),
                name=item["name"],
                username=random.choice(usernames),
                tags=tags,
                cooking_time=cooking_time,
                minutes=total_minutes,
                servings=item.get("servings", 0),
                ingredients=ingredients,
                description=description,
                instructions=instructions,
                tips="", 
                isBookmarked=False
            )

            new_recipes.append(new_recipe)

        if new_recipes:
            db.session.add_all(new_recipes)
            db.session.commit()
            print(f"{len(new_recipes)} recipes successfully seeded.")
        else:
            print("No new recipes to insert.")

    @staticmethod
    def get_all_recipes():
        return RecipeMapper.getAllRecipes()

    @staticmethod
    def get_recipe_by_id(recipe_id):
        return RecipeMapper.getRecipeByID(recipe_id)

    @staticmethod
    def create_recipe(data):
        return RecipeMapper.createRecipe(data)

    @staticmethod
    def delete_recipe_by_id(recipe_id):
        return RecipeMapper.deleteRecipeByID(recipe_id)
    
    @staticmethod
    def delete_all_recipe():
        deleted_count = RecipeMapper.deleteAllRecipes()
        return deleted_count
    
    @staticmethod
    def update_recipe(recipe_id, data):
        return RecipeMapper.updateRecipe(recipe_id, data)


    @staticmethod
    def get_recipes_by_tags(tags):
        all_recipes = Recipe.query.all()
        filtered_recipes = []
        
        for recipe in all_recipes:
            if not recipe.tags:
                continue
            
            recipe_tags = set(recipe.tags.lower().split(','))
            search_tags = set(tag.lower() for tag in tags)
            
            # Check if all search tags are present in recipe tags
            if search_tags.issubset(recipe_tags):
                filtered_recipes.append(recipe.to_dict())
        
        return filtered_recipes

    @staticmethod
    def toggle_bookmark(username, recipe_id):
        return RecipeMapper.toggleBookmark(username, recipe_id)

    @staticmethod
    def get_user_bookmarks(username):
        return RecipeMapper.getUserBookmarks(username)

    @staticmethod
    def get_user_recipes(username):
        return RecipeMapper.getUserRecipes(username)

    @staticmethod
    def add_comment_to_recipe(recipe_id, username, comment_text):
        recipe = Recipe.query.get(recipe_id)
        if not recipe:
            return {"error": "Recipe not found"}, 404
        
        return RecipeMapper.addComment(recipe_id, username, comment_text)

    @staticmethod
    def rate_recipe(recipe_id, username, rating_value):
        if rating_value < 1 or rating_value > 5:
            return {"error": "Rating must be between 1 and 5"}, 400
        
        recipe = Recipe.query.get(recipe_id)
        if not recipe:
            return {"error": "Recipe not found"}, 404
        
        return RecipeMapper.addOrUpdateRating(recipe_id, username, rating_value)
    @staticmethod
    def get_recipes_by_tags(tags):
        all_recipes = Recipe.query.all()
        filtered_recipes = []

        for recipe in all_recipes:
            if not recipe.tags:
                continue

            recipe_tags = set(tag.strip().lower() for tag in recipe.tags.split(","))
            search_tags = set(tag.strip().lower() for tag in tags)

            if search_tags.issubset(recipe_tags):
                filtered_recipes.append(recipe.to_dict())

        return filtered_recipes
    
    @staticmethod
    def search_recipes(query):
        return RecipeMapper.searchRecipesByName(query)

    @staticmethod
    def query_recipes(query, tags, sort_by, order):
        all_recipes = Recipe.query.all()
        filtered = []

        for recipe in all_recipes:
            if query and query.strip():
                q = query.lower()
                if q not in recipe.name.lower() and q not in (recipe.description or "").lower():
                    continue

            if tags:
                recipe_tags = set(tag.strip().lower() for tag in (recipe.tags or "").split(","))
                if not set(tag.lower() for tag in tags).issubset(recipe_tags):
                    continue

            filtered.append(recipe)

        if sort_by:
            reverse = order == "desc"
            if sort_by == "time":
                try:
                    filtered.sort(key=lambda r: int(r.minutes or 0), reverse=reverse)
                except Exception:
                    pass
            elif sort_by == "name":
                filtered.sort(key=lambda r: r.name.lower(), reverse=reverse)

        return [r.to_dict() for r in filtered]
