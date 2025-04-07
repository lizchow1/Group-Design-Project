import React, { useEffect, useState } from "react";
import AddRecipeCard from "../components/AddRecipeForm";
import { useNavigate } from "react-router-dom";
import { useUser } from "../contexts/UserContext";


  const AddRecipe = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState(null);
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
      tips
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
    } finally {
      setIsSubmitting(false); // reset submitting flag
    }
  };

  useEffect(() => {
    if (isSubmitting && formData) {
      handleSubmit(formData);
    }
  }, [isSubmitting, formData]);

  return (
    <div className="relative montserrat-font flex flex-col items-center justify-start min-h-screen w-screen text-white pl-24 pt-24"> 
      <h1 className="text-3xl font-bold mt-6 top-6 text-green-600 z-20 text-center mb-12">
        Add recipe
      </h1>

      <div>
        <AddRecipeCard 
          handleSubmit={(data) => {
            setFormData(data);
            setIsSubmitting(true);
          }}
        />
      </div>
    </div>
  );
};

export default AddRecipe;
