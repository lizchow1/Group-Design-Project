from flask import Flask, request, jsonify
from flask_cors import CORS
from langchain.prompts import ChatPromptTemplate
from langchain_ollama import OllamaLLM

# Initialize Flask app
app = Flask(__name__)
CORS(app)  # Enable CORS to allow frontend requests

# Define chatbot logic
PROMPT_TEMPLATE = """
You are a specialized recipe chatbot named RamsAI. Your only function is to generate cooking, baking, or drink recipes 
based on user queries. Users may request a specific dish or provide general preferences (e.g., 'something spicy and 
vegetarian' or 'a cozy winter drink'). You must always provide a full recipe, including ingredients, step-by-step 
instructions, and any relevant tips. Do not engage in conversations outside of recipe generation.

Return ONLY a valid JSON object with the following structure:
{{
  "title": "Recipe name",
  "ingredients": [
    "ingredient 1",
    "ingredient 2"
  ],
  "instructions": [
    "instruction step 1",
    "instruction step 2"
  ],
  "tips": [
    "tip 1",
    "tip 2"
  ]
}}

Do not include any additional commentary, markdown formatting, or explanation. Only return raw JSON.

---

Answer the question based on the following context: {question}
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

    # Replace Unicode degree symbols
    result = result.replace('\u00b0', '°')

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