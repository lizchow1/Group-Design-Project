import { useState } from "react";
import {
  getAuth,
  deleteUser,
  EmailAuthProvider,
  reauthenticateWithCredential,
} from "firebase/auth";
import UserDetailsForm from "../components/UserDetailsForm";
import { Button, TextField } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { deleteUserFromDB } from "../utils/api";
import Modal from "../components/Modal";
import { useUser } from "../contexts/UserContext";

const Settings = () => {
  const { user, setUser } = useUser();
  const [error, setError] = useState(null);
  const [loadingDelete, setLoadingDelete] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [passwordInput, setPasswordInput] = useState("");
  const navigate = useNavigate();

  const confirmDeleteAccount = () => {
    setShowConfirmModal(true);
  };

  const handleDeleteAccount = async () => {
    const auth = getAuth();

    try {
      setLoadingDelete(true);
      setError(null);

      const currentUser = auth.currentUser;
      if (!currentUser) throw new Error("No user is currently logged in.");

      const uid = currentUser.uid;
      const email = currentUser.email;

      if (!passwordInput) {
        setError("Password is required.");
        return;
      }

      const credential = EmailAuthProvider.credential(email, passwordInput);
      await reauthenticateWithCredential(currentUser, credential);

      const response = await deleteUserFromDB(uid);

      if (response?.message === "User deleted successfully") {
        await deleteUser(currentUser);
        navigate("/sign-in");
      } else {
        setError("Backend deletion failed. Your account was not removed.");
      }
    } catch (err) {
      console.error("Error deleting account:", err);
      if (err.code === "auth/wrong-password") {
        setError("Incorrect password. Please try again.");
      } else if (err.code === "auth/too-many-requests") {
        setError("Too many failed attempts. Please try again later.");
      } else {
        setError("Failed to delete account. Please try again.");
      }
    } finally {
      setLoadingDelete(false);
      if (!error) {
        setShowPasswordModal(false);
        setPasswordInput("");
      }
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen w-screen montserrat-font">
      <div className="w-full max-w-xl p-6 bg-white shadow-md rounded-2xl">
        <h1 className="text-3xl font-bold text-green-600 text-center mb-8">
          Account Settings
        </h1>

        <UserDetailsForm user={user} setUser={setUser} />

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
          onClick={confirmDeleteAccount}
          disabled={loadingDelete}
        >
          {loadingDelete ? "Deleting..." : "Delete Account"}
        </Button>
      </div>

      <Modal
        isOpen={showConfirmModal}
        title="Delete Your Account?"
        message="This will permanently delete your profile. Are you sure you want to continue?"
        confirmText="Continue"
        cancelText="Cancel"
        onConfirm={() => {
          setShowConfirmModal(false);
          setShowPasswordModal(true);
        }}
        onCancel={() => setShowConfirmModal(false)}
      />

      <Modal
        isOpen={showPasswordModal}
        title="Re-enter Your Password"
        message={
          <TextField
            type="password"
            label="Password"
            fullWidth
            variant="outlined"
            value={passwordInput}
            onChange={(e) => setPasswordInput(e.target.value)}
            sx={{ mt: 2 }}
          />
        }
        confirmText="Delete Account"
        cancelText="Cancel"
        onConfirm={handleDeleteAccount}
        onCancel={() => {
          setShowPasswordModal(false);
          setPasswordInput("");
        }}
      />
    </div>
  );
};

export default Settings;
