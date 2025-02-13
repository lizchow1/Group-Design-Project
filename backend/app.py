# app.py
from flask import Flask
from flask_cors import CORS
from controller.user_controller import users_bp

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "http://localhost:5173"}})

app.register_blueprint(users_bp, url_prefix='/api')

@app.route('/helloworld')
def hello_world():
    return "Hello, World!"

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5001, debug=True)



