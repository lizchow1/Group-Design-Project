import React, { useEffect, useState } from "react";
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
import { getUserByFirebaseUID } from "./utils/api"; // Import the new API function

const App = () => {
  const [firebaseUser] = useAuthState(auth);
  const [userData, setUserData] = useState(null);

    useEffect(() => {
    auth.signOut(); // Sign out user when app loads
  }, []);

  useEffect(() => {
    if (firebaseUser) {
      fetchUserData(firebaseUser.uid);
    }
  }, [firebaseUser]);

  const fetchUserData = async (firebase_uid) => {
    try {
        const response = await getUserByFirebaseUID(firebase_uid);
        if (response.error) {
            console.error("Error fetching user:", response.error);
        } else {
            setUserData(response); // Set the user details in the frontend state
        }
    } catch (error) {
        console.error("Failed to fetch user details", error);
    }
};


  return (
    <Router>
      {firebaseUser ? (
        <div className="flex">
          <Navbar />
          <div className="flex-1 p-4">
            <Routes>
              <Route path="/" element={<Home user={userData} />} />
              <Route path="/add-recipe" element={<AddRecipe user={userData} />} />
              <Route path="/saved-recipes" element={<SavedRecipes user={userData} />} />
              <Route path="/chatbot" element={<ChatbotPage />} />
              <Route path="/user-profile" element={<UserProfilePage user={userData} />} />
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
