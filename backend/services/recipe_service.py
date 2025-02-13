# services/recipe_service.py

from db import db
from models.recipe_model import Recipe

# 这里就是你给出的前端模拟数据
DUMMY_RECIPES = [
    {
        "id": 1,
        "image": "https://images.pexels.com/photos/1059905/pexels-photo-1059905.jpeg",
        "name": "Vegan Cobb Salad",
        "username": "chef123",
        "tags": ["15 mins", "vegan", "easy"],
        "isBookmarked": False
    },
    {
        "id": 2,
        "image": "https://www.recipetineats.com/tachyon/2018/04/Chicken-Tikka-Masala_0-SQ.jpg",
        "name": "Tikki Masala",
        "username": "chef124",
        "tags": ["60 mins", "indian"],
        "isBookmarked": False
    },
    {
        "id": 3,
        "image": "https://eu.ooni.com/cdn/shop/articles/pepperoni-pizza_6ac5fa40-65b7-4e3b-a8b9-7ca5ccc05dfd.jpg",
        "name": "Gluten free pizza",
        "username": "chef125",
        "tags": ["30 mins", "italian", "comfort food", "easy"],
        "isBookmarked": False
    },
    {
        "id": 4,
        "image": "https://static01.nyt.com/images/2024/01/10/multimedia/ND-Shoyu-Ramen-qflv/ND-Shoyu-Ramen-qflv-mediumSquareAt3X.jpg",
        "name": "Ramen",
        "username": "chef126",
        "tags": ["45 mins", "asian", "comfort food"],
        "isBookmarked": False
    },
    {
        "id": 5,
        "image": "https://images.ctfassets.net/uexfe9h31g3m/6QtnhruEFi8qgEyYAICkyS/6e36729731887703608f28e92f10cb49/Spaghetti_bolognese_4x3_V2_LOW_RES.jpg",
        "name": "Vegan Spaghetti bolognese",
        "username": "chef127",
        "tags": ["30 mins", "healthy", "vegan"],
        "isBookmarked": False
    },
    {
        "id": 6,
        "image": "https://thebigmansworld.com/wp-content/uploads/2024/06/salmon-poke-bowl-recipe.jpg",
        "name": "Poke bowl",
        "username": "chef128",
        "tags": ["25 mins", "healthy", "easy"],
        "isBookmarked": False
    }
]

class RecipeService:

    @staticmethod
    def seed_dummy_data():
        """
        把 DUMMY_RECIPES 插入数据库。
        如果想避免重复插入，可以先检查表里是否已有数据，或者检查重复ID。
        """
        if Recipe.query.count() == 0:
            for item in DUMMY_RECIPES:
                # 把 tags 数组转成逗号分隔的字符串，用于存储数据库
                tags_str = ",".join(item["tags"])
                recipe = Recipe(
                    image=item["image"],
                    name=item["name"],
                    username=item["username"],
                    tags=tags_str,
                    isBookmarked=item["isBookmarked"],
                )
                # 如果想固定设置主键ID为 item["id"]，需要手动赋值
                # 注意自增主键一般不手动赋值，但这里是示例：
                recipe.id = item["id"]

                db.session.add(recipe)
            db.session.commit()

    @staticmethod
    def get_all_recipes():
        """查询所有菜谱返回列表。"""
        return Recipe.query.all()

    @staticmethod
    def get_recipe_by_id(recipe_id):
        """根据ID查询单个菜谱。"""
        return Recipe.query.get(recipe_id)

    @staticmethod
    def update_bookmark(recipe_id, is_bookmarked):
        """更新某个菜谱的收藏状态。"""
        recipe = Recipe.query.get(recipe_id)
        if recipe:
            recipe.isBookmarked = is_bookmarked
            db.session.commit()
            return True
        return False
