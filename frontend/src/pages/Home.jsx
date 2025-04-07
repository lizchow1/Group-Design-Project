import React, { useState, useEffect, useRef } from "react";
import FlipRecipeCard from "../components/FlipRecipeCard";
import { getCombinedRecipes, getBookmarkedRecipes, toggleBookmark, followUser, unfollowUser, checkFollowStatus } from "../utils/api";
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
  const [isInitializing, setIsInitializing] = useState(true);
  const initialStateRef = useRef(null);
  const [followStatusMap, setFollowStatusMap] = useState(new Map());

  const toggleSort = () => setSortOpen((prev) => !prev);
  const toggleFilter = () => setFilterOpen((prev) => !prev);

  useEffect(() => {
    async function initialize() {
      const stored = localStorage.getItem("lastViewState");
      if (stored) {
        try {
          const parsed = JSON.parse(stored);
          initialStateRef.current = {
            recipeId: parsed.recipeId || null,
            query: parsed.query || "",
            tags: parsed.tags || [],
            sort: parsed.sort || "",
          };
          setSearchQuery(parsed.query || "");
          setChecked(parsed.tags || []);
          setCurrentSort(parsed.sort || "");
        } catch (err) {
          console.warn("Failed to parse stored view state", err);
        }
      }
      setLoading(true);
      await updateVisibleRecipes({
        query: initialStateRef.current?.query || "",
        tags: initialStateRef.current?.tags || [],
        sort: initialStateRef.current?.sort || "",
      });   

      setIsInitializing(false);
    }

    initialize();
  }, []);

  useEffect(() => {
    return () => {
      const stored = localStorage.getItem("lastViewState");
      if (stored) {
        try {
          const parsed = JSON.parse(stored);
          localStorage.setItem("lastViewState",
            JSON.stringify({
              recipeId: parsed.recipeId || null,
              query: "",
              tags: [],
              sort: "",
            })
          );
        } catch (err) {
          console.warn("Failed to reset view state on unmount", err);
        }
      }
    };
  }, []);

  useEffect(() => {
    const fetchFollows = async () => {
      if (user) {
        try {
          const followingData = await getFollowing(user.username);
          if (followingData && followingData.following) {
            setFollowedUsers(new Set(followingData.following.map((u) => u.username)));
          }
        } catch (err) {
          console.error("Failed to fetch followed users:", err);
        }
      } else {
        setFollowedUsers(new Set()); 
      }
    };
    fetchFollows();
  }, [user]);  
  

  useEffect(() => {
    if (!isInitializing) {
      setLoading(true);
      updateVisibleRecipes({ query: searchQuery, tags: checked, sort: currentSort });
    }
  }, [searchQuery, checked, currentSort]);

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
    setChecked((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  const handleFollow = async (targetUsername) => {
    if (!user) return console.error("User not logged in");
  
    try {
      const isCurrentlyFollowing = followStatusMap.get(targetUsername);
  
      if (isCurrentlyFollowing) {
        const result = await unfollowUser(targetUsername, user.username);
        if (!result.error) {
          setFollowStatusMap((prev) => new Map(prev).set(targetUsername, false));
        }
      } else {
        const result = await followUser(targetUsername, user.username);
        if (!result.error) {
          setFollowStatusMap((prev) => new Map(prev).set(targetUsername, true));
        }
      }
    } catch (err) {
      console.error("Follow/unfollow error:", err);
    }
  };  

  const updateVisibleRecipes = async ({ query, tags, sort }) => {
    try {
      setTimeout(async () => {
        const [field, order] = sort ? sort.split("-") : ["", "asc"];
        const data = await getCombinedRecipes({ query, tags, sort: field, order });
        setAllRecipes(data);
        if (user) {
          const newStatusMap = new Map();
          await Promise.all(
            data.map(async (recipe) => {
              if (recipe.username === user.username) {
                newStatusMap.set(recipe.username, false);
                return;
              }
              try {
                const result = await checkFollowStatus(recipe.username, user.username);
                newStatusMap.set(recipe.username, result?.is_following ?? false);
              } catch (err) {
                console.warn(`Failed follow status check for ${recipe.username}`);
                newStatusMap.set(recipe.username, false);
              }
            })
          );
          setFollowStatusMap(newStatusMap);
        }

        const storedState = initialStateRef.current;
        if (storedState?.recipeId) {
          const matchingIndex = data.findIndex((r) => r.id === storedState.recipeId);
          setCurrentIndex(matchingIndex !== -1 ? matchingIndex : 0);
        } else {
          setCurrentIndex(0);
        }
      }, 1500); 
    } catch (err) {
      setError("Failed to load recipes");
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
        setBookmarkedRecipes((prev) => {
          const updated = new Set(prev);
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
    setLoading(true);
    updateVisibleRecipes({ query: searchQuery, tags: checked, sort: value });
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
          <CircularProgress color="success"/>
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
              isFollowing={followStatusMap.get(recipe.username)}
              isOwnRecipe={user?.username === recipe.username}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default Home;