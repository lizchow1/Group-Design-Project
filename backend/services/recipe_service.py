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
    },
    {
      "id": 2,
      "image": "https://www.recipetineats.com/tachyon/2018/04/Chicken-Tikka-Masala_0-SQ.jpg",
      "name": "Tikki Masala",
      "username": "chef124",
      "tags": ["60 mins", "indian"],
      "cooking_time": "15 mins",  # 新增
      "ingredients": "Lettuce, Tomato, Cucumber",  # 示例
      "description": "A healthy vegan salad",  # 示例
      "isBookmarked": False
    },
    {
      "id": 3,
      "image": "https://eu.ooni.com/cdn/shop/articles/pepperoni-pizza_6ac5fa40-65b7-4e3b-a8b9-7ca5ccc05dfd.jpg?crop=center&height=800&v=1737105987&width=800",
      "name": "Gluten free pizza",
      "username": "chef125",
      "tags": ["30 mins", "italian", "comfort food", "easy"],
      "cooking_time": "15 mins",  # 新增
      "ingredients": "Lettuce, Tomato, Cucumber",  # 示例
      "description": "A healthy vegan salad",  # 示例
      "isBookmarked": False
    },

    {
      "id": 4,
      "image": "https://static01.nyt.com/images/2024/01/10/multimedia/ND-Shoyu-Ramen-qflv/ND-Shoyu-Ramen-qflv-mediumSquareAt3X.jpg",
      "name": "Ramen",
      "username": "chef126",
      "tags": ["45 mins", "asian", "comfort food"],
      "cooking_time": "15 mins",  # 新增
      "ingredients": "Lettuce, Tomato, Cucumber",  # 示例
      "description": "A healthy vegan salad",  # 示例
      "isBookmarked": False
    },

    {
      "id": 5,
      "image": "https://images.ctfassets.net/uexfe9h31g3m/6QtnhruEFi8qgEyYAICkyS/6e36729731887703608f28e92f10cb49/Spaghetti_bolognese_4x3_V2_LOW_RES.jpg?w=768&h=512&fm=webp&fit=thumb&q=90",
      "name": "Vegan Spaghetti bolognese",
      "username": "chef127",
      "tags": ["30 mins", "healthy", "vegan"],
      "cooking_time": "15 mins",  # 新增
      "ingredients": "Lettuce, Tomato, Cucumber",  # 示例
      "description": "A healthy vegan salad",  # 示例
      "isBookmarked": False
    },

    {
      "id": 6,
      "image": "https://thebigmansworld.com/wp-content/uploads/2024/06/salmon-poke-bowl-recipe.jpg",
      "name": "Poke bowl",
      "username": "chef128",
      "tags": ["25 mins", "healthy", "easy"],
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
                    cooking_time=item["cooking_time"],  
                    ingredients=item["ingredients"],    
                    description=item["description"]
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

