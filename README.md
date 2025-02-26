# Let Me Cook

## Overview
Let Me Cook is an application to help users discover, share, and personalise recipes. The app acts as a collaborative space for a range of users, offering an easy-to-use interface to create and explore recipes, providing a way for users to enhance their culinary skills and promote healthy eating.

### Features:
- Browsing with infinite scroll
- Sign in and register with Firebase authentication
- "Gordon RamsAI" chatbot for recipe generation
- Upload recipes
- View saved recipes
- Edit user profiles

## Step by Step

### 1. Frontend Installation
1. Navigate to the frontend folder and install dependencies:
   ```sh
   cd frontend
   npm install
   ```
   
2. Install additional dependencies:
   ```sh
   npm install react-router-dom tailwindcss postcss autoprefixer
   ```

3. (Optional) Initialise Tailwind CSS:
   ```sh
   npx tailwindcss init -p
   ```

4. Firebase Backend Setup:
    - Go to [Firebase Console](https://console.firebase.google.com/)
    - Click `Settings` > `General` > `Your apps`
    - Add the following to the file firebaseConfig.jsx in file `frontend/src/utils/firebaseConfig.jsx`:
       ```javascript
       const firebaseConfig = {
         apiKey: "AIzaSyC2RZOAiSc8LvXd-q1_DbcDrCjMcX5h7V4",
         authDomain: "group-design-project-79e91.firebaseapp.com",
         projectId: "group-design-project-79e91",
         storageBucket: "group-design-project-79e91.firebasestorage.app",
         messagingSenderId: "915209196163",
         appId: "1:915209196163:web:889c48e3d81e4d4eb4c1b6",
         measurementId: "G-JDXDDYGQSQ"
       };
        ```

5. Run the application in development mode:
   ```sh
   npm run dev
   ```
   This will launch the app on a local development server.

### 2. Backend Setup
1. Navigate to the backend folder and install dependencies:
   ```sh
   cd backend
   pip install -r requirements.txt
   ```
2. Firebase Backend Setup:
   - Go to [Firebase Console](https://console.firebase.google.com/)
   - Click `Settings` > `Service Accounts` > Generate a new private key
   - Download the key (`.json` file) and set the environment variable permanently
   - Setting the Environment Variable Permanently (macOS zsh Users, Catalina and later)
        1. Open the terminal and edit the `~/.zshrc` file:
            ```sh
            nano ~/.zshrc
            ```
        2. Add the following line at the end of the file:
           ```sh
           export FIREBASE_CREDENTIALS="/Users/yecheng/Desktop/GroupDesign/firebase_credentials.json"
           ```
        3. Save and exit, then apply the changes:
           ```sh
           source ~/.zshrc
           ```
    - Verify the setup:
        ```sh
        echo $FIREBASE_CREDENTIALS
        ```
        If a path is returned, the variable is set correctly.

3. Download Ollama:
   ```sh
   https://ollama.com/download
   ```
4. Start the chatbot in the backend:
   ```sh
   ollama run llama3.2
   ```

5. Run the application in development mode:
   ```sh
   python3 app.py
   ```
   This will launch the app on a local development server.

## Backends
- Firebase Database: [Firebase Console](https://console.firebase.google.com/u/1/project/group-design-project-79e91/overview)
- Backend follows a structured architecture:
  - **Controller:** Handles incoming requests and routes them to the appropriate service.
  - **Service:** Contains business logic and communicates with data layers.
  - **Mapper/DAO/Repository:** Manages database interactions and CRUD operations.
  - **Models:** Define database schema and entity structure.