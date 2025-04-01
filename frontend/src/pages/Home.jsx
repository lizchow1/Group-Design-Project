import React, { useState, useEffect, useRef } from "react";
import FlipRecipeCard from "../components/FlipRecipeCard";
import { getRecipes, getBookmarkedRecipes, toggleBookmark } from "../utils/api";
import CircularProgress from "@mui/material/CircularProgress";
import FilterButton from "../components/FilterButton";



const RECIPES_PER_LOAD = 5; 

const Home = ({ user }) => {
  const [allRecipes, setAllRecipes] = useState([]);
  const [visibleRecipes, setVisibleRecipes] = useState([]);
  const [bookmarkedRecipes, setBookmarkedRecipes] = useState(new Set());
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [loadedCount, setLoadedCount] = useState(RECIPES_PER_LOAD); 
  const scrollContainerRef = useRef(null);
  const loaderRef = useRef(null);
  const [checked, setChecked] = React.useState([]);
  const [filterOpen, setFilterOpen] = useState(false);


  
  const filteredRecipes = visibleRecipes.filter((recipe) =>
    checked.length === 0 || checked.every((tag) => recipe.tags.includes(tag))
  );

  const toggleFilter = () => {
    setFilterOpen((prev) => !prev);
};

  const handleToggle = (tag) => () => {
    setChecked((prevChecked) =>
        prevChecked.includes(tag)
            ? prevChecked.filter((t) => t !== tag) 
            : [...prevChecked, tag]
    );
  };
  

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const data = await getRecipes();
        setAllRecipes(data);
        setVisibleRecipes(data.slice(0, RECIPES_PER_LOAD)); 

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
  }, [visibleRecipes]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !loading) {
          loadMoreRecipes();
        }
      },
      { rootMargin: "200px" }
    );

    if (loaderRef.current) observer.observe(loaderRef.current);

    return () => {
      if (loaderRef.current) observer.unobserve(loaderRef.current);
    };
  }, [loading]);

  const loadMoreRecipes = () => {
    if (visibleRecipes.length >= allRecipes.length) return;
    setLoading(true);
    
    setTimeout(() => {
      const newCount = loadedCount + RECIPES_PER_LOAD;
      setVisibleRecipes(allRecipes.slice(0, newCount));
      setLoadedCount(newCount);
      setLoading(false);
    }, 10); 
  };

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
      <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-50 text-center">
      <h1 className="text-3xl font-bold mt-6 text-green-600 z-20 text-center mb-4">
        Let Me Cook

        <FilterButton 
          toggleFilter={toggleFilter}
          handleToggle={handleToggle}
          filterOpen={filterOpen}
          checked={checked}
        />

      </h1>
      </div>

      {loading && visibleRecipes.length === 0 && !error && (
        <div className="flex items-center justify-center w-full h-screen">
          <CircularProgress />
        </div>
      )}

      {!loading && visibleRecipes.length === 0 && !error && (
        <div className="text-gray-600 text-lg text-center mt-38">
          No recipes available.
        </div>
      )}

        <div
          ref={scrollContainerRef}
          className="w-screen h-screen overflow-y-auto snap-y snap-mandatory"
          style={{ scrollSnapType: "y mandatory", scrollbarWidth: "none" }}
        >
        {filteredRecipes.map((recipe, index) => (
          <div
            key={recipe.id}
            data-index={index}
            className="recipe-card w-full h-screen flex items-center justify-center snap-center"
          >
          <FlipRecipeCard
            id={recipe.id}
            image={recipe.image}
            video={recipe.video}
            name={recipe.name}
            username={recipe.username}
            tags={recipe.tags}
            cooking_time={recipe.cooking_time}
            ingredients={recipe.ingredients}
            description={recipe.description}
            isBookmarked={bookmarkedRecipes.has(recipe.id)}
            onToggleBookmark={() => handleToggleBookmark(recipe.id)}
            onFullDetailsClick={() => console.log(`Clicked for full details on ${recipe.name}`)} 
          />
          </div>
        ))}

        {visibleRecipes.length < allRecipes.length && (
          <div ref={loaderRef} className="flex items-center justify-center h-24">
            <CircularProgress />
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;
