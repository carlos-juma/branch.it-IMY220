import React, { useState, useEffect } from "react";
import FriendRequests from "../components/profile/FriendRequests";
import { authUtils, API_ENDPOINTS } from "../utils/auth";

const NotificationsPage = () => {
  const [sentRequests, setSentRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSentRequests();
  }, []);

  const fetchSentRequests = async () => {
    try {
      setLoading(true);
      const sentData = await authUtils.apiCall(API_ENDPOINTS.GET_SENT_REQUESTS);
      setSentRequests(sentData || []);
    } catch (error) {
      console.error('Error fetching sent requests:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRequestChange = () => {
    // Refresh sent requests when friend requests change
    fetchSentRequests();
  };

  return (
    <main className="p-6 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Notifications</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Incoming Friend Requests */}
        <div>
          <FriendRequests onRequestChange={handleRequestChange} />
        </div>
        
        {/* Sent Friend Requests */}
        <div className="bg-white p-4 rounded-xl shadow">
          <h3 className="text-lg font-semibold mb-3">Sent Requests</h3>
          {loading ? (
            <p className="text-gray-500">Loading...</p>
          ) : sentRequests.length > 0 ? (
            <div className="space-y-3">
              {sentRequests.map((request) => (
                <div key={request._id} className="border rounded-lg p-3 flex items-center justify-between">
                  <div className="flex items-center">
                    <img
                      src={request.addresseeId.avatar || '/assets/images/default-avatar.png'}
                      alt={request.addresseeId.name}
                      className="w-10 h-10 rounded-full object-cover mr-3"
                    />
                    <div>
                      <p className="font-medium">{request.addresseeId.name}</p>
                      <p className="text-sm text-gray-500">{request.addresseeId.email}</p>
                      <p className="text-xs text-gray-400">
                        Sent {new Date(request.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  
                  <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded text-xs">
                    Pending
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500">No pending sent requests.</p>
          )}
        </div>
      </div>
    </main>
  );
};

export default NotificationsPage;