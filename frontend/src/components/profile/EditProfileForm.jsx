import React, { useState } from "react";
import { authUtils, API_ENDPOINTS } from "../../utils/auth";

const EditProfileForm = ({ user, onUpdate }) => {
  const [name, setName] = useState(user.name);
  const [bio, setBio] = useState(user.bio || '');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const updatedUser = await authUtils.apiCall(API_ENDPOINTS.UPDATE_PROFILE(user._id || user.id), {
        method: 'PUT',
        body: JSON.stringify({ 
          name: name.trim(), 
          bio: bio.trim(),
          settings: user.settings 
        })
      });

      // Update local storage with new user data
      localStorage.setItem('userData', JSON.stringify({
        ...JSON.parse(localStorage.getItem('userData')),
        name: updatedUser.name,
        bio: updatedUser.bio
      }));

      if (onUpdate) {
        onUpdate(updatedUser);
      }

      alert('Profile updated successfully!');
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-4 rounded-xl shadow">
      <h3 className="text-lg font-semibold mb-2">Edit Profile</h3>
      
      {error && (
        <div className="mb-3 p-2 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
        </div>
      )}

      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="w-full border p-2 rounded mb-2"
        placeholder="Name"
        required
        disabled={isLoading}
      />
      <textarea
        value={bio}
        onChange={(e) => setBio(e.target.value)}
        className="w-full border p-2 rounded mb-2"
        placeholder="Bio"
        rows="3"
        disabled={isLoading}
      />
      <button 
        type="submit" 
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
        disabled={isLoading}
      >
        {isLoading ? 'Saving...' : 'Save'}
      </button>
    </form>
  );
};

export default EditProfileForm;
