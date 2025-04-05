# models/user_model.py

from db import db
from datetime import datetime

class User(db.Model):
    __tablename__ = 'users'
    
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    firebase_uid = db.Column(db.String, unique=True, nullable=False)
    email = db.Column(db.String, unique=True, nullable=False)
    username = db.Column(db.String(100), unique=True, nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    image_url = db.Column(db.String, nullable=True)
    
    followers = db.relationship(
        'Follow',
        foreign_keys='Follow.followed_id',
        backref=db.backref('followed', lazy='joined'),
        lazy='dynamic',
        cascade='all, delete-orphan'
    )
    
    following = db.relationship(
        'Follow',
        foreign_keys='Follow.follower_id',
        backref=db.backref('follower', lazy='joined'),
        lazy='dynamic',
        cascade='all, delete-orphan'
    )
    
    def __init__(self, firebase_uid, email, username):
        self.firebase_uid = firebase_uid
        self.email = email
        self.username = username
        
    def to_dict(self):
        return {
            "id": self.id,
            "firebase_uid": self.firebase_uid,
            "email": self.email,
            "username": self.username,
            "created_at": self.created_at.isoformat(),
            "image_url": self.image_url,
            "followers_count": self.followers.count(),
            "following_count": self.following.count()
        }
