import React, { useState, useEffect } from 'react';
import { authUtils, API_ENDPOINTS } from '../../utils/auth';

const FriendshipActions = ({ userId, onFriendshipChange }) => {
  const [friendshipStatus, setFriendshipStatus] = useState('none');
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    fetchFriendshipStatus();
  }, [userId]);

  const fetchFriendshipStatus = async () => {
    try {
      setLoading(true);
      const response = await authUtils.apiCall(API_ENDPOINTS.GET_FRIENDSHIP_STATUS(userId));
      setFriendshipStatus(response.status);
    } catch (error) {
      console.error('Error fetching friendship status:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSendFriendRequest = async () => {
    try {
      setActionLoading(true);
      await authUtils.apiCall(API_ENDPOINTS.SEND_FRIEND_REQUEST, {
        method: 'POST',
        body: JSON.stringify({ userId })
      });
      setFriendshipStatus('sent');
      if (onFriendshipChange) onFriendshipChange();
    } catch (error) {
      alert('Failed to send friend request: ' + error.message);
    } finally {
      setActionLoading(false);
    }
  };

  const handleUnfriend = async () => {
    if (!confirm('Are you sure you want to unfriend this user?')) return;

    try {
      setActionLoading(true);
      await authUtils.apiCall(API_ENDPOINTS.UNFRIEND(userId), {
        method: 'DELETE'
      });
      setFriendshipStatus('none');
      if (onFriendshipChange) onFriendshipChange();
    } catch (error) {
      alert('Failed to unfriend: ' + error.message);
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) {
    return <div className="mt-4">Loading friendship status...</div>;
  }

  return (
    <div className="mt-4 p-4 bg-gray-50 rounded-lg">
      {friendshipStatus === 'none' && (
        <button
          onClick={handleSendFriendRequest}
          disabled={actionLoading}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
        >
          {actionLoading ? 'Sending...' : 'Send Friend Request'}
        </button>
      )}

      {friendshipStatus === 'sent' && (
        <div className="text-gray-600">
          Friend request sent. Waiting for response.
        </div>
      )}

      {friendshipStatus === 'received' && (
        <div className="text-gray-600">
          This user has sent you a friend request. Check your notifications.
        </div>
      )}

      {friendshipStatus === 'accepted' && (
        <div className="flex items-center space-x-4">
          <span className="text-green-600 font-medium">✓ Friends</span>
          <button
            onClick={handleUnfriend}
            disabled={actionLoading}
            className="bg-red-600 text-white px-3 py-1 rounded text-sm hover:bg-red-700 disabled:opacity-50"
          >
            {actionLoading ? 'Removing...' : 'Unfriend'}
          </button>
        </div>
      )}
    </div>
  );
};

export default FriendshipActions;