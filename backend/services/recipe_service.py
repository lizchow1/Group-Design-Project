from db import db
from models.recipe_model import Recipe
from mappers.recipe_mapper import RecipeMapper

# dummy recipes for testing
DUMMY_RECIPES = [
    {
        "id": 1,
        "image": "https://images.pexels.com/photos/1059905/pexels-photo-1059905.jpeg",
        "name": "Vegan Cobb Salad",
        "username": "chef123",
        "tags": ["15 mins", "vegan", "easy"],
        "cooking_time": "15 mins",  # 新增
        "ingredients": "Lettuce, Tomato, Cucumber",  # 示例
        "description": "A healthy vegan salad",  # 示例
        "isBookmarked": False
    }
]

class RecipeService:

    @staticmethod
    def seed_dummy_data():
        # get recipe 'name' from database (Avoid double insertion)
        existing_names = {recipe.name for recipe in Recipe.query.with_entities(Recipe.name).all()}

        new_recipes = []

        for item in DUMMY_RECIPES:
            if item["name"] not in existing_names:
                tags_str = ",".join(item["tags"])
                recipe = Recipe(
                    image=item["image"],
                    name=item["name"],
                    username=item["username"],
                    tags=tags_str,
                    isBookmarked=item["isBookmarked"],
                )
                new_recipes.append(recipe)

        if new_recipes:
            db.session.add_all(new_recipes)
            db.session.commit()

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


