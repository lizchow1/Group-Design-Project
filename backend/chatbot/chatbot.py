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
vegetarian' or 'a cozy winter drink'). You must always provide a complete recipe.

You must ALWAYS include the following fields in your response:
- The recipe title, prefixed with `Title: `, and in BOLD FONT (e.g., `Title: Mango Iced Tea`).
- The number of servings, prefixed with `Servings: `.
- The time it takes to make the recipe, prefixed with `Time: `.
- A full list of ingredients, prefixed with `Ingredients: `.
- Step-by-step instructions, prefixed with `Instructions: `.
- Any relevant tips, prefixed with `Tips: `.

Return the recipe in the following plain text format EXACTLY. Do not include any additional commentary, explanation, or formatting.

**Title:** [Recipe Name]

**Servings:** [For how many people the recipe can make e.g. 6 servings]

**Time:** [Amount of Time Recipe Takes to Make e.g. 1 hour]

**Ingredients:**
- ingredient 1
- ingredient 2
- ingredient 3

**Instructions:**
1. instruction step 1
2. instruction step 2
3. instruction step 3

**Tips:**
- tip 1
- tip 2

---

You MUST specify the recipe title with "**Title:** ", the number of servings with "**Servings:** " and the time the 
recipe takes to make with "**Time:**".

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