import React, { useState, useEffect, useRef } from "react";
import FlipRecipeCard from "../components/FlipRecipeCard";
import { getRecipes, getBookmarkedRecipes, toggleBookmark } from "../utils/api";
import CircularProgress from "@mui/material/CircularProgress";
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Checkbox from '@mui/material/Checkbox';
import IconButton from '@mui/material/IconButton';
import CommentIcon from '@mui/icons-material/Comment';


const RECIPES_PER_LOAD = 5; 
const tags = ["easy", "vegan", "gluten", "Nice", "healthy", "Quick"]

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


  const handleToggle = (tag) => () => {
    setChecked((prevChecked) =>
      prevChecked.includes(tag)
        ? prevChecked.filter((t) => t !== tag) // Remove if already selected
        : [...prevChecked, tag] // Add if not selected
    );
  };
  
  // Filter recipes based on selected tags
  const filteredRecipes = checked.length === 0 
    ? visibleRecipes 
    : visibleRecipes.filter((recipe) =>
        recipe.tags.some((tag) => checked.includes(tag))
      );

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
    }, 1000); 
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
      <h1 className="text-3xl font-bold mt-6 text-green-600 z-20 text-center mb-4">
        Let Me Cook
        <List 
        sx={{ width: '100%', 
        bgcolor: 'background.paper',
        width: '100%', 
        maxWidth: 360, 
        maxHeight: 120, // Adjust height to fit 3 items
        overflowY: 'scroll', // Ensures scrollbar is always present
        '&::-webkit-scrollbar': {
          width: '8px', // Adjust width of scrollbar
        },
        '&::-webkit-scrollbar-thumb': {
          background: '#888', // Color of the draggable part
          borderRadius: '4px',
        },
        '&::-webkit-scrollbar-track': {
          background: '#f1f1f1', // Background of the scrollbar track
        }
            }}>
        {tags.map((tag) => {
        const labelId = `checkbox-list-label-${tag}`;


        return (
          <ListItem
            key={tag}
            
            disablePadding
          >
            <ListItemButton role={undefined} onClick={handleToggle(tag)} dense>
              <ListItemIcon>
                <Checkbox
                  edge="start"
                  checked={checked.includes(tag)}
                  tabIndex={-1}
                  disableRipple
                  inputProps={{ 'aria-labelledby': labelId }}
                />
              </ListItemIcon>
              <ListItemText id={labelId} primary={tag} />
            </ListItemButton>
          </ListItem>
        );
      })}
    </List>
      </h1>

      {loading && visibleRecipes.length === 0 && !error && (
        <div className="flex items-center justify-center w-full h-full">
          <CircularProgress />
        </div>
      )}

      {!loading && visibleRecipes.length === 0 && !error && (
        <div className="text-gray-600 text-lg text-center mt-8">
          No recipes available.
        </div>
      )}

      <div
        ref={scrollContainerRef}
        className="w-screen h-full overflow-y-auto snap-y snap-mandatory"
        style={{ scrollSnapType: "y mandatory", scrollbarWidth: "none" }}
      >
        {filteredRecipes.map((recipe, index) => (
          <div
            key={recipe.id}
            data-index={index}
            className="recipe-card w-full h-screen flex items-center justify-center snap-center"
          >
          <FlipRecipeCard
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
            onFullDetailsClick={() => console.log(`Clicked for full details on ${recipe.name}`)} // Keep function for other pages
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
