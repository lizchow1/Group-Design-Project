### Step 1
run `pip install -r requirements.txt` to install all requirements

I added firebase. Here are the instructions.
1. Go to `Firebase`, right click `settings`, choose `Service Account`. Then generate a new private key.
![alt text](<src/img/截屏2025-02-19 18.15.57.png>)
2. Download the key. It will be a `.json` file.
3. Set the environment variable permanently
![alt text](<src/img/截屏2025-02-19 18.18.46.png>)
4. Check if the environment variable is set properly

Go to terminal, enter `echo $FIREBASE_CREDENTIALS`. If there is a return path, you set the environment variable properly.

### Step 2
Chatbot Instantiation

First, download and run Ollama

```sh
https://ollama.com/download
```

Second, run the following in backend:

```sh
ollama run llama3.2

**For Windows users, please ask ChatGPT! Sorry about that!**
#### Get All Recipes
1. URL: `/api/recipes`
2. Method: `GET`
3. Request format: `null`
4. Response format
```json
[
    {
        "id": 1,
        "image": "https://images.pexels.com/photos/1059905/pexels-photo-1059905.jpeg",
        "isBookmarked": false,
        "name": "Vegan Cobb Salad",
        "text": "Lorem ipsum",
        "tags": [
            "15 mins",
            "vegan",
            "easy"
        ],
        "username": "chef123"
    },
    {
        "id": 2,
        "image": "https://www.recipetineats.com/tachyon/2018/04/Chicken-Tikka-Masala_0-SQ.jpg",
        "isBookmarked": false,
        "name": "Tikki Masala",
        "text": "Lorem ipsum",
        "tags": [
            "60 mins",
            "indian"
        ],
        "username": "chef124"
    }
]
```
#### Set Seed Dummy Data
1. URL: `/api/recipes/seed`
2. Method: `POST`
3. Request format: `null`
4. Response format
```json
{
    "message": "Dummy data seeded successfully"
}
```
#### Get Recipe By ID
1. URL: `/api/recipes/<int:recipe_id>`
2. Method: `GET`
3. Request format: `<int:recipe_id>`
4. Response format
```json
{
    "id": 1,
    "image": "https://images.pexels.com/photos/1059905/pexels-photo-1059905.jpeg",
    "isBookmarked": false,
    "name": "Vegan Cobb Salad",
    "text": "Lorem ipsum",
    "tags": [
        "15 mins",
        "vegan",
        "easy"
    ],
    "username": "chef123"
}
```
```json
{
    "error": "Recipe not found"
}
```
#### Create Recipe
1. URL: `/api/recipes`
2. Method: `POST`
3. Request format: 
```json
{
    "image": "https://example.com/images/salad.jpg",
    "name": "Mediterranean Salad",
    "text": "Lorem ipsum",
    "username": "chef_mark",
    "tags": ["10 mins", "healthy", "vegetarian"],
    "isBookmarked": true
}
```
4. Response format
```json
{
    "id": 7,
    "image": "https://example.com/images/salad.jpg",
    "isBookmarked": true,
    "name": "Mediterranean Salad",
    "text": "Lorem ipsum",
    "tags": [
        "10 mins",
        "healthy",
        "vegetarian"
    ],
    "username": "chef_mark"
}
```

#### Delete Recipe By ID
1. URL: `/api/recipes/delete/<int:recipe_id>`
2. Method: `DELETE`
3. Request format: `<int:recipe_id>`
4. Response format:
```json
{
    "message": "Recipe deleted successfully"
}
```
```json
{
    "error": "Recipe not found"
}
```

#### Delete All Recipes
1. URL: `/api/recipes/deleteAll`
2. Method: `DELETE`
3. Request format: `null`
4. Response format:
```json
{
    "deleted_count": 6,
    "message": "All recipes deleted successfully"
}
```
```json
{
    "deleted_count": 0,
    "message": "No recipes found"
}
```


