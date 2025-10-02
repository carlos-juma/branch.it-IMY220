import React, { useState, useEffect } from 'react';
import { authUtils, API_ENDPOINTS } from '../../utils/auth';

const FriendRequests = ({ onRequestChange }) => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState({});

  useEffect(() => {
    fetchFriendRequests();
  }, []);

  const fetchFriendRequests = async () => {
    try {
      setLoading(true);
      const requestsData = await authUtils.apiCall(API_ENDPOINTS.GET_FRIEND_REQUESTS);
      setRequests(requestsData || []);
    } catch (error) {
      console.error('Error fetching friend requests:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAcceptRequest = async (requestId) => {
    try {
      setActionLoading(prev => ({ ...prev, [requestId]: 'accepting' }));
      await authUtils.apiCall(API_ENDPOINTS.ACCEPT_FRIEND_REQUEST(requestId), {
        method: 'PUT'
      });
      
      // Remove the accepted request from the list
      setRequests(prev => prev.filter(req => req._id !== requestId));
      
      if (onRequestChange) {
        onRequestChange();
      }
    } catch (error) {
      alert('Failed to accept friend request: ' + error.message);
    } finally {
      setActionLoading(prev => ({ ...prev, [requestId]: null }));
    }
  };

  const handleDeclineRequest = async (requestId) => {
    try {
      setActionLoading(prev => ({ ...prev, [requestId]: 'declining' }));
      await authUtils.apiCall(API_ENDPOINTS.DECLINE_FRIEND_REQUEST(requestId), {
        method: 'DELETE'
      });
      
      // Remove the declined request from the list
      setRequests(prev => prev.filter(req => req._id !== requestId));
      
      if (onRequestChange) {
        onRequestChange();
      }
    } catch (error) {
      alert('Failed to decline friend request: ' + error.message);
    } finally {
      setActionLoading(prev => ({ ...prev, [requestId]: null }));
    }
  };

  if (loading) {
    return (
      <div className="bg-white p-4 rounded-xl shadow">
        <h3 className="text-lg font-semibold mb-3">Friend Requests</h3>
        <p className="text-gray-500">Loading requests...</p>
      </div>
    );
  }

  return (
    <div className="bg-white p-4 rounded-xl shadow">
      <h3 className="text-lg font-semibold mb-3">
        Friend Requests {requests.length > 0 && (
          <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full ml-2">
            {requests.length}
          </span>
        )}
      </h3>
      
      {requests.length > 0 ? (
        <div className="space-y-3">
          {requests.map((request) => (
            <div key={request._id} className="border rounded-lg p-3 flex items-center justify-between">
              <div className="flex items-center">
                <img
                  src={request.requesterId.avatar || '/assets/images/default-avatar.png'}
                  alt={request.requesterId.name}
                  className="w-10 h-10 rounded-full object-cover mr-3"
                />
                <div>
                  <p className="font-medium">{request.requesterId.name}</p>
                  <p className="text-sm text-gray-500">{request.requesterId.email}</p>
                  <p className="text-xs text-gray-400">
                    {new Date(request.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
              
              <div className="flex space-x-2">
                <button
                  onClick={() => handleAcceptRequest(request._id)}
                  disabled={actionLoading[request._id]}
                  className="bg-green-500 text-white px-3 py-1 rounded text-sm hover:bg-green-600 disabled:opacity-50"
                >
                  {actionLoading[request._id] === 'accepting' ? 'Accepting...' : 'Accept'}
                </button>
                <button
                  onClick={() => handleDeclineRequest(request._id)}
                  disabled={actionLoading[request._id]}
                  className="bg-red-500 text-white px-3 py-1 rounded text-sm hover:bg-red-600 disabled:opacity-50"
                >
                  {actionLoading[request._id] === 'declining' ? 'Declining...' : 'Decline'}
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-500">No pending friend requests.</p>
      )}
    </div>
  );
};

export default FriendRequests;