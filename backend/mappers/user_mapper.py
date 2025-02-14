from models.user_model import User
from db import db

class UserMapper:
    @staticmethod
    def get_all_users():
        return User.query.all()

    @staticmethod
    def get_user_by_id(user_id):
        return User.query.get(user_id)

    @staticmethod
    def create_user(name, age, email):
        new_user = User(name=name, age=age, email=email)
        db.session.add(new_user)
        db.session.commit()
        return new_user

    @staticmethod
    def delete_user(user_id):
        user = User.query.get(user_id)
        if user:
            db.session.delete(user)
            db.session.commit()
            return True
        return False
