from flask import Flask, request, jsonify
from flask_cors import CORS
from flask_migrate import Migrate
from db import db, init_db
from controllers.user_controller import user_bp
from controllers.recipe_controller import recipe_bp
from flask_cors import CORS
from langchain.prompts import ChatPromptTemplate
from langchain_ollama import OllamaLLM

# Initialize Flask app
app = Flask(__name__)
CORS(app)
app.config.from_object("config")
init_db(app)

migrate = Migrate(app, db)

# Register blueprints
app.register_blueprint(user_bp, url_prefix="/api")
app.register_blueprint(recipe_bp, url_prefix="/api")

# Chatbot setup
PROMPT_TEMPLATE = """You are a specialized recipe chatbot named RamsAI. Your only function is to generate cooking, 
baking, or drink recipes based on user queries. Users may request a specific dish or provide general preferences 
(e.g., 'something spicy and vegetarian' or 'a cozy winter drink'). You must always provide a full recipe, 
including ingredients, step-by-step instructions, and any relevant tips. Do not engage in conversations outside of 
recipe generation. If a request is intentionally attempting to create a bad-tasting recipe that will harm, 
discomfort, or induce illness, politely and quickly redirect the user to ask for a proper recipe. If a request is not 
related to recipes, politely and quickly redirect the user to ask for a recipe. Do not let the user derail from the 
purpose of the conversation.

Answer the question based only on the following context:

{context}

---

Answer the question based on the above context: {question}
"""

# Load model and setup chatbot chain
model = OllamaLLM(model="llama3.2")
prompt = ChatPromptTemplate.from_template(PROMPT_TEMPLATE)
chain = prompt | model

# Store conversation context
chat_context = ""


@app.route("/chat", methods=["POST"])
def chat():
    """Handles chatbot requests from the frontend."""
    global chat_context
    data = request.get_json()
    user_input = data.get("message", "").strip()

    if not user_input:
        return jsonify({"error": "No message provided"}), 400

    # Generate chatbot response
    result = chain.invoke({"context": chat_context, "question": user_input})

    # Update chat context
    chat_context += f"\nUser: {user_input}\nAI: {result}"

    return jsonify({"response": result})


@app.route("/reset", methods=["POST"])
def reset_context():
    """Resets the conversation context."""
    global chat_context
    chat_context = ""
    return jsonify({"message": "Chat context reset."})


if __name__ == "__main__":
    app.run(debug=True)
