import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import SavedRecipes from "./pages/SavedRecipes";
import ChatbotPage from "./pages/ChatbotPage";
import AddRecipe from "./pages/AddRecipe";

const App = () => {
  return (
    <Router>
      <div className="flex w-full">
        <Navbar />
        <div className="flex-1 p-4">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/saved-recipes" element={<SavedRecipes />} />
            <Route path="/add-recipe" element={<AddRecipe />} />
            <Route path="/chatbot" element={<ChatbotPage />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
};

export default App;
