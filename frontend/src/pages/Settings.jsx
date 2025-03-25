import { useState } from "react";
import { getAuth, deleteUser } from "firebase/auth";
import UserDetailsForm from "../components/UserDetailsForm";
import { useNavigate } from "react-router-dom";

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

      if (auth.currentUser) {
        await deleteUser(auth.currentUser); 
        // await deleteUserDetails(auth.currentUser.uid);
        navigate("/sign-in");
      }
    } catch (err) {
      console.error("Error deleting account:", err);
      setError("Failed to delete account. Please re-authenticate and try again.");
    } finally {
      setLoadingDelete(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen w-screen bg-gray-50 montserrat-font">
      <div className="w-full max-w-xl p-6 bg-white shadow-md rounded-2xl">
        <h1 className="text-3xl font-bold text-green-600 text-center mb-8">
          Account Settings
        </h1>
    
        <UserDetailsForm user={userDetails} setUser={setUserDetails} />
    
        {error && <p className="text-red-600 text-center mt-4">{error}</p>}
    
        <button
          onClick={handleDeleteAccount}
          disabled={loadingDelete}
          className="mt-6 w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded-xl transition duration-200"
        >
          {loadingDelete ? "Deleting..." : "Delete Account"}
        </button>
      </div>
    </div>

  );
};

export default Settings;
