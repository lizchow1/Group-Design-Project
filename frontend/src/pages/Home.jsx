import React, { useState, useEffect, useRef } from "react";
import RecipeCard from "../components/RecipeCard";
import { getRecipes } from "../utils/api";

const Home = () => {
  const [recipes, setRecipes] = useState([]);
  const [visibleRecipes, setVisibleRecipes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const recipesPerPage = 2;
  const loader = useRef(null);

  const fetchRecipes = async () => {
    setLoading(true);
    try {
      const data = await getRecipes();
      setRecipes(data);
      setVisibleRecipes(data.slice(0, recipesPerPage));
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecipes();
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (entry.isIntersecting && !loading) {
          setPage((prevPage) => prevPage + 1);
        }
      },
      { rootMargin: "100px" }
    );

    if (loader.current) observer.observe(loader.current);

    return () => {
      if (loader.current) observer.unobserve(loader.current);
    };
  }, [loading]);

  useEffect(() => {
    if (recipes.length > 0) {
      const nextRecipes = recipes.slice(0, page * recipesPerPage);
      setVisibleRecipes(nextRecipes);
    }
  }, [page, recipes]);

  return (
    <div className="relative montserrat-font flex flex-col items-center justify-start min-h-screen w-screen text-white pl-24 pt-24"> 
      <h1 className="text-3xl font-bold mt-6 absolute top-6 text-white z-20">
        Let Me Cook
      </h1>

      {loading && !error && (
        <div className="absolute inset-0 bg-gray-500 bg-opacity-50 flex items-center justify-center z-10">
          <div className="text-white text-xl">Loading...</div>
        </div>
      )}

      <div className="space-y-6 pt-16">
        {visibleRecipes.map((recipe) => (
          <RecipeCard
            key={recipe.id}
            image={recipe.image}
            name={recipe.name}
            username={recipe.username}
            tags={recipe.tags}
            isBookmarked={recipe.isBookmarked}
          />
        ))}
      </div>

      <div ref={loader} className="text-center">
        {loading && !error && <p>Loading more recipes...</p>}
      </div>
    </div>
  );
};

export default Home;
