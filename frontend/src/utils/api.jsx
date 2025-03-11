const BASE_URL = "http://127.0.0.1:5000/api"; 

export const getRecipes = async () => {
    const response = await fetch(`${BASE_URL}/recipes`);
    return response.json();
};

export const getRecipeById = async (recipeId) => {
    const response = await fetch(`${BASE_URL}/recipes/${recipeId}`);
    return response.json();
};

export const createRecipe = async (recipeData) => {
    const response = await fetch(`${BASE_URL}/recipes`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(recipeData),
    });
    return response.json();
};

export const deleteRecipe = async (recipeId) => {
    const response = await fetch(`${BASE_URL}/recipes/deleteAll`, {
        method: "DELETE",
    });
    return response.json();
};

export const updateRecipe = async (recipeId, updatedData) => {
    const response = await fetch(`${BASE_URL}/recipes/update/${recipeId}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedData),
    });
    return response.json();
};

export const deleteRecipeByID = async (recipeId) => {
    const response = await fetch(`${BASE_URL}/recipes/delete/${recipeId}`, {
        method: "DELETE",
    });
    return response.json();
};

export const registerUser = async (firebaseToken, email, username) => {
    const response = await fetch(`${BASE_URL}/users/register`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ firebaseToken, email, username }),
    });
    return response.json();
};

export const loginUser = async (firebaseToken) => {
    const response = await fetch(`${BASE_URL}/users/login`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ firebaseToken }),
    });
    return response.json();
};

export const getUserByFirebaseUID = async (firebase_uid) => {
    const response = await fetch(`${BASE_URL}/users/firebase/${firebase_uid}`);
    return response.json();
};

export const toggleBookmark = async (recipeId, username) => {
    const response = await fetch(`${BASE_URL}/recipes/${recipeId}/bookmark`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ username }),
    });

    return response.json();
};

export const getBookmarkedRecipes = async (username) => {
    const response = await fetch(`${BASE_URL}/recipes/bookmarks/${username}`);
    return response.json();
  };
  
  export const getUserRecipes = async (username) => {
    const response = await fetch(`${BASE_URL}/recipes/user/${username}`);
    return response.json();
  };
  
  export const updateUserProfile = async (firebaseToken, email, username) => {
    const response = await fetch(`${BASE_URL}/users/profile`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ firebaseToken, email, username }),
    });
    return response.json();
};
