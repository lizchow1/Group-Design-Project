from flask_sqlalchemy import SQLAlchemy
import os
from sqlalchemy import text, create_engine

db = SQLAlchemy()


def init_db(app):
    db.init_app(app)
    with app.app_context():
        db_uri = app.config['SQLALCHEMY_DATABASE_URI']
        db_path = db_uri.replace("sqlite:///", "")
        desired_version = app.config.get("SCHEMA_VERSION", 0)
    
        if os.path.exists(db_path):
            engine = create_engine(db_uri)
            with engine.connect() as conn:
                result = conn.execute(text("PRAGMA user_version"))
                current_version = result.fetchone()[0]
            if current_version != desired_version:
                os.remove(db_path)
                print("Detected changes in the database schema. Deleting the existing database and creating a new one!")
        
        db.create_all()
        
        db.session.execute(text(f"PRAGMA user_version = {desired_version}"))
        db.session.commit()

