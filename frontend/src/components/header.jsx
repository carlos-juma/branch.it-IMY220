import React, { useState, useEffect } from "react";
import { authUtils, API_ENDPOINTS } from "../utils/auth";

function Header() {
  const user = authUtils.getUser();
  const [pendingRequests, setPendingRequests] = useState(0);

  useEffect(() => {
    if (user) {
      fetchPendingRequests();
    }
  }, [user]);

  const fetchPendingRequests = async () => {
    try {
      const requests = await authUtils.apiCall(API_ENDPOINTS.GET_FRIEND_REQUESTS);
      setPendingRequests(requests ? requests.length : 0);
    } catch (error) {
      console.error('Error fetching pending requests:', error);
    }
  };

  const handleLogout = () => {
    authUtils.logout();
  };

  return (
    <header className="flex justify-center items-center">
      <div className="flex justify-between items-center p-4 w-[80vw]">
        <a href="/home">
          <span className="font-bebas text-6xl font-extrabold">BRANCH.IT</span>
        </a>
        <div>
          <nav className="bg-slate-300 text-black rounded-full p-2 font-roboto w-full">
            <ul className="flex flex-row  justify-between space-x-4 p-2 font-semibold font-3xl">
              <li>
                <a href="/home">Home</a>
              </li>
              <li>
                <a href="/projects">Projects</a>
              </li>
              <li>
                <a href="/notifications">Notifications</a>
              </li>
            </ul>
          </nav>
        </div>
        <div className="flex flex-row space-x-2 items-center">
          <button className="border-2 border-solid border-black bg-white text-black bg-white rounded-full p-3">
            New Project
          </button>
          {user && (
            <div className="flex items-center space-x-2">
              {/* Notifications Button */}
              <a href="/notifications" className="relative">
                <button className="bg-gray-200 hover:bg-gray-300 text-black rounded-full p-2 text-sm">
                  🔔
                  {pendingRequests > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                      {pendingRequests}
                    </span>
                  )}
                </button>
              </a>
              <span className="text-sm font-medium">{user.name}</span>
              <a href={`/profile/${user.id}`} className="cursor-pointer">
                <button className="bg-black border rounded-full w-10 h-10"></button>
              </a>
              <button 
                onClick={handleLogout}
                className="text-sm text-red-600 hover:text-red-800"
              >
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

export default Header;
