import React from "react";
import AuthBox from "../components/AuthBox";
import { Link } from "react-router-dom";

const SignIn = () => {
  return (
    <div className="flex justify-center items-center min-h-screen w-screen bg-white">
      <div className="flex flex-col items-center space-y-4">
        <AuthBox title="Sign In" isSignUp={false} />
        <p>
          Don’t have an account?{" "}
          <Link to="/register" className="text-blue-600 underline hover:text-blue-800">
            Register here
          </Link>
        </p>
      </div>
    </div>
  );
};

export default SignIn;
