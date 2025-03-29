import { useState } from "react";
import { getAuth, deleteUser, EmailAuthProvider, reauthenticateWithCredential } from "firebase/auth";
import UserDetailsForm from "../components/UserDetailsForm";
import { Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { deleteUserFromDB } from "../utils/api";


const Settings = ({ user }) => {
  const [userDetails, setUserDetails] = useState(user);
  const [error, setError] = useState(null);
  const [loadingDelete, setLoadingDelete] = useState(false);
  const navigate = useNavigate();


  const handleDeleteAccount = async () => {
    const auth = getAuth();
    const confirmed = window.confirm("Are you sure you want to delete your account? This action cannot be undone.");
    if (!confirmed) return;
  
    try {
      setLoadingDelete(true);
      setError(null);
  
      const user = auth.currentUser;
      if (!user) throw new Error("No user is currently logged in.");
  
      const uid = user.uid; 
  
      const email = user.email;
      const password = prompt("Please re-enter your password to confirm:");
      if (!password) throw new Error("Password is required for reauthentication.");
  
      const credential = EmailAuthProvider.credential(email, password);
      await reauthenticateWithCredential(user, credential);
  
      await deleteUser(user);
  
      const response = await deleteUserFromDB(uid);
      console.log("Backend response:", response);
  
      navigate("/sign-in");
    } catch (err) {
      console.error("Error deleting account:", err);
      setError("Failed to delete account. Please re-authenticate and try again.");
    } finally {
      setLoadingDelete(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen w-screen montserrat-font">
      <div className="w-full max-w-xl p-6 bg-white shadow-md rounded-2xl">
        <h1 className="text-3xl font-bold text-green-600 text-center mb-8">
          Account Settings
        </h1>
    
        <UserDetailsForm user={userDetails} setUser={setUserDetails} />
    
        {error && <p className="text-red-600 text-center mt-4">{error}</p>}
    
        <Button
          variant="contained"
          fullWidth
          sx={{
            mt: 2,
            backgroundColor: "red",
            "&:hover": {
              backgroundColor: "darkred",
            },
          }}
          onClick={handleDeleteAccount}
          disabled={loadingDelete}
        >
          {loadingDelete ? "Deleting..." : "Delete Account"}
        </Button>
      </div>
    </div>

  );
};

export default Settings;
