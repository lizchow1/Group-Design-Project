import React, { useState } from "react";
import { Card, CardContent, TextField, Button, IconButton, InputAdornment } from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";

const UserDetailsForm = ({ user, setUser }) => {
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  const green = {
    '& .MuiOutlinedInput-root': {
      '&.Mui-focused fieldset': {
        borderColor: 'green',
      },
    },
    '& .MuiInputLabel-root': {
      '&.Mui-focused': {
        color: 'green',
      },
    },
  };

  return (
    <Card variant="outlined">
      <CardContent>
        <TextField 
          fullWidth 
          margin="normal" 
          label="Email" 
          name="email" 
          type="email" 
          value={user.email} 
          onChange={handleChange} 
          sx={green}
        />
        <TextField 
          fullWidth 
          margin="normal" 
          label="Password" 
          name="password" 
          type={showPassword ? "text" : "password"}  // Toggle visibility
          value={user.password} 
          onChange={handleChange} 
          sx={green}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton onClick={togglePasswordVisibility} edge="end">
                  {showPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            ),
          }}
        />
        <Button 
          variant="contained" 
          fullWidth 
          sx={{ mt: 2, backgroundColor: "green", "&:hover": { backgroundColor: "darkgreen" } }}
        >
          Save Changes
        </Button>
      </CardContent>
    </Card>
  );
};

export default UserDetailsForm;
