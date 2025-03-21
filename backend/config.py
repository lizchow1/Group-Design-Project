import os

BASE_DIR = os.path.abspath(os.path.dirname(__file__))
SQLALCHEMY_DATABASE_URI = f"sqlite:///{os.path.join(BASE_DIR, 'database.sqlite')}"
SQLALCHEMY_TRACK_MODIFICATIONS = False

# Database Version
SCHEMA_VERSION = 1.0
