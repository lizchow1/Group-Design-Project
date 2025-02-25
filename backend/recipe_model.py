# models/recipe_model.py

from db import db
from datetime import datetime


class Recipe(db.Model):
    __tablename__ = 'recipes'

    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    image = db.Column(db.String, nullable=False)
    name = db.Column(db.String(100), nullable=False)
    text = db.Column(db.String, nullable=False)
    username = db.Column(db.String, nullable=False)
    tags = db.Column(db.String, nullable=True)
    isBookmarked = db.Column(db.Boolean, default=False)

    def __init__(self, image, name, text, username, tags, isBookmarked=False):
        self.image = image
        self.name = name
        self.text = text
        self.username = username
        self.tags = tags
        self.isBookmarked = isBookmarked

    def to_dict(self):
        return {
            "id": self.id,
            "image": self.image,
            "name": self.name,
            "text": self.text,
            "username": self.username,
            "tags": self.tags.split(',') if self.tags else [],
            "isBookmarked": self.isBookmarked
        }
