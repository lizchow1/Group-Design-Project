# mappers/user_mapper.py
from db import get_connection
from models.user import User

# 添加用户
def insert_user(name, age):
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("INSERT INTO users (name, age) VALUES (%s, %s)", (name, age))
    conn.commit()
    conn.close()

# 删除用户
def delete_user(user_id):
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("DELETE FROM users WHERE id = %s", (user_id,))
    conn.commit()
    conn.close()

# 获取所有用户
def select_all_users():
    conn = get_connection()
    cursor = conn.cursor(dictionary=True)
    cursor.execute("SELECT * FROM users")
    users = [User(**row).to_dict() for row in cursor.fetchall()]
    conn.close()
    return users
