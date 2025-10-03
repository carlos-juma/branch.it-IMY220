import React, { useState, useEffect } from "react";
import Feed from "../components/home/Feed";
import SearchInput from "../components/home/SearchInput";
import FriendsList from "../components/profile/FriendsList";
import FriendRequests from "../components/profile/FriendRequests";
import ProfilePreview from "../components/profile/ProfilePreview";
import { authUtils, API_ENDPOINTS } from "../utils/auth";

const HomePage = () => {
  const [searchResults, setSearchResults] = useState([]);
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [projects, setProjects] = useState([]);
  const [friends, setFriends] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchHomeData();
  }, []);

  const fetchHomeData = async () => {
    try {
      setLoading(true);
      
      const projectsData = await authUtils.apiCall(API_ENDPOINTS.GET_PROJECTS);
      setProjects(projectsData.slice(0, 10)); // Show first 10 projects
      
      const friendsData = await authUtils.apiCall(API_ENDPOINTS.GET_FRIENDS);
      setFriends(friendsData);
      
    } catch (error) {
      console.error('Error fetching home data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearchResults = (results) => {
    setSearchResults(results);
    setShowSearchResults(true);
  };

  const clearSearch = () => {
    setSearchResults([]);
    setShowSearchResults(false);
  };

  if (loading) {
    return (
      <main className="p-6 w-[80vw] mx-auto flex flex-row justify-between gap-6">
        <div className="w-[45vw]">
          <div className="text-center">Loading...</div>
        </div>
        <div className="w-80">
          <div className="text-center">Loading friends...</div>
        </div>
      </main>
    );
  }

  return (
    <main className="p-6 w-[80vw] mx-auto flex flex-row justify-between gap-6">
      <div className="w-[45vw]">
        <h1 className="text-2xl font-bold mb-4">
          {showSearchResults ? 'Search Results' : 'Home Feed'}
        </h1>
        <SearchInput onSearchResults={handleSearchResults} />
        
        {showSearchResults && (
          <div className="mb-4">
            <button 
              onClick={clearSearch}
              className="text-blue-600 hover:text-blue-800 text-sm"
            >
              ← Back to Feed
            </button>
          </div>
        )}
        
        {showSearchResults ? (
          <div className="space-y-4">
            {searchResults.length > 0 ? (
              searchResults.map((user) => (
                <ProfilePreview key={user._id || user.id} user={{
                  id: user._id || user.id,
                  name: user.name,
                  email: user.email,
                  avatar: user.avatar || '/assets/images/default-avatar.png'
                }} />
              ))
            ) : (
              <p className="text-gray-500">No users found.</p>
            )}
          </div>
        ) : (
          <Feed projects={projects} />
        )}
      </div>
      <div className="w-80">
        <div className="space-y-4">
          <FriendRequests onRequestChange={fetchHomeData} />
          <FriendsList friends={friends} />
        </div>
      </div>
    </main>
  );
};

export default HomePage;
