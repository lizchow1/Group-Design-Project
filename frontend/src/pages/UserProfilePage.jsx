import React, { useState, useEffect } from "react";
import { Typography, Box, CircularProgress } from "@mui/material";
import { useNavigate } from "react-router-dom";
import RecipeCard from "../components/RecipeCard";
import FriendsList from "../components/FriendsList";
import {
  getUserRecipes,
  getBookmarkedRecipes,
  toggleBookmark,
  getFriends,
} from "../utils/api";
import { useUser } from "../contexts/UserContext";

const UserProfilePage = () => {
  const { user } = useUser();
  const [recipes, setRecipes] = useState([]);
  const [bookmarkedRecipes, setBookmarkedRecipes] = useState(new Set());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [friends, setFriends] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      setLoading(false); // stop loading spinner if no user
      return;
    }

    const fetchData = async () => {
      try {
        const userRecipes = await getUserRecipes(user.username);
        setRecipes(userRecipes);

        const bookmarkedData = await getBookmarkedRecipes(user.username);
        setBookmarkedRecipes(new Set(bookmarkedData.map((r) => r.id)));

        const userFriends = await getFriends(user.username);
        setFriends(userFriends);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user, navigate]);

  const handleToggleBookmark = async (recipeId) => {
    if (!user) {
      console.error("User not logged in");
      return;
    }

    try {
      const result = await toggleBookmark(recipeId, user.username);

      if (!result.error) {
        setBookmarkedRecipes((prevBookmarks) => {
          const updatedBookmarks = new Set(prevBookmarks);
          if (result.isBookmarked) {
            updatedBookmarks.add(recipeId);
          } else {
            updatedBookmarks.delete(recipeId);
          }
          return updatedBookmarks;
        });
      } else {
        console.error("Toggle bookmark error: ", result.error);
      }
    } catch (error) {
      console.error("Error toggling bookmark: ", error);
    }
  };

  const handleRecipeClick = (recipeID) => {
    navigate(`/app/user-profile/${recipeID}`);
  };

  if (!user) {
    return (
      <div className="relative montserrat-font flex flex-col items-center justify-start min-h-screen w-screen text-green-800 pl-24 pt-24">
            <h1 className="text-3xl font-bold mt-6 top-6 text-green-600 z-20 text-center mb-12">
                Your Friends
            </h1>
        <p className="text-gray-500">No profile available.</p>
      </div>
    );
  }

  return (
    <div className="relative montserrat-font flex flex-col items-center justify-start min-h-screen w-screen text-green-800 pl-24 pt-24">
      <div className="flex items-center gap-4 mt-6 mb-12">
        {user?.image_url ? (
          <img
            src={user.image_url}
            alt="Profile"
            className="w-35 h-35 rounded-full object-cover"
          />
        ) : (
          <div className="w-35 h-35 rounded-full bg-black" />
        )}

        <h1 className="text-3xl font-bold text-green-600">User Profile</h1>
      </div>

      <div className="flex flex-row gap-8 w-full max-w-7xl mt-16">
        <div className="w-1/3 p-6 bg-white rounded-lg shadow-md flex flex-col items-center">
          <Typography
            variant="h5"
            gutterBottom
            align="center"
            className="text-green-800"
          >
            Your Friends
          </Typography>

          <Box sx={{ mt: 3, width: "100%" }}>
            {loading ? (
              <CircularProgress color="success" />
            ) : error ? (
              <p className="text-red-500">{error}</p>
            ) : (
              <FriendsList users={friends} />
            )}
          </Box>
        </div>

        <div className="w-2/3 flex flex-col items-center">
          <div className="w-full flex justify-center mb-4">
            <Typography variant="h5" className="text-green-800 text-center">
              Your Recipes
            </Typography>
          </div>

          {loading ? (
            <div className="flex justify-center">
              <CircularProgress color="success" />
            </div>
          ) : error ? (
            <p className="text-red-500">{error}</p>
          ) : recipes.length === 0 ? (
            <p className="text-gray-500">You haven't created any recipes yet.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
              {recipes.map((recipe) => (
                <div
                  key={recipe.id}
                  className="transform transition-transform duration-300 hover:scale-102"
                >
                  <RecipeCard
                    key={recipe.id}
                    image={recipe.image}
                    video={recipe.video}
                    name={recipe.name}
                    username={recipe.username}
                    tags={recipe.tags}
                    isBookmarked={bookmarkedRecipes.has(recipe.id)}
                    onToggleBookmark={() => handleToggleBookmark(recipe.id)}
                    onFullDetailsClick={() => handleRecipeClick(recipe.id)}
                    small
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserProfilePage;
