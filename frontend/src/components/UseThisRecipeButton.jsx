import React from 'react';
import { useNavigate } from "react-router-dom";

const UseThisRecipeButton = ({ messages }) => {
  const navigate = useNavigate();

  const handleUseRecipe = () => {
    if (!messages || messages.length === 0) {
      console.warn("No messages found!");
      return;
    }

    const reversedMessages = [...messages].reverse();
    const lastBotMessage = reversedMessages.find(msg => msg.sender === 'RamsAI');

    if (!lastBotMessage) {
      console.warn("No RamsAI message found!");
      return;
    }

    const parsedRecipe = parseRecipeText(lastBotMessage.text);

    if (parsedRecipe) {
      localStorage.setItem('isAIGenerated', 'true');
      localStorage.setItem('selectedRecipe', JSON.stringify(parsedRecipe));
      console.log("Parsed recipe stored in localStorage:", parsedRecipe);
      navigate("/add-recipe");
    } else {
      console.warn("Failed to parse recipe!");
    }
  };

  const parseRecipeText = (text) => {
    const recipe = {};

    // 1. Title: Look for the second line after the greeting (or a line after colon)
    const titleRegex = /\*\*(.*?)\*\*|<b>(.*?)<\/b>|<strong>(.*?)<\/strong>|recipe for you:\s*(.*)/i;
    const titleMatch = text.match(titleRegex);
    recipe.title = titleMatch ? (titleMatch[1] || titleMatch[2] || titleMatch[3] || titleMatch[4] || '').trim() : '';



    // 2. Servings: Look for "Servings: X" after title
    const servingsRegex = /Servings:\s*(.*)/i;
    const servingsMatch = text.match(servingsRegex);
    recipe.servings = servingsMatch ? servingsMatch[1].trim() : '';

    // 3. Ingredients section
    const ingredientsRegex = /Ingredients:\s*([\s\S]*?)Instructions:/i;
    const ingredientsMatch = text.match(ingredientsRegex);
    recipe.ingredients = ingredientsMatch
      ? ingredientsMatch[1]
          .trim()
          .split('\n')
          .map(item => item.trim())
          .filter(item => item !== '')
      : [];

    // 4. Instructions section
    const instructionsRegex = /Instructions:\s*([\s\S]*?)(Tips:|$)/i;
    const instructionsMatch = text.match(instructionsRegex);
    recipe.instructions = instructionsMatch
      ? instructionsMatch[1]
          .trim()
          .split('\n')
          .map(item => item.replace(/^\d+\.\s*/, '').trim())
          .filter(item => item !== '')
      : [];

    // 5. Tips section
    const tipsRegex = /Tips:\s*([\s\S]*)/i;
    const tipsMatch = text.match(tipsRegex);
    recipe.tips = tipsMatch
      ? tipsMatch[1]
          .trim()
          .split('\n')
          .map(item => item.replace(/^- /, '').trim())
          .filter(item => item !== '')
      : [];

    return recipe;
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
