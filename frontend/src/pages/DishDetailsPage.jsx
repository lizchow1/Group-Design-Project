import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { getRecipeById } from "../utils/api"; 
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import { updateRecipe } from "../utils/api"; 
import { deleteRecipeByID } from "../utils/api";
import AddRecipeCard from "../components/AddRecipeForm";
import * as React from 'react';
import Button from '@mui/material/Button';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import MoreHorizOutlinedIcon from '@mui/icons-material/MoreHorizOutlined';
import DeleteIcon from '@mui/icons-material/Delete';
import ModeEditOutlineIcon from '@mui/icons-material/ModeEditOutline';
import { useNavigate } from "react-router-dom";



const RecipeDetailsPage = () => {
  const { recipeId } = useParams();
  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const navigate = useNavigate();

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const green = {
    '& .MuiOutlinedInput-root': {
      '&.Mui-focused fieldset': {
        borderColor: 'green',
      },
    },
    '& .MuiInputLabel-root': {
'&.Mui-focused': {
  color: 'green',
},
},
  };


  useEffect(() => {
    const fetchRecipe = async () => {
      try {
        const recipeData = await getRecipeById(recipeId);
        setRecipe(recipeData);
        console.log("recipedata", recipeData)
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchRecipe();
  }, [recipeId]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p className="text-red-500">{error}</p>;
  if (!recipe) return <p>Recipe not found</p>;

  const handleUpdate = async (updatedData) => {
    try {
      const updatedRecipe = await updateRecipe(recipeId, updatedData);
      setRecipe(updatedRecipe);
      setIsEditOpen(false);
    } catch (error) {
      console.error("Error updating recipe:", error);
      alert("Failed to update recipe.");
    }
  };

  const handleDelete = async () => {
    try {
      const response = await deleteRecipeByID(recipeId); // Call the delete function
      console.log("api response", response);
      navigate("/user-profile");
      
    } catch (error) {
      console.error("Error deleting recipe:", error);
      alert("Failed to delete the recipe");
    }
  };

  const handleEditClick = () => {
    setIsEditOpen(true);
    setAnchorEl(null);
  };


  return (
    
    <div className="pt-24 pb-40 montserrat-font flex flex-col items-center justify-center w-screen min-h-screen px-4">
      <div className="w-full flex flex-col items-center">
        
      <h1 className="mt-6 top-6 text-green-600 text-7xl font-bold items-center">{recipe.name}</h1>
      <div className="flex items-center gap-2 text-xl mx-auto">
          <AccessTimeIcon className="text-gray-600" />
          <span> - {recipe.cooking_time} min</span>
        </div>
        <div className="ml-auto mr-56">
      <Button
        id="demo-positioned-button"
        aria-controls={open ? 'demo-positioned-menu' : undefined}
        aria-haspopup="true"
        aria-expanded={open ? 'true' : undefined}
        onClick={handleClick}
        sx={{
          '&:focus': {
            outline: 'none',
          },
          '&:active': {
            outline: 'none',
          },
        }}
        
      >
        <MoreHorizOutlinedIcon sx={{ fontSize: '3rem', color: 'green' }}/>
      </Button>
      <Menu
        id="demo-positioned-menu"
        aria-labelledby="demo-positioned-button"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}
      >
        <MenuItem onClick={handleEditClick}> <ModeEditOutlineIcon/>Edit</MenuItem>
        <MenuItem onClick={handleDelete}><DeleteIcon/>Delete</MenuItem>
      </Menu>
    </div>
      <div className="w-[400px] md:w-[1000px]">
      <div className="w-[400px] h-[250px] md:w-[1000px] md:h-[400px] my-4 rounded-2xl flex items-center justify-center border border-gray-400 bg-gray-100">
      {recipe.image ? (
        recipe.image.startsWith("data:video") ? (
          <video controls className="w-full h-full object-cover rounded-2xl">
            <source src={recipe.image} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        ) : (
          <img src={recipe.image} className="w-full h-full object-cover rounded-2xl" alt="Dish" />
        )
      ) : (
        <p className="text-gray-600 text-xl font-semibold">No image available</p>
      )}
    </div>

        <div className="flex flex-row w-full mt-5">
          <div className="w-1/2 pr-8">
            <p className="text-2xl md:text-3xl font-bold mb-4">Ingredients</p>
            {recipe.ingredients ? (
                <div>
                  <div className="border-t border-gray-300 w-full"></div>
                {recipe.ingredients.split("\n").map((ingredient, index) => (
                  <div key={index} className="flex flex-col items-start">
                    
                    <span className="text-base md:text-lg mt-4 mb-4">{ingredient.replace("•", "").trim()}</span>
                    <div className="border-t border-gray-300 w-full"></div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-lg ml-6">No ingredients available</p>
            )}
          </div>

          <div className="w-1/2 pl-8">
            <p className="text-2xl md:text-3xl font-bold mb-4">Description</p>
            <div className="border-t border-gray-300 w-full"/>
            <p className="text-base md:text-lg text-left mt-4">{recipe.description}</p>
          </div>
        </div>

        {recipe.tags && recipe.tags.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-10 mb-6 w-full">
          {recipe.tags.map((tag, index) => (
            <span
              key={index}
              className="bg-green-200 text-green-700 px-6 py-2 rounded-full text-sm font-medium"
            >
              {tag}
            </span>
          ))}
        </div>
        )}

      </div>
      {isEditOpen && (
        <div className="text-black flex items-center justify-center w-full h-screen fixed top-0 left-0 bg-white ">
          <div className="w-full max-w-4xl p-4 pt-24">
            <h1 className="text-3xl font-bold mt-6 top-6 text-green-600 z-20 text-center mb-12">
              Update Recipe
            </h1>
              <AddRecipeCard
                handleSubmit={handleUpdate}
                initialData={recipe}
              />
          </div>
        </div>
      )}
      </div>
    </div>
  );
};

export default RecipeDetailsPage;
