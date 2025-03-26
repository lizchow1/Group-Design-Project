import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { getAuth, signOut } from "firebase/auth";
import HomeIcon from "@mui/icons-material/Home";
import ArchiveIcon from '@mui/icons-material/Archive';
import GroupIcon from '@mui/icons-material/Group';
import AssistantIcon from '@mui/icons-material/Assistant';
import AddBoxIcon from '@mui/icons-material/AddBox';
import AccountCircleOutlinedIcon from '@mui/icons-material/AccountCircleOutlined';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import SettingsOutlinedIcon from '@mui/icons-material/SettingsOutlined';

const Navbar = () => {
  const navigate = useNavigate();
  const auth = getAuth();

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate("/sign-in"); 
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  return (
    <div>
      <div className="fixed montserrat-font h-screen ml-5 top-4 z-50 flex flex-col justify-between">
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

          {/* <div>
          <Link to="/friends" className="group relative flex items-center">
            <GroupIcon sx={{ fontSize: 40, color: '#6a7282'}}/>
            <span className="ml-3.5 group-hover:inline-block group-hover:text-gray-500 text-white text-base opacity-0 group-hover:opacity-100 transition-opacity duration-400">Friends</span>
              
            </Link>
          </div> */}

          <div>
          <Link to="/chatbot" className="group relative flex items-center">
            <AssistantIcon sx={{ fontSize: 40, color: '#6a7282'}}/>
            <span className="ml-3.5 group-hover:inline-block group-hover:text-gray-500 text-white text-base opacity-0 group-hover:opacity-100 transition-opacity duration-400">AI Assistant</span>
             
            </Link>
          </div>

          <div>
          <Link to="/user-profile" className="group relative flex items-center">
            <AccountCircleOutlinedIcon sx={{ fontSize: 40, color: '#6a7282'}}/>
            <span className="ml-3.5 group-hover:inline-block group-hover:text-gray-500 text-white text-base opacity-0 group-hover:opacity-100 transition-opacity duration-400">Profile</span>
    
            </Link>
          </div>
          </div>


        <div className="mt-auto pb-4 mb-16 space-y-12">
        <div>
          <Link to="/settings" className="group relative flex items-center">
            <SettingsOutlinedIcon sx={{ fontSize: 40, color: '#6a7282'}}/>
            <span className="ml-3.5 group-hover:inline-block group-hover:text-gray-500 text-white text-base opacity-0 group-hover:opacity-100 transition-opacity duration-400">Settings</span>
            </Link>
          </div>

          <div onClick={handleLogout} className="group relative flex items-center cursor-pointer">
            <ExitToAppIcon sx={{ fontSize: 40, color: '#6a7282' }} />
            <span className="ml-3.5 group-hover:inline-block group-hover:text-gray-500 text-white text-base opacity-0 group-hover:opacity-100 transition-opacity duration-400">Log Out</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
