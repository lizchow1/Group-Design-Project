import React from "react";
import { Card, CardContent, Typography, TextField, Button } from "@mui/material";

const UserDetailsForm = ({ user, setUser }) => {
  const handleChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  return (
    <Card variant="outlined">
      <CardContent>
        <Typography variant="h6">Edit Profile</Typography>
        <TextField 
          fullWidth 
          margin="normal" 
          label="Username" 
          name="username" 
          value={user.username} 
          onChange={handleChange} 
        />
        <TextField 
          fullWidth 
          margin="normal" 
          label="Email" 
          name="email" 
          type="email" 
          value={user.email} 
          onChange={handleChange} 
        />
        <TextField 
          fullWidth 
          margin="normal" 
          label="Name" 
          name="name" 
          value={user.name} 
          onChange={handleChange} 
        />
        <Button variant="contained" color="primary" fullWidth sx={{ mt: 2 }}>
          Save Changes
        </Button>
      </CardContent>
    </Card>
  );
};

export default UserDetailsForm;
