import React from "react";
import { RegisterForm } from "../components/registerForm";
import backgroundImage from "../../public/assets/images/background.svg";
import { Link } from "react-router-dom";

export default function RegisterPage() {
  return (
    <div className="min-h-screen flex">
      <div className="flex-1 flex items-center justify-center bg-white px-8 py-12">
        <div className="w-full max-w-md space-y-8">
          <div className="text-center">
            <Link to="/" className="text-3xl font-bebas font-extrabold text-gray-900">
              BRANCH.IT
            </Link>
          </div>
          
          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-900">Create an Account</h2>
            <p className="mt-2 text-gray-600">
              Already have an account?{" "}
              <Link
                to="/login"
                className="font-medium text-blue-600 hover:text-blue-500 transition-colors"
              >
                Sign in
              </Link>
            </p>
          </div>
          
          <RegisterForm />
        </div>
      </div>
      
      <div 
        className="hidden lg:flex flex-1 items-center justify-center"
        style={{
          backgroundImage: `url(${backgroundImage})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      >
        <div className="text-center px-12">
          <h1 className="text-white font-bebas text-6xl font-extrabold mb-4">
            START YOUR JOURNEY.
          </h1>
          <p className="text-white/80 text-xl font-light max-w-md">
          Turn ideas into reality.
          </p>
        </div>
      </div>
    </div>
  );
}
