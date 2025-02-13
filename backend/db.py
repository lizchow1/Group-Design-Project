# db.py
import mysql.connector
from config import MYSQL_HOST, MYSQL_USER, MYSQL_PASSWORD, MYSQL_DATABASE

# 获取数据库连接
def get_connection():
    return mysql.connector.connect(
        host=MYSQL_HOST,
        user=MYSQL_USER,
        password=MYSQL_PASSWORD,
        database=MYSQL_DATABASE
    )

# 初始化数据库 & 表
def init_db():
    conn = mysql.connector.connect(
        host=MYSQL_HOST,
        user=MYSQL_USER,
        password=MYSQL_PASSWORD
    )
    cursor = conn.cursor()

    # 创建数据库（如果不存在）
    cursor.execute(f"CREATE DATABASE IF NOT EXISTS {MYSQL_DATABASE}")
    conn.commit()
    conn.close()

    # 连接到 GDP_DB
    conn = get_connection()
    cursor = conn.cursor()

    # 创建 users 表
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS users (
            id INT AUTO_INCREMENT PRIMARY KEY,
            name VARCHAR(100) NOT NULL,
            age INT NOT NULL
        )
    ''')
    conn.commit()
    conn.close()

# 运行初始化
init_db()
