import React from "react";
import backgroundImage from "../../public/assets/images/background.svg";

export default function SplashPage() {
  return (
    <div
      style={{
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        minHeight: "100vh",
        width: "100%",
        margin: 0,
        padding: 0,
        position: "fixed",
        top: 0,
        left: 0,
      }}
      className="flex flex-row items-center justify-start"
    >
      <div className="w-full h-full">
        <p className=" font-bebas font-bold text-white text-4xl">SplashPage</p>

        <button className="border border-black bg-black rounded-md text-white font-bold p-2 m-2 text-6xl">
          Get Started
        </button>
      </div>
      <div className="w-full h-full"></div>
    </div>
  );
}
