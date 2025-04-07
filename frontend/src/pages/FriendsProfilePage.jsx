import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  getUserByUsername,
  getUserRecipes,
  getBookmarkedRecipes,
  toggleBookmark,
} from "../utils/api";
import { useUser } from "../contexts/UserContext";
import RecipeCard from "../components/RecipeCard";

const FriendProfilePage = () => {
  const { friendId } = useParams();
  const { user } = useUser();
  const navigate = useNavigate();

  const [friend, setFriend] = useState(null);
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [bookmarkedRecipes, setBookmarkedRecipes] = useState(new Set());

  useEffect(() => {
    const fetchFriendData = async () => {
      try {
        const friendData = await getUserByUsername(friendId);
        if (friendData?.username) {
          setFriend(friendData);
          const userRecipes = await getUserRecipes(friendData.username);
          setRecipes(userRecipes);
        }
      } catch (err) {
        console.error("Failed to load friend profile:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchFriendData();
  }, [friendId]);

  useEffect(() => {
    const fetchBookmarks = async () => {
      if (!user) return;
      try {
        const bookmarked = await getBookmarkedRecipes(user.username);
        setBookmarkedRecipes(new Set(bookmarked.map((r) => r.id)));
      } catch (err) {
        console.error("Failed to fetch bookmarks:", err);
      }
    };

    fetchBookmarks();
  }, [user]);

  const handleToggleBookmark = async (recipeId) => {
    if (!user) return console.error("User not logged in");

    try {
      const result = await toggleBookmark(recipeId, user.username);
      if (!result.error) {
        setBookmarkedRecipes((prev) => {
          const updated = new Set(prev);
          result.isBookmarked ? updated.add(recipeId) : updated.delete(recipeId);
          return updated;
        });
      }
    } catch (error) {
      console.error("Error toggling bookmark:", error);
    }
  };

  const goToRecipeDetails = (recipeId) => {
    navigate(`/app/${recipeId}`);
  };  

  if (loading) {
    return (
      <div className="relative montserrat-font flex flex-col items-center justify-start min-h-screen w-screen text-green-800 pl-24 pt-24">
        <p className="text-gray-500">Loading Profile...</p>
      </div>
    );
  }

  if (!friend) {
    return (
      <div className="pl-24 pt-24 text-red-600">
        Unable to load friend profile.
      </div>
    );
  }

  return (
    <div className="relative montserrat-font flex flex-col items-center justify-start min-h-screen w-screen text-green-800 pl-24 pt-24">
      <div className="flex items-center gap-4 mt-6 mb-12">
        {friend.image_url ? (
          <img
            src={friend.image_url}
            alt="Profile"
            className="w-35 h-35 rounded-full object-cover"
          />
        ) : (
          <div className="w-35 h-35 rounded-full bg-black" />
        )}
        <h1 className="text-3xl font-bold text-green-600">{friend.username} Profile</h1>
      </div>

      <div className="flex flex-col items-center w-full max-w-7xl mt-16">
        <h2 className="text-xl font-semibold text-green-800 mb-6">Recipes</h2>
        {recipes.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
            {recipes.map((recipe) => (
              <RecipeCard
                key={recipe.id}
                image={recipe.image}
                name={recipe.name}
                username={friend.username}
                tags={recipe.tags || []}
                small={true}
                isBookmarked={bookmarkedRecipes.has(recipe.id)}
                onToggleBookmark={() => handleToggleBookmark(recipe.id)}
                onFullDetailsClick={() => goToRecipeDetails(recipe.id)}
              />
            ))}
          </div>
        ) : (
          <p className="text-gray-500">No recipes yet.</p>
        )}
      </div>
    </div>
  );
};

export default FriendProfilePage;
