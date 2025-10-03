import React from "react";
import backgroundImage from "../../public/assets/images/background.svg";
import { Link } from "react-router-dom";

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
      <div className="w-full h-full flex flex-col ml-14">
        <span className="text-[#303539] font-bebas text-[120px] font-extrabold">
          BRANCH.IT
          <p className="text-white font-bebas text-[120px] font-extrabold py-0">
            ORGANISE CHAOS.
          </p>
        </span>
        <Link to="/login">
          <button className="border border-[#303539] bg-[#303539] rounded-md text-white font-bold p-2 m-2 text-6xl hover:">
            Get Started →
          </button>
        </Link>
      </div>
      <div className="w-full h-full"></div>
    </div>
  );
}
