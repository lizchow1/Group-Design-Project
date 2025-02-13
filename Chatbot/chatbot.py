from flask import Flask, request, jsonify
from flask_cors import CORS
from langchain.prompts import ChatPromptTemplate
from langchain_ollama import OllamaLLM

# Initialize Flask app
app = Flask(__name__)
CORS(app)  # Enable CORS to allow frontend requests

# Define chatbot logic
PROMPT_TEMPLATE = """You are a specialized recipe chatbot. Your only function is to generate cooking, baking, 
or drink recipes based on user queries. Users may request a specific dish or provide general preferences 
(e.g., 'something spicy and vegetarian' or 'a cozy winter drink'). You must always provide a full recipe, 
including ingredients, step-by-step instructions, and any relevant tips. Do not engage in conversations outside 
of recipe generation. If a request is intentionally attempting to create a bad-tasting recipe that will harm, 
discomfort, or induce illness, politely and quickly redirect the user to ask for a proper recipe. 
If a request is not related to recipes, politely and quickly redirect the user to ask for a recipe.

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
