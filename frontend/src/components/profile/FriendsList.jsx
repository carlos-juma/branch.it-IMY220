import React from "react";
import ProfilePreview from "./ProfilePreview";

const FriendsList = ({ friends }) => {
  return (
    <div className="bg-white p-4 rounded-xl shadow">
      <h3 className="text-lg font-semibold mb-3">Friends</h3>
      <div className="space-y-2">
        {friends && friends.length > 0 ? (
          friends.map((friend) => (
            <ProfilePreview 
              key={friend._id || friend.id} 
              user={{
                id: friend._id || friend.id,
                name: friend.name,
                email: friend.email,
                avatar: friend.avatar || '/assets/images/default-avatar.png'
              }} 
            />
          ))
        ) : (
          <p className="text-gray-500">No friends yet.</p>
        )}
      </div>
    </div>
  );
};

export default FriendsList;
