import React, { useState, useEffect } from "react";
import { Typography, Box, CircularProgress, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { getAuth, signOut } from "firebase/auth";
import UserDetailsForm from "../components/UserDetailsForm";
import RecipeCard from "../components/RecipeCard";
import { getRecipes } from "../utils/api"; 

const UserProfilePage = ({ user }) => {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const auth = getAuth();

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

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate("/signin"); 
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <div className="relative montserrat-font flex flex-col items-center justify-start min-h-screen w-screen text-green-800 pl-24 pt-24">
      <h1 className="text-3xl font-bold mt-6 top-6 text-green-600 z-20 text-center mb-12">
        User Profile
      </h1>

      <div className="flex flex-row gap-8 w-full max-w-7xl mt-16">
        <div className="w-1/3 p-6 bg-white rounded-lg shadow-md flex flex-col items-center">
          <Typography variant="h5" gutterBottom align="center" className="text-green-800">
            Edit Profile
          </Typography>
          <Box sx={{ mt: 3, width: "100%" }}>
            <UserDetailsForm user={user} />
          </Box>

          <Button
            variant="contained"
            color="error"
            onClick={handleLogout}
            sx={{ mt: 4, width: "100%" }} 
          >
            Logout
          </Button>
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
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
              {recipes.map((recipe, index) => (
                <RecipeCard key={index} {...recipe} small />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserProfilePage;
