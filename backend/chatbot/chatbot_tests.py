import pytest
from backend.chatbot.chatbot import app


@pytest.fixture
def client():
    app.config["TESTING"] = True
    with app.test_client() as client:
        yield client


def test_chat_endpoint(client):
    response = client.post("/chat", json={"message": "Give me a chocolate cake recipe"})
    assert response.status_code == 200
    data = response.get_json()
    assert "response" in data
    assert isinstance(data["response"], str)
    assert len(data["response"]) > 0  # Ensures we get a response


def test_chat_empty_message(client):
    response = client.post("/chat", json={"message": ""})
    assert response.status_code == 400
    data = response.get_json()
    assert "error" in data
    assert data["error"] == "No message provided"


def test_reset_endpoint(client):
    response = client.post("/reset")
    assert response.status_code == 200
    data = response.get_json()
    assert data["message"] == "Chat context reset."
