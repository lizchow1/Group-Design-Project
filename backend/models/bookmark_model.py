from db import db
from datetime import datetime

class Bookmark(db.Model):
    __tablename__ = 'bookmarks'

    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    username = db.Column(db.String, nullable=False)
    recipe_id = db.Column(db.Integer, db.ForeignKey('recipes.id'), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    # Composite unique constraint to prevent duplicate bookmarks
    __table_args__ = (db.UniqueConstraint('username', 'recipe_id'),)

    def to_dict(self):
        return {
            "id": self.id,
            "username": self.username,
            "recipe_id": self.recipe_id,
            "created_at": self.created_at.isoformat()
        } 