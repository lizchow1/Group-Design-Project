import React, { useState } from "react";
import { Typography, Box } from "@mui/material";
import UserDetailsForm from "../components/UserDetailsForm";

const UserProfilePage = () => {
  const [user, setUser] = useState({
    username: "chef123",
    email: "chef@example.com",
    name: "John Doe",
  });

  return (
    <div className="relative montserrat-font flex flex-col items-center justify-start min-h-screen w-screen text-white pl-24 pt-24">
      <h1 className="text-3xl font-bold mt-6 absolute top-6 text-white z-20">
        User Profile
      </h1>

      <div className="w-full max-w-md p-6 bg-white shadow-lg rounded-lg flex flex-col mt-16">
        <Typography variant="h5" gutterBottom align="center" className="text-gray-900">
          Edit Profile
        </Typography>
        <Box sx={{ mt: 3 }}>
          <UserDetailsForm user={user} setUser={setUser} />
        </Box>
      </div>
    </div>
  );
};

export default UserProfilePage;
