import React from "react";
import AuthBox from "../components/AuthBox";

const SignIn = () => {
  return (
    <div className="flex justify-center items-center min-h-screen w-screen bg-gray-900">
      <div className="flex flex-col md:flex-row space-y-6 md:space-y-0 md:space-x-10">
        <AuthBox title="Sign In" isSignUp={false} />
        <AuthBox title="Register" isSignUp={true} />
      </div>
    </div>
  );
};

export default SignIn;
