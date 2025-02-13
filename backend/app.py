from flask import Flask
from db import db, init_db
from flask_migrate import Migrate
from controllers.user_controller import user_bp

app = Flask(__name__)
app.config.from_object("config")

init_db(app)

app.register_blueprint(user_bp, url_prefix="/api")

if __name__ == "__main__":
    app.run(debug=True)

