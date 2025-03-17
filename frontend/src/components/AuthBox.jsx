import React, { useState } from "react";
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { registerUser, loginUser } from "../utils/api";
import { auth } from "../utils/firebaseConfig.jsx";
import { getUserByFirebaseUID } from "../utils/api"; 

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

        const firebaseToken = await userCredential.user.getIdToken();
        const firebaseUID = userCredential.user.uid;

        let response;
        if (isSignUp) {
            response = await registerUser(firebaseToken, email, email.split("@")[0]);
        } else {
            response = await loginUser(firebaseToken);
        }

        // Ensure the user exists in the database
        const userData = await getUserByFirebaseUID(firebaseUID);
        if (!userData || userData.error) {
            throw new Error("User exists in Firebase but not in the database.");
        }

        navigate("/");
    } catch (err) {
        console.error("Auth Error:", err);
        setError(err.message || "Authentication failed. Please check your credentials.");
    }
  };




  return (
    <div className="bg-gray-300 text-black p-6 rounded-lg shadow-md w-96 text-center montserrat-font">
      <h2 className="text-xl mb-4">{title}</h2>
      {error && <p className="text-red-500">{error}</p>}
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="email"
          placeholder="Email"
          className="w-full p-2 bg-gray-200 text-black rounded focus:outline-none focus:ring-2 focus:ring-gray-300"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          className="w-full p-2 bg-gray-200 text-black rounded focus:outline-none focus:ring-2 focus:ring-gray-300"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit" className="w-full bg-gray-600 hover:bg-gray-500 text-black py-2 rounded border">
          {title}
        </button>
      </form>
    </div>
  );
};

export default AuthBox;