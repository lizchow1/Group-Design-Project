# services/user_service.py
from mapper.user_mapper import insert_user, delete_user, select_all_users

# 获取所有用户
def get_users():
    return select_all_users()

# 添加用户
def create_user(name, age):
    insert_user(name, age)

# 删除用户
def remove_user(user_id):
    delete_user(user_id)
