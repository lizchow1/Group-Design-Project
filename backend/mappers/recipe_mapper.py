from db import db
from models.recipe_model import Recipe

class RecipeMapper:

    @staticmethod
    def getAllRecipes():
        recipes = Recipe.query.all()
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