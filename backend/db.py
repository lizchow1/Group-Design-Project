from flask_sqlalchemy import SQLAlchemy
import os
from sqlalchemy import text, create_engine

db = SQLAlchemy()


def init_db(app):
    from dummy_data import insert_dummy_data

    db.init_app(app)
    with app.app_context():
        db_uri = app.config['SQLALCHEMY_DATABASE_URI']
        db_path = db_uri.replace("sqlite:///", "")
        desired_version = app.config.get("SCHEMA_VERSION", 0)

        first_creation = False

        if os.path.exists(db_path):
            from sqlalchemy import create_engine, text
            engine = create_engine(db_uri)
            with engine.connect() as conn:
                result = conn.execute(text("PRAGMA user_version"))
                current_version = result.fetchone()[0]
            if current_version != desired_version:
                os.remove(db_path)
                print("Detected changes in the database schema. Deleting the existing database and creating a new one!")
                first_creation = True
        else:
            first_creation = True

        db.create_all()

        from sqlalchemy import text
        db.session.execute(text(f"PRAGMA user_version = {desired_version}"))
        db.session.commit()

        if first_creation:
            print("Inserting dummy data...")
            insert_dummy_data()

