import React, { useEffect, useState } from "react";
import AddRecipeCard from "../components/AddRecipeForm";
import { useNavigate } from "react-router-dom";



const AddRecipe = ({user}) => {
  const isSubmitting = useState(false);
  const navigate = useNavigate();


  const handleSubmit = async ({ name, description, ingredients, minutes, tags, image }) => {
    if (!user) {
      alert("User not found. Please log in.");
      return;
    }
  
    const recipeData = {
      image: image || '',
      name,
      username: user.username,
      tags: tags.join(","),
      cooking_time: minutes,
      ingredients,
      description,
      isBookmarked: false
    };
  
    try {
      const response = await fetch("http://127.0.0.1:5000/api/recipes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(recipeData),
      });
  
      if (!response.ok) throw new Error("Failed to create recipe");
      navigate("/user-profile");
   
    } catch (error) {
      alert("Error creating recipe: " + error.message);
    }
  };
  

  useEffect(() => {
    if (isSubmitting) {

      handleSubmit();
    }
  }, [isSubmitting]);
  
  return (
    <div className="relative montserrat-font flex flex-col items-center justify-start min-h-screen w-screen text-white pl-24 pt-10"> 
      <h1 class="text-3xl font-bold top-6 text-green-600 z-20 text-center mb-12">
        Add recipe
      </h1>

      <div>
        <AddRecipeCard 
        handleSubmit={handleSubmit}
        />
      </div>

    </div>
  );
};

export default AddRecipe;
