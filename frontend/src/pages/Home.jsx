import React, { useEffect, useState } from "react";
import RecipeCard from "../components/RecipeCard";

const Home = () => {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRecipes = async () => {
      try {
        const response = await fetch("/recipes.json");
        if (!response.ok) throw new Error("Failed to load recipes");
        const data = await response.json();
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
    <div className="flex flex-col items-center justify-center h-screen w-screen ">
      <h1 className="text-3xl font-bold mt-6 absolute top-6 text-grey-600">
        Let Me Cook
      </h1>

      {!loading && !error && recipes.length > 0 ? (
        <RecipeCard
          image={recipes[0].image}
          name={recipes[0].name}
          username={recipes[0].username}
          tags={recipes[0].tags}
          isBookmarked={recipes[0].isBookmarked}
          onBookmarkToggle={() => console.log(`Bookmark toggled for ${recipes[0].name}`)}
        />
      ) : (
        <p className="text-gray-600 text-lg">
          {loading ? "Loading recipes..." : error}
        </p>
      )}
    </div>
  );
};

export default Home;
