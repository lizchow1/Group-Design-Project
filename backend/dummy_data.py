from models.user_model import User
from models.recipe_model import Recipe
from models.comment_model import Comment
from models.rating_model import Rating
from models.bookmark_model import Bookmark
from models.follow_model import Follow
from db import db
import requests
import random

def insert_dummy_data():
    users = [
        User(firebase_uid="uid_123", email="alice@example.com", username="alice"),
        User(firebase_uid="uid_456", email="bob@example.com", username="bob"),
        User(firebase_uid="uid_789", email="carol@example.com", username="carol")
    ]
    db.session.add_all(users)
    db.session.commit()

    usernames = ["alice", "bob", "carol"]
    tips = ["Add chocolate!", "Able to freeze and enjoy later!", "Good at any time of day!"]

    response = requests.get("https://dummyjson.com/recipes?limit=100&skip=0")
    if response.status_code == 200:
        data = response.json()
        recipes = data.get("recipes", [])

        existing_names = {r.name for r in Recipe.query.with_entities(Recipe.name).all()}
        new_recipes = []

        for item in recipes:
            if item["name"] in existing_names:
                continue

            prep = item.get("prepTimeMinutes") or 0
            cook = item.get("cookTimeMinutes") or 0
            total_minutes = prep + cook
            cooking_time = f"{total_minutes} mins" if total_minutes else "Unknown"

            tags = ", ".join(item.get("tags", []))
            ingredients = "\n".join(item.get("ingredients", []))
            instructions = "\n".join([f"{idx+1}. {step}" for idx, step in enumerate(item.get("instructions", []))])
            cuisine = item.get("cuisine", "global")
            description = f"A delicious {cuisine.lower()} dish"

            recipe = Recipe(
                image=item.get("image", ""),
                name=item["name"],
                username=random.choice(usernames),
                tags=tags,
                cooking_time=cooking_time,
                minutes=total_minutes,
                servings=item.get("servings", 0),
                ingredients=ingredients,
                description=description,
                instructions=instructions,
                tips= random.choice(tips),
                isBookmarked=False
            )
            new_recipes.append(recipe)

        db.session.add_all(new_recipes)
        db.session.commit()
        print(f"{len(new_recipes)} recipes seeded.")
    else:
        print("Failed to fetch external recipes.")

    all_recipes = Recipe.query.all()
    recipe_ids = [r.id for r in all_recipes]

    usernames = ["alice", "bob", "carol"]
    sample_comments = [
        "Looks great!", "Can't wait to try this.",
        "Made it last night—so good!", "Yummy!",
        "Would add a bit more spice next time.",
        "Simple and delicious.", "My kids loved it!",
        "Perfect for a quick meal.", "New favorite dish!",
        "Thanks for sharing!"
    ]


    comments = []
    for _ in range(100):
        comment = Comment(
            recipe_id=random.choice(recipe_ids),
            username=random.choice(usernames),
            comment_text=random.choice(sample_comments)
        )
        comments.append(comment)

    db.session.add_all(comments)

    ratings = []
    seen_pairs = set()  

    for _ in range(40):  
        recipe_id = random.choice(recipe_ids)
        username = random.choice(usernames)
        pair = (recipe_id, username)
        if pair in seen_pairs:
            continue
        seen_pairs.add(pair)

        rating = Rating(
            recipe_id=recipe_id,
            username=username,
            rating_value=random.randint(3, 5) 
        )
        ratings.append(rating)

    db.session.add_all(ratings)

    bookmarks = [
        Bookmark(username="carol", recipe_id=1),
        Bookmark(username="bob", recipe_id=3),
    ]
    db.session.add_all(bookmarks)

    alice = User.query.filter_by(username="alice").first()
    bob = User.query.filter_by(username="bob").first()
    carol = User.query.filter_by(username="carol").first()

    follows = [
        Follow(follower_id=bob.id, followed_id=alice.id),
        Follow(follower_id=carol.id, followed_id=alice.id),
        Follow(follower_id=alice.id, followed_id=carol.id),
    ]
    db.session.add_all(follows)

    db.session.commit()
