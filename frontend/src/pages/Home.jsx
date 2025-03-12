import React, { useState, useEffect, useRef } from "react";
import RecipeCard from "../components/RecipeCard";
import { getRecipes, getBookmarkedRecipes, toggleBookmark } from "../utils/api";
import CircularProgress from '@mui/material/CircularProgress';

const Home = ({ user }) => {
  const [recipes, setRecipes] = useState([]);
  const [bookmarkedRecipes, setBookmarkedRecipes] = useState(new Set());
  const [visibleRecipes, setVisibleRecipes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const recipesPerPage = 2;
  const loader = useRef(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const data = await getRecipes();
        setRecipes(data);

        let bookmarkedSet = new Set();
        if (user) {
          const bookmarkedData = await getBookmarkedRecipes(user.username);
          bookmarkedSet = new Set(bookmarkedData.map((r) => r.id));
        }

        setBookmarkedRecipes(bookmarkedSet);
        setVisibleRecipes(data.slice(0, recipesPerPage));
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (entry.isIntersecting && !loading && visibleRecipes.length < recipes.length) {
          setLoading(true);
          setTimeout(() => {
            setPage((prevPage) => prevPage + 1);
            setLoading(false);
          }, 1000);
        }
      },
      { rootMargin: "100px" }
    );

    if (loader.current) observer.observe(loader.current);

    return () => {
      if (loader.current) observer.unobserve(loader.current);
    };
  }, [loading, visibleRecipes, recipes]);

  useEffect(() => {
    if (recipes.length > 0) {
      setVisibleRecipes(recipes.slice(0, page * recipesPerPage));
    }
  }, [page, recipes]);

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

  return (
    <div className="relative montserrat-font flex flex-col items-center justify-start min-h-screen w-screen pl-24 pt-24"> 
      <h1 className="text-3xl font-bold mt-6 top-6 text-green-600 z-20 text-center mb-12">
        Let Me Cook
      </h1>

      {loading && recipes.length === 0 && !error && (
        <div className="flex items-center justify-center w-full py-6 mt-8">
          <CircularProgress />
        </div>
      )}

      {!loading && recipes.length === 0 && !error && (
        <div className="text-gray-600 text-lg text-center mt-8">
          No recipes available.
        </div>
      )}

      <div className="space-y-6 pt-16">
        {visibleRecipes.map((recipe) => (
          <RecipeCard
            key={recipe.id}
            image={recipe.image}
            video={recipe.video}
            name={recipe.name}
            username={recipe.username}
            tags={recipe.tags}
            isBookmarked={bookmarkedRecipes.has(recipe.id)}
            onToggleBookmark={() => handleToggleBookmark(recipe.id)}
          />
        ))}
      </div>

      <div ref={loader} className="text-center mb-8">
        {loading && visibleRecipes.length < recipes.length && <CircularProgress />}
      </div>
    </div>
  );
};

export default Home;
