import React, { useState } from 'react';
import { authUtils, API_ENDPOINTS } from '../../utils/auth';

const CollaborationManager = ({ project, onCollaborationChange }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showInviteForm, setShowInviteForm] = useState(false);
  const [actionLoading, setActionLoading] = useState({});

  const handleSearchUsers = async (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    try {
      setIsSearching(true);
      const results = await authUtils.apiCall(`${API_ENDPOINTS.SEARCH_USERS}?query=${encodeURIComponent(searchQuery)}`);
      
      // Filter out users who are already collaborators or the owner
      const currentCollaboratorIds = project.collaborators.map(c => c._id || c.id);
      const ownerId = project.ownerId._id || project.ownerId.id;
      
      const filteredResults = results.filter(user => {
        const userId = user._id || user.id;
        return userId !== ownerId && !currentCollaboratorIds.includes(userId);
      });
      
      setSearchResults(filteredResults);
    } catch (error) {
      console.error('Search error:', error);
      alert('Failed to search users');
    } finally {
      setIsSearching(false);
    }
  };

  const handleAddCollaborator = async (userId) => {
    try {
      setActionLoading(prev => ({ ...prev, [userId]: true }));
      
      await authUtils.apiCall(API_ENDPOINTS.ADD_COLLABORATOR(project._id), {
        method: 'POST',
        body: JSON.stringify({ userId })
      });

      // Remove user from search results
      setSearchResults(prev => prev.filter(user => (user._id || user.id) !== userId));
      
      if (onCollaborationChange) {
        onCollaborationChange();
      }

      alert('Collaborator added successfully!');
    } catch (error) {
      alert('Failed to add collaborator: ' + error.message);
    } finally {
      setActionLoading(prev => ({ ...prev, [userId]: false }));
    }
  };

  const handleRemoveCollaborator = async (userId) => {
    if (!confirm('Are you sure you want to remove this collaborator?')) return;

    try {
      setActionLoading(prev => ({ ...prev, [userId]: true }));
      
      await authUtils.apiCall(API_ENDPOINTS.REMOVE_COLLABORATOR(project._id, userId), {
        method: 'DELETE'
      });

      if (onCollaborationChange) {
        onCollaborationChange();
      }

      alert('Collaborator removed successfully!');
    } catch (error) {
      alert('Failed to remove collaborator: ' + error.message);
    } finally {
      setActionLoading(prev => ({ ...prev, [userId]: false }));
    }
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200">
      <div className="px-4 py-3 border-b border-gray-200 flex items-center justify-between">
        <h3 className="text-sm font-semibold text-gray-900">Manage Collaborators</h3>
        <button
          onClick={() => setShowInviteForm(!showInviteForm)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-sm font-medium transition-colors"
        >
          {showInviteForm ? 'Cancel' : '+ Invite'}
        </button>
      </div>

      {/* Invite Form */}
      {showInviteForm && (
        <div className="p-4 bg-gray-50 border-b border-gray-200">
          <form onSubmit={handleSearchUsers} className="space-y-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Search for users to invite
              </label>
              <div className="flex space-x-2">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search by name or email..."
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                  type="submit"
                  disabled={isSearching || !searchQuery.trim()}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium disabled:opacity-50"
                >
                  {isSearching ? 'Searching...' : 'Search'}
                </button>
              </div>
            </div>

            {/* Search Results */}
            {searchResults.length > 0 && (
              <div className="space-y-2">
                <h4 className="text-sm font-medium text-gray-700">Search Results:</h4>
                {searchResults.map((user) => (
                  <div key={user._id || user.id} className="flex items-center justify-between p-3 bg-white border border-gray-200 rounded-md">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-sm font-medium">
                        {user.name.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">{user.name}</p>
                        <p className="text-xs text-gray-500">{user.email}</p>
                      </div>
                    </div>
                    <button
                      onClick={() => handleAddCollaborator(user._id || user.id)}
                      disabled={actionLoading[user._id || user.id]}
                      className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded text-sm font-medium disabled:opacity-50"
                    >
                      {actionLoading[user._id || user.id] ? 'Adding...' : 'Invite'}
                    </button>
                  </div>
                ))}
              </div>
            )}

            {searchResults.length === 0 && searchQuery && !isSearching && (
              <p className="text-sm text-gray-500 text-center py-2">
                No users found matching "{searchQuery}"
              </p>
            )}
          </form>
        </div>
      )}

      {/* Current Collaborators */}
      <div className="p-4">
        <h4 className="text-sm font-medium text-gray-700 mb-3">Current Collaborators:</h4>
        <div className="space-y-3">
          {/* Owner */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-br from-yellow-500 to-orange-600 rounded-full flex items-center justify-center text-white text-sm font-medium">
                {project.ownerId.name.charAt(0).toUpperCase()}
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900">{project.ownerId.name}</p>
                <p className="text-xs text-gray-500">Owner</p>
              </div>
            </div>
            <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded">Owner</span>
          </div>

          {/* Collaborators */}
          {project.collaborators && project.collaborators.length > 0 ? (
            project.collaborators.map((collaborator) => (
              <div key={collaborator._id || collaborator.id} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-sm font-medium">
                    {collaborator.name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">{collaborator.name}</p>
                    <p className="text-xs text-gray-500">Collaborator</p>
                  </div>
                </div>
                <button
                  onClick={() => handleRemoveCollaborator(collaborator._id || collaborator.id)}
                  disabled={actionLoading[collaborator._id || collaborator.id]}
                  className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-sm font-medium disabled:opacity-50"
                >
                  {actionLoading[collaborator._id || collaborator.id] ? 'Removing...' : 'Remove'}
                </button>
              </div>
            ))
          ) : (
            <p className="text-sm text-gray-500 text-center py-2">
              No collaborators yet. Invite users to collaborate on this project!
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default CollaborationManager;