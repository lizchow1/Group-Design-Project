import React, { useEffect, useState } from "react";
import RecipeCard from "../components/RecipeCard";
import { getBookmarkedRecipes, toggleBookmark } from "../utils/api";

const SavedRecipes = ({ user }) => {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }

    const fetchBookmarkedRecipes = async () => {
      try {
        const data = await getBookmarkedRecipes(user.username);
        setRecipes(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchBookmarkedRecipes();
  }, [user]);

  const handleUnbookmark = async (recipeId) => {
    if (!user) {
      console.error("User not logged in");
      return;
    }

    try {
      const result = await toggleBookmark(recipeId, user.username);

      if (!result.error) {
        // Remove the recipe from state since it is unbookmarked
        setRecipes((prevRecipes) =>
          prevRecipes.filter((recipe) => recipe.id !== recipeId)
        );
      } else {
        console.error("Toggle bookmark error: ", result.error);
      }
    } catch (error) {
      console.error("Error toggling bookmark: ", error);
    }
  };

  return (
    <div className="relative montserrat-font items-center justify-start min-h-screen w-screen">
      <h1 className="text-3xl font-bold text-green-600 z-20 text-center mb-12 px-24 pt-24">
        Your Saved Recipes
      </h1>

      {loading && (
        <div className="text-center text-green-600 text-xl mt-10">Loading...</div>
      )}
      {error && <div className="text-center text-red-500">{error}</div>}

      <div className="flex flex-wrap gap-8 ml-20 mt-16 mb-16">
        {recipes.length === 0 && !loading && !error && (
          <p className="text-lg text-gray-600 text-center w-full">
            You haven't saved any recipes yet.
          </p>
        )}

        {recipes.map((recipe) => (
          <RecipeCard
            key={recipe.id}
            image={recipe.image}
            video={recipe.video}
            name={recipe.name}
            username={recipe.username}
            tags={recipe.tags}
            isBookmarked={true} 
            onToggleBookmark={() => handleUnbookmark(recipe.id)} // Call API to unbookmark
          />
        ))}
      </div>
    </div>
  );
};

export default SavedRecipes;
