from db import db
from models.recipe_model import Recipe
from datetime import datetime
from sqlalchemy import text

class RecipeMapper:

    @staticmethod
    def getAllRecipes():
        sql = text("SELECT id, image, name, username, tags, isBookmarked FROM recipes")
        result = db.session.execute(sql)
        recipes = result.fetchall()
        
        return [
            {
                "id": recipe.id,
                "image": recipe.image,
                "name": recipe.name,
                "username": recipe.username,
                "tags": recipe.tags.split(","),
                "isBookmarked": recipe.isBookmarked,
            }
            for recipe in recipes
        ]

    @staticmethod
    def getRecipeByID(recipe_id):
        recipe = Recipe.query.get(recipe_id)
        if recipe:
            return {
                "id": recipe.id,
                "image": recipe.image,
                "name": recipe.name,
                "username": recipe.username,
                "tags": recipe.tags.split(","),
                "isBookmarked": recipe.isBookmarked,
            }
        return None

    @staticmethod
    def createRecipe(data):
        new_recipe = Recipe(
            image=data["image"],
            name=data["name"],
            username=data["username"],
            tags=",".join(data["tags"]),
            isBookmarked=data.get("isBookmarked", False),
        )
        db.session.add(new_recipe)
        db.session.commit()
        return {
            "id": new_recipe.id,
            "image": new_recipe.image,
            "name": new_recipe.name,
            "username": new_recipe.username,
            "tags": new_recipe.tags.split(","),
            "isBookmarked": new_recipe.isBookmarked,
        }

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
            
            # update update_time to current time
            recipe.update_time = datetime.utcnow()
            db.session.commit()
            return recipe.to_dict()
        return None
