import React from "react";
import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <nav>
      <div>
        <h2>Nav Bar</h2>
        <div>
          <Link to="/" >Browse</Link>
          <Link to="/saved-recipes" >Saved Recipes</Link>
          <Link to="/chatbot" >Chatbot</Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
