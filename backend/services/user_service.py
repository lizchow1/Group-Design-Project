from mappers.user_mapper import UserMapper

class UserService:
    @staticmethod
    def get_all_users():
        users = UserMapper.get_all_users()
        return [user.to_dict() for user in users]

    @staticmethod
    def create_user(data):
        """创建用户时，校验数据"""
        name = data.get("name")
        age = data.get("age")
        email = data.get("email")

        if not name or not age or not email:
            return {"error": "缺少必要字段"}, 400
        
        user = UserMapper.create_user(name, age, email)
        return user.to_dict()

