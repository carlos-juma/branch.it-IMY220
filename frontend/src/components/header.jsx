import React from "react";

function Header() {
  return (
    <header className="flex justify-center items-center">
      <div className="flex justify-between items-center p-4 w-[80vw]">
        <span className="font-bebas text-6xl font-extrabold">BRANCH.IT</span>
        <div>
          <nav className="bg-slate-300 text-black rounded-full p-2 font-roboto w-full">
            <ul className="flex flex-row  justify-between space-x-4 p-2 font-semibold font-3xl">
              <li>Home</li>
              <li>Projects</li>
              <li>Teams</li>
            </ul>
          </nav>
        </div>
        <div className="flex flex-row space-x-2 items-center">
          <button className="border-2 border-solid border-black bg-white text-black bg-white rounded-full p-3">
            New Project
          </button>
          <button className="bg-black border rounded-full w-10 h-10"></button>
        </div>
      </div>
    </header>
  );
}

export default Header;
