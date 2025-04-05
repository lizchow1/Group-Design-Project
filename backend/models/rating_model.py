from db import db
from datetime import datetime

class Rating(db.Model):
    __tablename__ = 'ratings'

    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    recipe_id = db.Column(db.Integer, db.ForeignKey('recipes.id'), nullable=False)
    username = db.Column(db.String, nullable=False)
    rating_value = db.Column(db.Integer, nullable=False)  # 1 through 5
    create_time = db.Column(db.DateTime, default=datetime.utcnow, nullable=False)

    # Relationship back to the Recipe model
    recipe = db.relationship("Recipe", backref=db.backref("ratings", lazy=True))

    def __init__(self, recipe_id, username, rating_value):
        self.recipe_id = recipe_id
        self.username = username
        self.rating_value = rating_value
        self.create_time = datetime.utcnow()

    def to_dict(self):
        return {
            "id": self.id,
            "username": self.username,
            "rating_value": self.rating_value,
            "create_time": self.create_time.isoformat()
        }
