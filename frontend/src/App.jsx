import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import SavedRecipes from "./pages/SavedRecipes";
import ChatbotPage from "./pages/ChatbotPage";
import "./index.css";

const App = () => {
  return (
    <Router>
      <div>
        <Navbar />
        <div className="p-4">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/saved-recipes" element={<SavedRecipes />} />
            <Route path="/chatbot" element={<ChatbotPage />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
};

export default App;
