from db import db
from models.recipe_model import Recipe
from datetime import datetime
from sqlalchemy import text
from models.bookmark_model import Bookmark

class RecipeMapper:

    @staticmethod
    def getAllRecipes():
        sql = text("""
            SELECT r.id, r.image, r.name, r.username, r.tags, r.cooking_time, 
                   r.isBookmarked, r.ingredients, r.description, r.minutes,
                   r.servings, r.instructions, r.tips
            FROM recipes r
        """)
        result = db.session.execute(sql)
        recipes = result.fetchall()
        
        return [
            {
                "id": recipe.id,
                "image": recipe.image,
                "name": recipe.name,
                "username": recipe.username,
                "tags": recipe.tags.split(",") if recipe.tags else [],
                "cooking_time": recipe.cooking_time,
                "ingredients": recipe.ingredients,
                "description": recipe.description,
                "isBookmarked": recipe.isBookmarked,
                "minutes": recipe.minutes,
                "servings": recipe.servings,
                "instructions": recipe.instructions,
                "tips": recipe.tips
            }
            for recipe in recipes
        ]

    @staticmethod
    def getRecipeByID(recipe_id):
        recipe = Recipe.query.get(recipe_id)
        if recipe:
            return recipe.to_dict()
        return None

    @staticmethod
    def createRecipe(data):
        new_recipe = Recipe(
            image=data["image"],
            name=data["name"],
            username=data["username"],
            tags=", ".join(data["tags"]) if isinstance(data["tags"], list) else data["tags"],
            cooking_time=data["cooking_time"],
            ingredients=data.get("ingredients", ""),
            description=data.get("description", ""),
            isBookmarked=data.get("isBookmarked", False),
            minutes=data.get("minutes", 0),
            servings=data.get("servings", 0),
            instructions=data.get("instructions", ""),
            tips=data.get("tips", "")
        )
        db.session.add(new_recipe)
        db.session.commit()
        return new_recipe.to_dict()


    @staticmethod
    def deleteRecipeByID(recipe_id):
        recipe = Recipe.query.get(recipe_id)
        if recipe:
            db.session.delete(recipe)
            db.session.commit()
            return True
        return False

    @staticmethod
    def deleteAllRecipes():
        deleted_count = Recipe.query.delete()
        db.session.commit()
        return deleted_count  # return the number of deleted records
    
    @staticmethod
    def updateRecipe(recipe_id, data):
        recipe = Recipe.query.get(recipe_id)
        if recipe:
            if "image" in data and data["image"] is not None:
                recipe.image = data["image"]
            if "name" in data and data["name"] is not None:
                recipe.name = data["name"]
            if "username" in data and data["username"] is not None:
                recipe.username = data["username"]
            if "tags" in data and data["tags"] is not None:
                recipe.tags = ",".join(data["tags"]) if isinstance(data["tags"], list) else data["tags"]
            if "cooking_time" in data and data["cooking_time"] is not None:
                recipe.cooking_time = data["cooking_time"]
            if "ingredients" in data and data["ingredients"] is not None:
                recipe.ingredients = data["ingredients"]
            if "description" in data and data["description"] is not None:
                recipe.description = data["description"]
            if "isBookmarked" in data and data["isBookmarked"] is not None:
                recipe.isBookmarked = data["isBookmarked"]
            if "minutes" in data and data["minutes"] is not None:
                recipe.minutes = data["minutes"]
            if "servings" in data and data["servings"] is not None:
                recipe.servings = data["servings"]
            if "instructions" in data and data["instructions"] is not None:
                recipe.instructions = data["instructions"]
            if "tips" in data and data["tips"] is not None:
                recipe.tips = data["tips"]
            
            # update update_time to current time
            recipe.update_time = datetime.utcnow()
            db.session.commit()
            return recipe.to_dict()
        return None

    @staticmethod
    def toggleBookmark(username, recipe_id):
        recipe = Recipe.query.get(recipe_id)
        if not recipe:
            return {"error": "Recipe not found"}

        existing_bookmark = Bookmark.query.filter_by(
            username=username,
            recipe_id=recipe_id
        ).first()

        if existing_bookmark:
            # Remove bookmark
            db.session.delete(existing_bookmark)
            db.session.commit()
            return {"message": "Bookmark removed", "isBookmarked": False}
        else:
            # Add bookmark
            new_bookmark = Bookmark(username=username, recipe_id=recipe_id)
            db.session.add(new_bookmark)
            db.session.commit()
            return {"message": "Bookmark added", "isBookmarked": True}

    @staticmethod
    def getUserBookmarks(username):
        # Get all bookmarked recipes for a user
        bookmarked_recipes = db.session.query(Recipe).join(
            Bookmark, Recipe.id == Bookmark.recipe_id
        ).filter(
            Bookmark.username == username
        ).all()

        return [recipe.to_dict() for recipe in bookmarked_recipes]

    @staticmethod
    def getUserRecipes(username):
        # Get all recipes created by the user
        recipes = Recipe.query.filter_by(username=username).all()
        return [recipe.to_dict() for recipe in recipes]
