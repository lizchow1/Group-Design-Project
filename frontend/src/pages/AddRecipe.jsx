import React, { useEffect, useState } from "react";
import AddRecipeCard from "../components/AddRecipeForm";


const AddRecipe = () => {
 
  const isSubmitting = useState(false);


  const handleSubmit = async ({ name, description, text, minutes, tags, fileName }) => {
  
    const recipeData = {
      image: fileName || "",
      name,
      username: "defaultUser",
      tags: tags.join(","),
      cooking_time: minutes,
      ingredients: text,
      description,
      isBookmarked: false
    };
  
    try {
      const response = await fetch("http://127.0.0.1:5000/api/recipes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(recipeData),
      });
      console.log(response);
  
      if (!response.ok) throw new Error("Failed to create recipe");
  
      alert("Recipe created successfully!");
 
    } catch (error) {
      alert("Error creating recipe: " + error.message);
    }
  };
  

  useEffect(() => {
    if (isSubmitting) {
      // Trigger API call when isSubmitting is true
      handleSubmit();
    }
  }, [isSubmitting]);
  
  return (
    <div className="montserrat-font flex flex-col justify-center items-center w-full"> 
      <h1 class="text-3xl font-bold mt-6 top-6 text-black z-20 text-center mb-12">
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
