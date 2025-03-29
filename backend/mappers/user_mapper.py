# mappers/user_mapper.py

from db import db
from models.user_model import User
from sqlalchemy import text

class UserMapper:
    
    @staticmethod
    def createUser(firebase_uid, email, username):
        new_user = User(firebase_uid=firebase_uid, email=email, username=username)
        db.session.add(new_user)
        db.session.commit()
        return new_user.to_dict()
    
    @staticmethod
    def getUserByID(user_id):
        user = User.query.get(user_id)
        if user:
            return user.to_dict()
        return None
    
    @staticmethod
    def getUserByUsername(username):
        user = User.query.filter_by(username=username).first()
        if user:
            return user.to_dict()
        return None
    
    @staticmethod
    def getUserByFirebaseUID(firebase_uid):
        user = User.query.filter_by(firebase_uid=firebase_uid).first()
        if user:
            return user.to_dict()
        return None
    
    @staticmethod
    def updateUserProfile(firebase_uid, email, username):
        user = User.query.filter_by(firebase_uid=firebase_uid).first()
        if user:
            user.email = email
            user.username = username
            db.session.commit()
            return user.to_dict()
        return None
    
    @staticmethod
    def deleteUser(firebase_uid):
        user = User.query.filter_by(firebase_uid=firebase_uid).first()
        if user:
            db.session.delete(user)
            db.session.commit()
            return True
        return False

