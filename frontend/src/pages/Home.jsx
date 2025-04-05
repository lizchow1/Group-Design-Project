import React, { useState, useEffect, useRef } from "react";
import FlipRecipeCard from "../components/FlipRecipeCard";
import { getRecipes, getBookmarkedRecipes, toggleBookmark, getFilteredRecipes, getRecipesBySearch, getSortedRecipes, getCombinedRecipes } from "../utils/api";
import CircularProgress from "@mui/material/CircularProgress";
import FilterButton from "../components/FilterButton";
import SearchBar from "../components/SearchBar";
import SortButton from "../components/SortButton";
import { useUser } from "../contexts/UserContext";

const RECIPES_PER_LOAD = 5;

const Home = () => {
  const [allRecipes, setAllRecipes] = useState([]);
  const [visibleRecipes, setVisibleRecipes] = useState([]);
  const [bookmarkedRecipes, setBookmarkedRecipes] = useState(new Set());
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [loadedCount, setLoadedCount] = useState(RECIPES_PER_LOAD);
  const scrollContainerRef = useRef(null);
  const loaderRef = useRef(null);
  const [checked, setChecked] = useState([]);
  const [filterOpen, setFilterOpen] = useState(false);
  const [followedUsers, setFollowedUsers] = useState(new Set());
  const { user } = useUser();

  const [searchQuery, setSearchQuery] = useState("");
  const [sortOpen, setSortOpen] = useState(false);
  const [currentSort, setCurrentSort] = useState("");

  const toggleSort = () => setSortOpen((prev) => !prev);
  const toggleFilter = () => setFilterOpen((prev) => !prev);

  const handleToggle = (tag) => () => {
    setChecked((prevChecked) =>
      prevChecked.includes(tag)
        ? prevChecked.filter((t) => t !== tag)
        : [...prevChecked, tag]
    );
  };

  const handleFollow = (username) => {
    setFollowedUsers((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(username)) {
        newSet.delete(username);
      } else {
        newSet.add(username);
      }
      return newSet;
    });
  };

  const updateVisibleRecipes = async () => {
    setLoading(true);
    try {
      const [field, order] = currentSort ? currentSort.split("-") : ["", "asc"];
      const data = await getCombinedRecipes({
        query: searchQuery,
        tags: checked,
        sort: field,
        order: order,
      });
      setAllRecipes(data);
      setVisibleRecipes(data.slice(0, RECIPES_PER_LOAD));
      setLoadedCount(RECIPES_PER_LOAD);
    } catch (err) {
      setError("Failed to load recipes");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const fetchBookmarks = async () => {
      try {
        let bookmarkedSet = new Set();
        if (user) {
          const bookmarkedData = await getBookmarkedRecipes(user.username);
          bookmarkedSet = new Set(bookmarkedData.map((r) => r.id));
        }
        setBookmarkedRecipes(bookmarkedSet);
      } catch (err) {
        console.error("Failed to fetch bookmarks", err);
      }
    };

    fetchBookmarks();
  }, [user]);

  useEffect(() => {
    updateVisibleRecipes();
  }, [searchQuery, checked, currentSort]);

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

  const handleSearch = (query) => {
    setSearchQuery(query);
  };

  const handleSortSelect = (value) => {
    setCurrentSort(value);
    setSortOpen(false);
  };

  return (
    <div className="relative montserrat-font flex flex-col items-center justify-start w-screen h-screen overflow-hidden">
      <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-50 text-center">
        <h1 className="text-3xl font-bold mt-6 top-6 text-green-600 z-20 text-center mb-12">
          Let Me Cook
        </h1>
        <div className="flex justify-center items-center gap-4 z-20">
          <SearchBar onSearch={handleSearch} />
          <SortButton
            toggleSort={toggleSort}
            sortOpen={sortOpen}
            handleSortSelect={handleSortSelect}
            currentSort={currentSort}
          />
          <FilterButton
            toggleFilter={toggleFilter}
            handleToggle={handleToggle}
            filterOpen={filterOpen}
            checked={checked}
          />
        </div>
      </div>

      {loading && visibleRecipes.length === 0 && !error && (
        <div className="flex items-center justify-center w-full h-screen">
          <CircularProgress />
        </div>
      )}

      {!loading && visibleRecipes.length === 0 && !error && (
        <div className="text-gray-600 text-lg text-center mt-50">
          {checked.length > 0 || searchQuery.trim() !== ""
            ? "No matching recipes found."
            : "No recipes available."}
        </div>
      )}

      <div
        ref={scrollContainerRef}
        className="w-screen h-screen overflow-y-auto snap-y snap-mandatory"
        style={{ scrollSnapType: "y mandatory", scrollbarWidth: "none" }}
      >
        {visibleRecipes.map((recipe, index) => (
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
              onFollow={handleFollow}
              isFollowing={followedUsers.has(recipe.username)}
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