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

export const createComment = async (recipeId, commentData) => {
    const response = await fetch(`${BASE_URL}/recipes/${recipeId}/comments`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(commentData),
    });
  
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || "Error submitting comment");
    }
  
    return response.json();
  };

  export const createRating = async (recipeId, ratingData) => {
    const response = await fetch(`${BASE_URL}/recipes/${recipeId}/rate`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(ratingData),
    });
  
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || "Error submitting rating");
    }
  
    return response.json();
  };

export const registerUser = async (firebaseToken, email, username, imageUrl) => {
    const response = await fetch(`${BASE_URL}/users/register`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ firebaseToken, email, username, image_url: imageUrl, }),
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
  
  export const updateUserProfile = async (firebaseToken, email, username, imageUrl) => {
    const response = await fetch(`${BASE_URL}/users/profile`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        firebaseToken,
        email,
        username,
        image_url: imageUrl,
      }),
    });
  
    return response.json();
  };
  

export const deleteUserFromDB = async (firebase_uid) => {
    const response = await fetch(`${BASE_URL}/users/firebase/${firebase_uid}`, {
        method: "DELETE",
    });
    return response.json();
};
  
export const getFilteredRecipes = async (tags) => {
    const query = tags.map(tag => `tags=${encodeURIComponent(tag)}`).join("&");
    const response = await fetch(`${BASE_URL}/recipes/filter?${query}`);
    return response.json();
};

export const getRecipesBySearch = async (query) => {
    const response = await fetch(`${BASE_URL}/recipes/search?query=${encodeURIComponent(query)}`);
    return response.json();
};

export const getSortedRecipes = async (sortBy, order = "asc") => {
    const response = await fetch(`${BASE_URL}/recipes/sort?by=${sortBy}&order=${order}`);
    return response.json();
  };  

  export const getCombinedRecipes = async ({ query = "", tags = [], sort = "", order = "asc" }) => {
    const tagParams = tags.map(tag => `tags=${encodeURIComponent(tag)}`).join("&");
    const fullQuery = `query=${encodeURIComponent(query)}&${tagParams}&sort=${sort}&order=${order}`;
    const response = await fetch(`${BASE_URL}/recipes/query?${fullQuery}`);
    return response.json();
  };  

export const followUser = async (targetUsername, followerUsername) => {
    const response = await fetch(`${BASE_URL}/users/${targetUsername}/follow`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ follower_username: followerUsername }),
    });
    return response.json();
  };
  
  export const unfollowUser = async (targetUsername, followerUsername) => {
    const response = await fetch(`${BASE_URL}/users/${targetUsername}/unfollow`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ follower_username: followerUsername }),
    });
    return response.json();
  };
  
  export const checkFollowStatus = async (targetUsername, followerUsername) => {
    const response = await fetch(`${BASE_URL}/users/${targetUsername}/follow/check`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ follower_username: followerUsername }),
    });
    return response.json();
  };
  
  export const getFollowers = async (username) => {
    const response = await fetch(`${BASE_URL}/users/${username}/followers`);
    return response.json();
  };
  
  export const getFollowing = async (username) => {
    const response = await fetch(`${BASE_URL}/users/${username}/following`);
    return response.json();
  };
  
  export const getUserByUsername = async (username) => {
    const response = await fetch(`${BASE_URL}/users/username/${username}`);
    return response.json();
  };
  