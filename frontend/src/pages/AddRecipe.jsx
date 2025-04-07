import React, { useEffect, useState } from "react";
import AddRecipeCard from "../components/AddRecipeForm";
import { useNavigate } from "react-router-dom";
import { useUser } from "../contexts/UserContext";

const AddRecipe = () => {
  const [initialData, setInitialData] = useState(null);
  const navigate = useNavigate();
  const { user } = useUser();

  const handleSubmit = async ({ name, description, ingredients, minutes, tags, image, servings, instructions, tips }) => {
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
      isBookmarked: false,
      servings,
      instructions,
      tips,
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
    const storedRecipe = localStorage.getItem("selectedRecipe");
    if (storedRecipe) {
      try {
        const parsedRecipe = JSON.parse(storedRecipe);
        setInitialData({
          name: parsedRecipe.title || '',
          description: parsedRecipe.description || '', // Assuming your parseRecipeText might have a description
          ingredients: parsedRecipe.ingredients?.map(i => `• ${i}`).join('\n') || '• ',
          instructions: parsedRecipe.instructions?.map(i => `${parsedRecipe.instructions.indexOf(i) + 1}. ${i}`).join('\n') || '1. ',
          tags: parsedRecipe.tags || [],
          cooking_time: parsedRecipe.servings || '', // You might need to adjust this based on your AI output
          servings: parsedRecipe.servings || '',
          tips: parsedRecipe.tips?.join('\n') || '',
          image: '', // AI usually doesn't provide image data directly
        });
        localStorage.removeItem("selectedRecipe"); // Clear from local storage after using
      } catch (error) {
        console.error("Error parsing stored recipe:", error);
        localStorage.removeItem("selectedRecipe"); // Clear if there's an error
      }
    }
  }, []);

  return (
    <div className="relative montserrat-font flex flex-col items-center justify-start min-h-screen w-screen text-white pl-24 pt-24">
      <h1 className="text-3xl font-bold mt-6 top-6 text-green-600 z-20 text-center mb-12">
        Add recipe
      </h1>

      <div>
        <AddRecipeCard
          handleSubmit={handleSubmit}
          initialData={initialData}
        />
      </div>
    </div>
  );
};

export default AddRecipe;