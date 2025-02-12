import React from "react";
import { Link } from "react-router-dom";
import HomeIcon from "@mui/icons-material/Home";
import ArchiveIcon from '@mui/icons-material/Archive';
import GroupIcon from '@mui/icons-material/Group';
import AssistantIcon from '@mui/icons-material/Assistant';
import AddBoxIcon from '@mui/icons-material/AddBox';

const Navbar = () => {
  return (
    <div>
      <div className="fixed montserrat-font ml-5 top-4 z-50">
        <div className="flex flex-col space-y-12 mb-16">
          <div>
          <Link to="/" className="group relative flex items-center">
            <HomeIcon sx={{ fontSize: 40, color: '#6a7282'}} />
            <span className="ml-3.5 group-hover:inline-block group-hover:text-gray-500 text-white text-base opacity-0 group-hover:opacity-100 transition-opacity duration-400">Home</span>
          </Link>
          </div>

          <div>
          <Link to="/saved-recipes" className="group relative flex items-center">
            <ArchiveIcon sx={{ fontSize: 40, color: '#6a7282'}}/>
            <span className="ml-3.5 group-hover:inline-block group-hover:text-gray-500 text-white text-base opacity-0 group-hover:opacity-100 transition-opacity duration-400">Your recipes</span>
            </Link>
          </div>

          <div>
          <Link to="/add-recipe" className="group relative flex items-center">

            <AddBoxIcon sx={{ fontSize: 40, color: '#6a7282'}}/>
            <span className="ml-3.5 group-hover:inline-block group-hover:text-gray-500 text-white text-base opacity-0 group-hover:opacity-100 transition-opacity duration-400">Add recipe</span>
            </Link>
          </div>

          <div>
          <Link to="/friends" className="group relative flex items-center">
            <GroupIcon sx={{ fontSize: 40, color: '#6a7282'}}/>
            <span className="ml-3.5 group-hover:inline-block group-hover:text-gray-500 text-white text-base opacity-0 group-hover:opacity-100 transition-opacity duration-400">Friends</span>
              
            </Link>
          </div>

          <div>
          <Link to="/chatbot" className="group relative flex items-center">
            <AssistantIcon sx={{ fontSize: 40, color: '#6a7282'}}/>
            <span className="ml-3.5 group-hover:inline-block group-hover:text-gray-500 text-white text-base opacity-0 group-hover:opacity-100 transition-opacity duration-400">AI Assistant</span>
             
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
