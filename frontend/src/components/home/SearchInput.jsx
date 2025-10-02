import React, { useState } from "react";
import { authUtils, API_ENDPOINTS } from "../../utils/auth";

const SearchInput = ({ onSearchResults }) => {
  const [query, setQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSearch = async (e) => {
    e.preventDefault();
    
    if (!query.trim()) return;
    
    setIsLoading(true);
    
    try {
      const data = await authUtils.apiCall(`${API_ENDPOINTS.SEARCH_USERS}?query=${encodeURIComponent(query)}`);
      
      if (onSearchResults) {
        onSearchResults(data);
      }
    } catch (error) {
      console.error('Search error:', error);
      alert('Search failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSearch} className="flex space-x-2 mb-4">
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="border p-2 flex-1 rounded"
        placeholder="Search users by name or email..."
        disabled={isLoading}
      />
      <button 
        type="submit" 
        className="bg-[#00BCF0] text-white px-4 rounded disabled:opacity-50"
        disabled={isLoading || !query.trim()}
      >
        {isLoading ? 'Searching...' : 'Search'}
      </button>
    </form>
  );
};

export default SearchInput;
