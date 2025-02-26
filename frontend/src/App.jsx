import React, { useEffect } from "react";
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import SavedRecipes from "./pages/SavedRecipes";
import ChatbotPage from "./pages/ChatbotPage";
import SignIn from "./pages/SignIn";
import UserProfilePage from "./pages/UserProfilePage";
import AddRecipe from "./pages/AddRecipe";
import { auth } from "./utils/firebaseConfig";
import { useAuthState } from "react-firebase-hooks/auth";

const App = () => {
  const [user] = useAuthState(auth);

  useEffect(() => {
    auth.signOut(); // Sign out user when app loads
  }, []);

  return (
    <Router>
      {user ? (
        <div className="flex">
          <Navbar />
          <div className="flex-1 p-4">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/add-recipe" element={<AddRecipe />} />
              <Route path="/saved-recipes" element={<SavedRecipes />} />
              <Route path="/chatbot" element={<ChatbotPage />} />
              <Route path="/user-profile" element={<UserProfilePage />} />
              <Route path="*" element={<Navigate to="/" />} />
          </Routes>
          </div>
        </div>
      ) : (
        <Routes>
          <Route path="/sign-in" element={<SignIn />} />
          <Route path="*" element={<Navigate to="/sign-in" />} />
        </Routes>
      )}
    </Router>
  );
};

export default App;
