import React, { useState, useEffect, useRef } from "react";
import FlipRecipeCard from "../components/FlipRecipeCard";
import { getCombinedRecipes, getBookmarkedRecipes, toggleBookmark } from "../utils/api";
import CircularProgress from "@mui/material/CircularProgress";
import FilterButton from "../components/FilterButton";
import SearchBar from "../components/SearchBar";
import SortButton from "../components/SortButton";
import { useUser } from "../contexts/UserContext";

const Home = () => {
  const [allRecipes, setAllRecipes] = useState([]);
  const [bookmarkedRecipes, setBookmarkedRecipes] = useState(new Set());
  const [currentIndex, setCurrentIndex] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const scrollContainerRef = useRef(null);
  const [checked, setChecked] = useState([]);
  const [filterOpen, setFilterOpen] = useState(false);
  const [followedUsers, setFollowedUsers] = useState(new Set());
  const { user } = useUser();
  const [hasScrolledToSaved, setHasScrolledToSaved] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortOpen, setSortOpen] = useState(false);
  const [currentSort, setCurrentSort] = useState("");
  const [isLoadingIndex, setIsLoadingIndex] = useState(true);
  const [initialized, setInitialized] = useState(false); 

  const toggleSort = () => setSortOpen((prev) => !prev);
  const toggleFilter = () => setFilterOpen((prev) => !prev);
  const initialStateRef = useRef(null);

  useEffect(() => {
    const stored = localStorage.getItem("lastViewState");
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        initialStateRef.current = {
          recipeId: parsed.recipeId || null,
          query: "",
          tags: [],
          sort: "",
        };
        setSearchQuery("");
        setChecked([]);
        setCurrentSort("");
      } catch (err) {
        console.warn("Failed to parse stored view state", err);
      }
    }
    setIsLoadingIndex(false);
    setInitialized(true);
  }, []);

  useEffect(() => {
    if (currentIndex !== null && currentIndex < allRecipes.length) {
      const currentRecipe = allRecipes[currentIndex];
      const state = {
        recipeId: currentRecipe?.id || null,
        query: searchQuery,
        tags: checked,
        sort: currentSort,
      };
      localStorage.setItem("lastViewState", JSON.stringify(state));
    }
  }, [currentIndex, searchQuery, checked, currentSort]);

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

  const updateVisibleRecipes = async ({ query, tags, sort }) => {
    setLoading(true);
    try {
      const [field, order] = sort ? sort.split("-") : ["", "asc"];
      const data = await getCombinedRecipes({ query, tags, sort: field, order });

      setAllRecipes(data);

      const storedState = initialStateRef.current;
      if (storedState?.recipeId) {
        const matchingIndex = data.findIndex((r) => r.id === storedState.recipeId);
        setCurrentIndex(matchingIndex !== -1 ? matchingIndex : 0);
      } else {
        setCurrentIndex(0);
      }
    } catch (err) {
      setError("Failed to load recipes");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const fetchBookmarks = async () => {
      try {
        if (user) {
          const bookmarkedData = await getBookmarkedRecipes(user.username);
          setBookmarkedRecipes(new Set(bookmarkedData.map((r) => r.id)));
        }
      } catch (err) {
        console.error("Failed to fetch bookmarks", err);
      }
    };

    fetchBookmarks();
  }, [user]);

  useEffect(() => {
    if (
      currentIndex !== null &&
      currentIndex < allRecipes.length &&
      !hasScrolledToSaved
    ) {
      const cards = document.querySelectorAll(".recipe-card");
      if (cards[currentIndex]) {
        cards[currentIndex].scrollIntoView({ behavior: "auto" });
        setHasScrolledToSaved(true);
      }
    }
  }, [allRecipes, currentIndex, hasScrolledToSaved]);

  useEffect(() => {
    if (!initialized) return;
    const storedState = initialStateRef.current;
    if (
      storedState &&
      searchQuery === storedState.query &&
      JSON.stringify(checked) === JSON.stringify(storedState.tags) &&
      currentSort === storedState.sort
    ) {
      updateVisibleRecipes({ query: "", tags: [], sort: "" });
    } else {
      setCurrentIndex(0);
      updateVisibleRecipes({ query: searchQuery, tags: checked, sort: currentSort });
    }
  }, [searchQuery, checked, currentSort, initialized]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        let maxRatio = 0;
        let maxIndex = null;
        entries.forEach((entry) => {
          if (entry.isIntersecting && entry.intersectionRatio > maxRatio) {
            maxRatio = entry.intersectionRatio;
            maxIndex = Number(entry.target.dataset.index);
          }
        });
        if (maxIndex !== null && maxRatio > 0.5) {
          setCurrentIndex(maxIndex);
        }
      },
      { threshold: [0, 0.25, 0.5, 0.75, 1.0] }
    );
    const elements = document.querySelectorAll(".recipe-card");
    elements.forEach((el) => observer.observe(el));
    return () => elements.forEach((el) => observer.unobserve(el));
  }, [allRecipes]);

  const handleToggleBookmark = async (recipeId) => {
    if (!user) return console.error("User not logged in");
    try {
      const result = await toggleBookmark(recipeId, user.username);
      if (!result.error) {
        setBookmarkedRecipes((prevBookmarks) => {
          const updated = new Set(prevBookmarks);
          result.isBookmarked ? updated.add(recipeId) : updated.delete(recipeId);
          return updated;
        });
      }
    } catch (error) {
      console.error("Error toggling bookmark: ", error);
    }
  };

  const handleSearch = (query) => setSearchQuery(query);
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

      {loading && allRecipes.length === 0 && !error && (
        <div className="flex items-center justify-center w-full h-screen">
          <CircularProgress />
        </div>
      )}

      {!loading && allRecipes.length === 0 && !error && (
        <div className="text-gray-600 text-lg text-center mt-50">
          {checked.length > 0 || searchQuery.trim() !== ""
            ? "No matching recipes found."
            : "No recipes available."}
        </div>
      )}

      <div
        ref={scrollContainerRef}
        className="w-screen h-screen overflow-y-auto snap-y snap-mandatory pt-32"
        style={{ scrollSnapType: "y mandatory", scrollbarWidth: "none" }}
      >
        {allRecipes.map((recipe, index) => (
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
      </div>
    </div>
  );
};

export default Home;