import React, { useState } from "react";
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { registerUser, loginUser, getUserByFirebaseUID } from "../utils/api";
import { auth } from "../utils/firebaseConfig.jsx";

const AuthBox = ({ title, isSignUp }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState(""); 
  const [error, setError] = useState(null);
  const [imageUrl, setImageUrl] = useState(""); 
  const navigate = useNavigate();
  const DEFAULT_IMAGE_URL = "https://www.gravatar.com/avatar/?d=mp";
  const isRegisterDisabled = !email || !password || (isSignUp && !username);
  const [touched, setTouched] = useState({
    email: false,
    password: false,
    username: false,
  });
  
  const isInvalid = (field) => {
    if (!touched[field]) return false;
    if (field === "username" && !isSignUp) return false;
    return !eval(field);
  };  

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
        const imageToUpload = imageUrl || DEFAULT_IMAGE_URL;
        response = await registerUser(firebaseToken, email, username, imageToUpload);
      } else {
        response = await loginUser(firebaseToken);
      }
  
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

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onloadend = () => {
      setImageUrl(reader.result); 
    };
    if (file) reader.readAsDataURL(file);
  };

  return (
    <div className="bg-gray-300 text-black p-6 rounded-lg shadow-md w-96 text-center montserrat-font">
      <h2 className="text-xl mb-4">{title}</h2>
      {error && <p className="text-red-500">{error}</p>}
      <form onSubmit={handleSubmit} className="space-y-4">
      <input
        type="email"
        placeholder="Email"
        className={`w-full p-2 rounded focus:outline-none focus:ring-2 ${
          isInvalid("email")
            ? "border-red-500 ring-red-400 bg-red-100"
            : "bg-gray-200 text-black focus:ring-gray-300"
        }`}
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        onBlur={() => setTouched((prev) => ({ ...prev, email: true }))}
        required
      />
      <input
        type="password"
        placeholder="Password"
        className={`w-full p-2 rounded focus:outline-none focus:ring-2 ${
          isInvalid("password")
            ? "border-red-500 ring-red-400 bg-red-100"
            : "bg-gray-200 text-black focus:ring-gray-300"
        }`}
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        onBlur={() => setTouched((prev) => ({ ...prev, password: true }))}
        required
      />
      {isSignUp && (
        <>
          {isSignUp && (
            <input
              type="text"
              placeholder="Username"
              className={`w-full p-2 rounded focus:outline-none focus:ring-2 ${
                isInvalid("username")
                  ? "border-red-500 ring-red-400 bg-red-100"
                  : "bg-gray-200 text-black focus:ring-gray-300"
              }`}
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              onBlur={() => setTouched((prev) => ({ ...prev, username: true }))}
              required
            />
          )}
          <div className="text-left">
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-semibold">
                Profile Image <span className="text-gray-500 text-xs">(optional)</span>
              </label>
              <label htmlFor="upload-image" className="ml-4">
                <div className="cursor-pointer inline-block bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600">
                  Upload Image
                </div>
              </label>
            </div>
            <input
              type="file"
              accept="image/*"
              id="upload-image"
              onChange={handleImageChange}
              className="hidden"
              onBlur={() => setTouched((prev) => ({ ...prev, email: true }))}
            />
            {imageUrl && (
              <img
                src={imageUrl || DEFAULT_IMAGE_URL}
                alt="Preview"
                className="mt-3 rounded-full w-24 h-24 object-cover mx-auto"
              />
            )}
          </div>
        </>
      )}

        <button
          type="submit"
          disabled={isRegisterDisabled}
          className={`w-full py-2 rounded border ${
            isRegisterDisabled
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-gray-600 hover:bg-gray-500 text-black"
          }`}
        >
          {title}
        </button>
      </form>
    </div>
  );
};

export default AuthBox;
