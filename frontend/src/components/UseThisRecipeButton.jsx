import React from 'react';

const UseThisRecipeButton = ({ latestRecipe }) => {
  const handleUseRecipe = () => {
    if (!latestRecipe) {
      console.warn("No recipe to store!");
      return;
    }

    // Remove previous recipe
    localStorage.removeItem('selectedRecipe');

    // Save the latest recipe to localStorage
    localStorage.setItem('selectedRecipe', latestRecipe);

    console.log("Stored recipe in localStorage:", latestRecipe);
  };

  return (
    <button
      onClick={handleUseRecipe}
      className="mt-4 p-2 bg-green-500 text-black shadow-lg rounded-lg"
    >
      Use This Recipe
    </button>
  );
};

export default UseThisRecipeButton;
