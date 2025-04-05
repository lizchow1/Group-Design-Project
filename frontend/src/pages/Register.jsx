import React from "react";
import AuthBox from "../components/AuthBox";

const Register = () => {
  return (
    <div className="flex justify-center items-center min-h-screen w-screen bg-white">
      <AuthBox title="Register" isSignUp={true} />
    </div>
  );
};

export default Register;