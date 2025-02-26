# services/user_service.py

from mappers.user_mapper import UserMapper
import os
import firebase_admin
from firebase_admin import auth as firebase_auth, credentials

# Init Firebase Admin
cred_path = os.environ.get("FIREBASE_CREDENTIALS", "firebase_credentials.json")
print("Loading Firebase credentials from:", cred_path)
cred = credentials.Certificate(cred_path)

if not firebase_admin._apps:
    firebase_admin.initialize_app(cred)

class UserService:
    
    @staticmethod
    def seed_dummy_data():
        import random
        import string

        def generate_random_string(n):
            return ''.join(random.choice(string.ascii_lowercase) for _ in range(n))

        # 随机生成2个用户数据
        dummy_users = []
        for _ in range(2):
            random_suffix = generate_random_string(6)
            firebase_uid = "dummy_" + random_suffix
            email = f"user{random_suffix}@example.com"
            username = "user" + random_suffix
            dummy_users.append({
                "firebase_uid": firebase_uid,
                "email": email,
                "username": username
            })
        
        seeded_users = []
        # Avoid double insertion
        for user_data in dummy_users:
            existing_user = UserMapper.getUserByFirebaseUID(user_data["firebase_uid"])
            if not existing_user:
                new_user = UserMapper.createUser(user_data["firebase_uid"], user_data["email"], user_data["username"])
                seeded_users.append(new_user)
        return seeded_users
    
    @staticmethod
    def register_user(data):
        firebase_token = data.get("firebaseToken")
        email = data.get("email")
        username = data.get("username")
        
        if not firebase_token or not email or not username:
            return {"error": "Missing required fields"}
        
        # check Firebase Token
        try:
            decoded_token = firebase_auth.verify_id_token(firebase_token)
            firebase_uid = decoded_token["uid"]
        except Exception as e:
            return {"error": "Invalid firebase token"}
        
        # check if user already registered（according to firebase_uid）
        existing_user = UserMapper.getUserByFirebaseUID(firebase_uid)
        if existing_user:
            return {"error": "User already registered"}
        
        # create new user
        user = UserMapper.createUser(firebase_uid, email, username)
        return user
    
    @staticmethod
    def login_user(data):
        firebase_token = data.get("firebaseToken")
        if not firebase_token:
            return {"error": "Missing firebase token"}
        
        try:
            decoded_token = firebase_auth.verify_id_token(firebase_token)
            firebase_uid = decoded_token["uid"]
        except Exception as e:
            return {"error": "Invalid firebase token"}
        
        # check if user already registered
        user = UserMapper.getUserByFirebaseUID(firebase_uid)
        if not user:
            return {"error": "User not registered"}
        return user
    
    @staticmethod
    def get_user_by_id(user_id):
        return UserMapper.getUserByID(user_id)
    
    @staticmethod
    def get_user_by_username(username):
        return UserMapper.getUserByUsername(username)

    @staticmethod
    def update_user_profile(data):
        firebase_token = data.get("firebaseToken")
        new_email = data.get("email")
        new_username = data.get("username")
        
        if not firebase_token:
            return {"error": "Missing firebase token"}
        
        try:
            decoded_token = firebase_auth.verify_id_token(firebase_token)
            firebase_uid = decoded_token["uid"]
        except Exception as e:
            return {"error": "Invalid firebase token"}
        
        # check if user already registered
        user = UserMapper.getUserByFirebaseUID(firebase_uid)
        if not user:
            return {"error": "User not registered"}
        
        # update user profile
        updated_user = UserMapper.updateUserProfile(firebase_uid, new_email, new_username)
        if not updated_user:
            return {"error": "Failed to update user profile"}
        return updated_user

