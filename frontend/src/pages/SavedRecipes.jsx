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
    <div className='flex flex-wrap gap-8 ml-20 mt-16 mb-16'

    >
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
