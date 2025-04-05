from db import db
from datetime import datetime

class Comment(db.Model):
    __tablename__ = 'comments'

    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    recipe_id = db.Column(db.Integer, db.ForeignKey('recipes.id'), nullable=False)
    username = db.Column(db.String, nullable=False)
    comment_text = db.Column(db.Text, nullable=False)
    create_time = db.Column(db.DateTime, default=datetime.utcnow, nullable=False)

    # Relationship back to the Recipe model
    # This lets you access "comment.recipe" and also "recipe.comments" in code
    recipe = db.relationship("Recipe", backref=db.backref("comments", lazy=True))

    def __init__(self, recipe_id, username, comment_text):
        self.recipe_id = recipe_id
        self.username = username
        self.comment_text = comment_text
        self.create_time = datetime.utcnow()

    def to_dict(self):
        return {
            "id": self.id,
            "username": self.username,
            "comment_text": self.comment_text,
            "create_time": self.create_time.isoformat()
        }
