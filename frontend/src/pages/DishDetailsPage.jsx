import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { getRecipeById } from "../utils/api"; 
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import { updateRecipe } from "../utils/api"; 
import AddRecipeCard from "../components/AddRecipeForm";


const RecipeDetailsPage = () => {
  const { recipeId } = useParams();
  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditOpen, setIsEditOpen] = useState(false); // Manage the visibility of the form



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
      console.log("Updated Recipe:", updatedRecipe);
      alert("Recipe updated successfully!");
      setRecipe(updatedRecipe); // Update the recipe with the new data
      setIsEditOpen(false); // Close the form after submission
    } catch (error) {
      console.error("Error updating recipe:", error);
      alert("Failed to update recipe.");
    }
  };

  const handleEditClick = () => {
    setIsEditOpen(true); // Show the form when clicking "Edit Recipe"
  };


  return (
    <div className="pt-24 montserrat-font flex flex-col items-center justify-center w-screen min-h-screen px-4">
      <div className="w-full flex flex-col items-center">
      <h1 className="mt-6 top-6 text-green-600 text-7xl font-bold items-center">{recipe.name}</h1>
      <div className="flex items-center gap-2 text-xl">
          <AccessTimeIcon className="text-gray-600" />
          <span> - {recipe.cooking_time} min</span>
        </div>
      <div className="">
        <img src={recipe.image} className="h-[500px] object-cover my-4 rounded-2xl" />
        

        <div className="flex flex-row w-full mt-5">
          
          <div className="w-1/2 pr-8">
            <p className="text-3xl font-bold mb-4">Ingredients</p>
            {recipe.ingredients ? (
                <div>
                  <div className="border-t border-gray-300 w-full"></div>
                {recipe.ingredients.split("\n").map((ingredient, index) => (
                  <div key={index} className="flex flex-col items-start">
                    
                    <span className="text-lg m-4">{ingredient.replace("•", "").trim()}</span>
                    <div className="border-t border-gray-300 w-full"></div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-lg ml-6">No ingredients available</p>
            )}
          </div>

          <div className="w-1/2 pl-8">
            <p className="text-3xl font-bold">Description</p>
            <p className="text-lg text-left">{recipe.description}</p>
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
  <div onClick={handleEditClick} className="bg-blue-500 text-white p-2 rounded">
    Update Recipe
</div>
      </div>
      {isEditOpen && (
        <div className="text-black flex items-center justify-center w-full h-screen fixed top-0 left-0 bg-white ">
          <div className="w-full max-w-4xl p-4 pt-24">
          <h1 className="text-3xl font-bold mt-6 top-6 text-green-600 z-20 text-center mb-12">
            Update Recipe
          </h1>
            <AddRecipeCard
              handleSubmit={handleUpdate} // Pass the update function to the form
              initialData={recipe} // Pass the current recipe data for pre-filling
            />
          </div>
        </div>
      )}
      </div>
    </div>
  );
};

export default RecipeDetailsPage;
