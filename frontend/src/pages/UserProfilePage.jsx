import React, { useState, useEffect } from "react";
import { Typography, Box, CircularProgress } from "@mui/material";
import UserDetailsForm from "../components/UserDetailsForm";
import RecipeCard from "../components/RecipeCard";
import { getRecipes } from "../utils/api"; 

const UserProfilePage = () => {
  const [user, setUser] = useState({
    email: "chef@example.com",
    password: "password",
    username: "ChefMaster",
  });

  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRecipes = async () => {
      try {
        const data = await getRecipes();
        setRecipes(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchRecipes();
  }, []);

  return (
    <div className="relative montserrat-font flex flex-col items-center justify-start min-h-screen w-screen text-green-800 pl-24 pt-24">
      <h1 class="text-3xl font-bold mt-6 top-6 text-black z-20 text-center mb-12">
        User Profile
      </h1>

      <div className="flex flex-row gap-8 w-full max-w-7xl mt-16">
        <div className="w-1/3 p-6 bg-white rounded-lg">
          <Typography variant="h5" gutterBottom align="center" className="text-green-800">
            Edit Profile
          </Typography>
          <Box sx={{ mt: 3 }}>
            <UserDetailsForm user={user} setUser={setUser} />
          </Box>
        </div>

        <div className="w-2/3 flex flex-col items-center">
          <div className="w-full flex justify-center mb-4">
            <Typography variant="h5" className="text-green-800 text-center">
              Your Recipes
            </Typography>
          </div>

          {loading ? (
            <div className="flex justify-center">
              <CircularProgress color="success" />
            </div>
          ) : error ? (
            <p className="text-red-500">{error}</p>
          ) : recipes.length === 0 ? (
            <p className="text-gray-500">No recipes found.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {recipes.map((recipe, index) => (
                <RecipeCard key={index} {...recipe} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserProfilePage;
