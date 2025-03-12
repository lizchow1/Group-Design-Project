import React, { useState, useEffect, useRef, useCallback } from "react";
import RecipeCard from "../components/RecipeCard";
import { getRecipes, getBookmarkedRecipes, toggleBookmark } from "../utils/api";
import CircularProgress from "@mui/material/CircularProgress";

const Home = ({ user }) => {
  const [recipes, setRecipes] = useState([]);
  const [bookmarkedRecipes, setBookmarkedRecipes] = useState(new Set());
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const scrollContainerRef = useRef(null);

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
        const entry = entries.find((e) => e.isIntersecting);
        if (entry) {
          setCurrentIndex(Number(entry.target.dataset.index));
        }
      },
      { threshold: 0.7 } 
    );

    const elements = document.querySelectorAll(".recipe-card");
    elements.forEach((el) => observer.observe(el));

    return () => elements.forEach((el) => observer.unobserve(el));
  }, [recipes]);

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
    <div className="relative montserrat-font flex flex-col items-center justify-start w-screen h-screen overflow-hidden">
      <h1 className="text-3xl font-bold mt-6 text-green-600 z-20 text-center mb-4">
        Let Me Cook
      </h1>

      {loading && recipes.length === 0 && !error && (
        <div className="flex items-center justify-center w-full h-full">
          <CircularProgress />
        </div>
      )}

      {!loading && recipes.length === 0 && !error && (
        <div className="text-gray-600 text-lg text-center mt-8">
          No recipes available.
        </div>
      )}

      <div
        ref={scrollContainerRef}
        className="w-screen h-full overflow-y-auto snap-y snap-mandatory"
        style={{ scrollSnapType: "y mandatory", scrollbarWidth: "none" }}
      >
        {recipes.map((recipe, index) => (
          <div
            key={recipe.id}
            data-index={index}
            className="recipe-card w-full h-screen flex items-center justify-center snap-center"
          >
            <RecipeCard
              image={recipe.image}
              video={recipe.video}
              name={recipe.name}
              username={recipe.username}
              tags={recipe.tags}
              isBookmarked={bookmarkedRecipes.has(recipe.id)}
              onToggleBookmark={() => handleToggleBookmark(recipe.id)}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default Home;
