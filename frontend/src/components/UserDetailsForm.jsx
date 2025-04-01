import React, { useState } from "react";
import { Card, CardContent, TextField, Button, IconButton, InputAdornment } from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { getAuth, updateEmail, updatePassword } from "firebase/auth";
import { updateUserProfile } from "../utils/api";

const UserDetailsForm = ({ user, setUser }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: user?.email  || "",
    username: user?.username  || "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const auth = getAuth();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  const handleUpdate = async () => {
    setLoading(true);
    setError(null);
    setSuccess(null);
  
    try {
      if (!user || !auth.currentUser) {
        throw new Error("No authenticated user.");
      }
  
      const firebaseToken = await auth.currentUser.getIdToken();
  
      if (formData.email !== user.email) {
        await updateEmail(auth.currentUser, formData.email);
      }
  
      if (formData.password) {
        await updatePassword(auth.currentUser, formData.password);
      }
  
      const result = await updateUserProfile(firebaseToken, formData.email, formData.username);
  
      if (result.error) {
        throw new Error(result.error);
      }
  
      setUser((prevUser) => ({
        ...prevUser,
        email: formData.email,
        username: formData.username,
      }));
  
      setSuccess("Profile updated successfully!");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
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
          value={formData.email}
          onChange={handleChange}
          sx={{
            "& .MuiOutlinedInput-root": {
              "&.Mui-focused fieldset": { borderColor: "green" },
            },
            "& .MuiInputLabel-root": {
              "&.Mui-focused": { color: "green" },
            },
          }}
        />
        <TextField
          fullWidth
          margin="normal"
          label="Username"
          name="username"
          value={formData.username}
          onChange={handleChange}
          sx={{
            "& .MuiOutlinedInput-root": {
              "&.Mui-focused fieldset": { borderColor: "green" },
            },
            "& .MuiInputLabel-root": {
              "&.Mui-focused": { color: "green" },
            },
          }}
        />
        <TextField
          fullWidth
          margin="normal"
          label="New Password (optional)"
          name="password"
          type={showPassword ? "text" : "password"}
          value={formData.password}
          onChange={handleChange}
          placeholder="Enter new password (optional)"
          sx={{
            "& .MuiOutlinedInput-root": {
              "&.Mui-focused fieldset": { borderColor: "green" },
            },
            "& .MuiInputLabel-root": {
              "&.Mui-focused": { color: "green" },
            },
          }}
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
        {error && <p style={{ color: "red", marginTop: "10px" }}>{error}</p>}
        {success && <p style={{ color: "green", marginTop: "10px" }}>{success}</p>}
        <Button
          variant="contained"
          fullWidth
          sx={{ mt: 2, backgroundColor: "green", "&:hover": { backgroundColor: "darkgreen" } }}
          onClick={handleUpdate}
          disabled={loading}
        >
          {loading ? "Updating..." : "Save Changes"}
        </Button>
      </CardContent>
    </Card>
  );
};

export default UserDetailsForm;
