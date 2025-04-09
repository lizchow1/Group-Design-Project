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
      navigate("/add-recipe");
    } else {
      console.warn("Failed to parse recipe!");
    }
  };

  const parseRecipeText = (text) => {
    const recipe = {
      title: "Untitled",
      servings: '',
      cooking_time: "Unknown",
      minutes: '',
      ingredients: [],
      instructions: [],
      tips: "",
      description: "",
      tags: [],
      image: ""
    };
  
    // 1. Title
    const titleRegex = /\*\*(.*?)\*\*|<b>(.*?)<\/b>|<strong>(.*?)<\/strong>|recipe for you:\s*(.*)/i;
    const titleMatch = text.match(titleRegex);
    recipe.title = titleMatch ? (titleMatch[1] || titleMatch[2] || titleMatch[3] || titleMatch[4] || '').trim() : '';
  
    // 2. Servings
    const servingsRegex = /Servings:\s*(.*)/i;
    const servingsMatch = text.match(servingsRegex);
    let parsedServings = servingsMatch ? parseInt(servingsMatch[1].trim()) : NaN;
    if (!isNaN(parsedServings) && parsedServings > 6) {
      parsedServings = 6;
    }
    recipe.servings = !isNaN(parsedServings) ? parsedServings : 4;
  
    // 3. Ingredients
    const ingredientsRegex = /Ingredients:\s*([\s\S]*?)(?:\n{2,}|Instructions:|\*\*)/i;
    const ingredientsMatch = text.match(ingredientsRegex);
    recipe.ingredients = ingredientsMatch
      ? ingredientsMatch[1]
          .trim()
          .split('\n')
          .map(item => item.replace(/^[-*]\s*/, '').trim())
          .filter(item => item !== '')
      : [];
  
    // 4. Instructions
    const instructionsRegex = /Instructions:\s*([\s\S]*?)(?:\n{2,}|\*\*|Tips:)/i;
    const instructionsMatch = text.match(instructionsRegex);
    recipe.instructions = instructionsMatch
      ? instructionsMatch[1]
          .trim()
          .split('\n')
          .map(item => item.replace(/^\d+\.\s*/, '').trim())
          .filter(item => item !== '')
      : [];
  
    // 5. Tips
    const tipsRegex = /Tips:\s*([\s\S]*)/i;
    const tipsMatch = text.match(tipsRegex);
    recipe.tips = tipsMatch
      ? tipsMatch[1]
          .trim()
          .split('\n')
          .map(item => item.trim())
          .filter(item => /^[-*]/.test(item)) // only tip lines
          .map(item => item.replace(/^[-*]\s*/, '').trim())
      : [];
  
    // 6. Time (and valid minutes mapping)
    const timeRegex = /Time:\s*(.*)/i;
    const timeMatch = text.match(timeRegex);
    let totalMinutes = 0;
  
    if (timeMatch) {
      const timeStr = timeMatch[1].toLowerCase();
      const hourMatch = timeStr.match(/(\d+)\s*hour/);
      const minMatch = timeStr.match(/(\d+)\s*min/);
  
      if (hourMatch) totalMinutes += parseInt(hourMatch[1]) * 60;
      if (minMatch) totalMinutes += parseInt(minMatch[1]);
    }
  
    // Allowed values for dropdown
    const allowedMinutes = [15, 30, 45, 60, 90];
    recipe.minutes = allowedMinutes.reduce((prev, curr) =>
      Math.abs(curr - totalMinutes) < Math.abs(prev - totalMinutes) ? curr : prev
    );
    recipe.cooking_time = recipe.minutes.toString();
  
    // 7. Default description
    recipe.ingredients = recipe.ingredients.length
    ? recipe.ingredients.map(i => `• ${i}`).join('\n')
    : '• ';

    recipe.instructions = recipe.instructions.length
    ? recipe.instructions.map((step, idx) => `${idx + 1}. ${step}`).join('\n')
    : '1. ';

    recipe.tips = recipe.tips.length ? recipe.tips[0] : '';

    recipe.description = `AI-generated recipe for ${recipe.title || "a tasty dish"}`;
  
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
