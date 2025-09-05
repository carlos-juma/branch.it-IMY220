import React, { useState } from "react";

const SearchInput = () => {
  const [query, setQuery] = useState("");

  const handleSearch = (e) => {
    e.preventDefault();
    alert(`Searching for: ${query}`);
  };

  return (
    <form onSubmit={handleSearch} className="flex space-x-2 mb-4">
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="border p-2 flex-1 rounded"
        placeholder="Search projects or users..."
      />
      <button type="submit" className="bg-[#00BCF0] text-white px-4 rounded">
        Search
      </button>
    </form>
  );
};

export default SearchInput;
