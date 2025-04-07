from models.user_model import User
from models.recipe_model import Recipe
from models.comment_model import Comment
from models.rating_model import Rating
from models.bookmark_model import Bookmark
from db import db

def insert_dummy_data():
    users = [
        User(firebase_uid="uid_123", email="alice@example.com", username="alice"),
        User(firebase_uid="uid_456", email="bob@example.com", username="bob"),
        User(firebase_uid="uid_789", email="carol@example.com", username="carol")
    ]
    db.session.add_all(users)
    db.session.commit()

    recipes = [
        Recipe(
            image="http://example.com/spaghetti.jpg",
            name="Spaghetti Bolognese",
            username="alice",
            tags="pasta,italian",
            cooking_time="30 minutes",
            ingredients="Spaghetti, ground beef, tomato sauce, onions, garlic",
            description="A classic Italian pasta dish.",
            minutes=30,
            servings=2,
            instructions="1. Boil pasta.\n2. Cook beef.\n3. Mix with sauce.",
            tips="Use fresh tomatoes for better flavor."
        ),
        Recipe(
            image="http://example.com/curry.jpg",
            name="Vegetarian Curry",
            username="bob",
            tags="spicy,vegetarian,indian",
            cooking_time="40 minutes",
            ingredients="Chickpeas, coconut milk, curry powder, potatoes, carrots",
            description="A hearty and spicy vegetarian curry.",
            minutes=40,
            servings=4,
            instructions="1. Sauté veggies.\n2. Add spices.\n3. Simmer with coconut milk.",
            tips="Serve with basmati rice or naan."
        ),
        Recipe(
            image="http://example.com/lemonade.jpg",
            name="Fresh Lemonade",
            username="carol",
            tags="drink,sweet,summer",
            cooking_time="10 minutes",
            ingredients="Lemons, sugar, water, ice",
            description="A refreshing drink for hot days.",
            minutes=10,
            servings=3,
            instructions="1. Squeeze lemons.\n2. Mix with sugar and water.\n3. Add ice.",
            tips="Adjust sugar to taste."
        )
    ]
    db.session.add_all(recipes)
    db.session.commit()

    comments = [
        Comment(recipe_id=recipes[0].id, username="bob", comment_text="Delicious!"),
        Comment(recipe_id=recipes[1].id, username="carol", comment_text="Nice and spicy."),
        Comment(recipe_id=recipes[2].id, username="alice", comment_text="Perfect for summer.")
    ]
    db.session.add_all(comments)

    ratings = [
        Rating(recipe_id=recipes[0].id, username="bob", rating_value=5),
        Rating(recipe_id=recipes[0].id, username="carol", rating_value=4),
        Rating(recipe_id=recipes[1].id, username="alice", rating_value=5),
        Rating(recipe_id=recipes[2].id, username="alice", rating_value=3),
    ]
    db.session.add_all(ratings)

    bookmarks = [
        Bookmark(username="carol", recipe_id=recipes[0].id),
        Bookmark(username="bob", recipe_id=recipes[2].id),
    ]
    db.session.add_all(bookmarks)

    db.session.commit()
