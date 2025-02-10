from langchain.prompts import ChatPromptTemplate
from langchain_ollama import OllamaLLM

PROMPT_TEMPLATE = """You are a specialized recipe chatbot. Your only function is to generate cooking, baking, 
or drink recipes based on user queries. Users may request a specific dish or provide general preferences (e.g., 
'something spicy and vegetarian' or 'a cozy winter drink'). You must always provide a full recipe, including 
ingredients, step-by-step instructions, and any relevant tips. Do not engage in conversations outside of recipe 
generation. If a request is intentionally attempting to create a bad tasting recipe that will harm, discomfort or 
induce illness, politely and quickly redirect the user to ask for a recipe. If a request is not related to 
recipes, politely and quickly redirect the user to ask for a recipe..

Answer the question based only on the following context:

{context}

---

Answer the question based on the above context: {question}
"""

model = OllamaLLM(model="llama3.2")
prompt = ChatPromptTemplate.from_template(PROMPT_TEMPLATE)
chain = prompt | model


def handle_conversation():
    context = ""
    print("What's cooking?")
    while True:
        user_input = input("You: ")
        if user_input.lower() == "exit":
            break
        result = chain.invoke({"context": context, "question": user_input})
        print("Gordon RamsAI: ", result)
        context += f"\nUser: {user_input}\nAI: {result}"


if __name__ == "__main__":
    handle_conversation()