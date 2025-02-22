import React, { useState } from "react";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { registerUser, loginUser } from "../utils/api";
import { auth } from "../utils/firebaseConfig.jsx";


const AuthBox = ({ title, isSignUp }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
      e.preventDefault();
      setError(null);
      try {
          let userCredential;
          if (isSignUp) {
              userCredential = await createUserWithEmailAndPassword(auth, email, password);
          } else {
              userCredential = await signInWithEmailAndPassword(auth, email, password);
          }

          // Get Firebase Token
          const firebaseToken = await userCredential.user.getIdToken();

          // Send Firebase Token to Backend
          if (isSignUp) {
              await registerUser(firebaseToken, email, email.split("@")[0]); // Use email prefix as username
          } else {
              await loginUser(firebaseToken);
          }

          navigate("/"); // Redirect after authentication
      } catch (err) {
          setError("Authentication failed. Please check your credentials.");
      }
  };

  return (
    <div className="bg-gray-800 text-white p-6 rounded-lg shadow-md w-96 text-center montserrat-font">
      <h2 className="text-xl mb-4">{title}</h2>
      {error && <p className="text-red-500">{error}</p>}
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="email"
          placeholder="Email"
          className="w-full p-2 bg-gray-700 text-white border border-gray-600 rounded focus:outline-none focus:ring-2 focus:ring-gray-500"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          className="w-full p-2 bg-gray-700 text-white border border-gray-600 rounded focus:outline-none focus:ring-2 focus:ring-gray-500"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit" className="w-full bg-gray-600 hover:bg-gray-500 text-white py-2 rounded">
          {title}
        </button>
      </form>
    </div>
  );
};

export default AuthBox;