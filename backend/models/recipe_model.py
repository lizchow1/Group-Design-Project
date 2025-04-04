from db import db
from datetime import datetime

class Recipe(db.Model):
    __tablename__ = 'recipes'

    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    image = db.Column(db.String, nullable=False)
    name = db.Column(db.String(100), nullable=False)
    username = db.Column(db.String, nullable=False)
    tags = db.Column(db.String, nullable=True)
    isBookmarked = db.Column(db.Boolean, default=False)
    cooking_time = db.Column(db.String, nullable=False)
    ingredients = db.Column(db.Text, nullable=True)
    description = db.Column(db.Text, nullable=True)
    create_time = db.Column(db.DateTime, default=datetime.utcnow, nullable=False)
    update_time = db.Column(db.DateTime, default=datetime.utcnow, nullable=False)
    minutes = db.Column(db.Integer, nullable=False)
    servings = db.Column(db.Integer, nullable=False)
    instructions = db.Column(db.Text, nullable=False)
    tips = db.Column(db.Text)

    def __init__(self, image, name, username, tags, cooking_time, ingredients, description, minutes, servings, instructions, tips, isBookmarked=False):
        self.image = image
        self.name = name
        self.username = username
        self.tags = tags
        self.cooking_time = cooking_time
        self.ingredients = ingredients
        self.description = description
        self.isBookmarked = isBookmarked
        self.create_time = datetime.utcnow()
        self.update_time = datetime.utcnow()
        self.minutes = minutes
        self.servings = servings
        self.instructions = instructions
        self.tips = tips

    def to_dict(self):
        # 计算平均评分
        rating_values = [r.rating_value for r in self.ratings]  # 来自于 relationships
        if len(rating_values) == 0:
            average_rating = 0.0
        else:
            avg_raw = sum(rating_values) / len(rating_values)
            # 将平均值四舍五入到 0.5 步长
            average_rating = round(avg_raw * 2) / 2

        return {
            "id": self.id,
            "image": self.image,
            "name": self.name,
            "username": self.username,
            "tags": self.tags.split(',') if self.tags else [],
            "cooking_time": self.cooking_time,
            "create_time": self.create_time.isoformat() if self.create_time else None,
            "ingredients": self.ingredients,
            "description": self.description,
            "update_time": self.update_time.isoformat() if self.update_time else None,
            "isBookmarked": self.isBookmarked,
            "minutes": self.minutes,
            "servings": self.servings,
            "instructions": self.instructions,
            "tips": self.tips,

            "comments": [
                {
                    "id": c.id,
                    "username": c.username,
                    "comment_text": c.comment_text,
                    "create_time": c.create_time.isoformat(),
                }
                for c in self.comments
            ],

            "rating": average_rating
        }


