import React, { useEffect, useState } from "react";
import RecipeCard from "../components/RecipeCard";
import { getRecipes } from "../utils/api";

const SavedRecipes = () => {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRecipes = async () => {
      try {
        const data = await getRecipes();
        setRecipes(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchRecipes();
  }, []);

  return (
    <div className="relative montserrat-font flex flex-col items-center justify-start min-h-screen w-screen text-white pl-24 pt-24"> 
      <h1 class="text-3xl font-bold mt-6 top-6 text-black z-20 text-center mb-12">
        Your Saved Recipes
      </h1>
        {recipes.map((recipe) => (
 
            <RecipeCard
              key={recipe.id}
              image={recipe.image}
              name={recipe.name}
              username={recipe.username}
              tags={recipe.tags}
              isBookmarked={true} // Default as green toggle
              onBookmarkToggle={() =>
                console.log(`Bookmark toggled for ${recipe.name}`)
              }
            />
        ))}
    </div>
  );
};

export default SavedRecipes;
