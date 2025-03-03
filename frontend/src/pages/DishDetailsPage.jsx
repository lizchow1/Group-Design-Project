import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { getRecipeById } from "../utils/api"; 
import AccessTimeIcon from '@mui/icons-material/AccessTime';

const RecipeDetailsPage = () => {
  const { recipeId } = useParams(); // Extract recipeId from URL
  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRecipe = async () => {
      try {
        const recipeData = await getRecipeById(recipeId); // Fetch recipe
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

  return (
    <div className="montserrat-font flex flex-col items-center justify-center w-screen min-h-screen px-4">

      <h1 className="text-7xl font-bold items-center">{recipe.name}</h1>
      <div className="w-3/4">
        <img src={recipe.image} className="h-[500px] object-cover my-4 rounded-2xl" />
        <div className="flex items-center gap-2 text-xl">
          <AccessTimeIcon className="text-gray-600" />
          <span> - {recipe.cooking_time} min</span>
        </div>

        {/* Ingredients and Description Container */}
        <div className="flex flex-row w-full mt-8">
          
          {/* Ingredients Section */}
          <div className="w-1/2 pr-8">
            <p className="text-3xl font-bold mb-4">Ingredients</p>
            {recipe.ingredients ? (
                <div>
                {recipe.ingredients.split("\n").map((ingredient, index) => (
                  <div key={index} className="flex flex-col items-start py-4">
                    <div className="border-t border-gray-300 w-full"></div> {/* Line above */}
                    <span className="text-lg ">{ingredient.replace("•", "").trim()}</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-lg ml-6">No ingredients available</p>
            )}
          </div>

          {/* Description Section */}
          <div className="w-1/2 pl-8">
            <p className="text-3xl font-bold">Description</p>
            <p className="text-lg text-left">{recipe.description}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RecipeDetailsPage;
