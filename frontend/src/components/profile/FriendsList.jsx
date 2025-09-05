import React from "react";
import ProfilePreview from "./ProfilePreview";

const FriendsList = ({ friends }) => {
  return (
    <div className="bg-white p-4 rounded-xl shadow">
      <h3 className="text-lg font-semibold mb-3">Friends</h3>
      <div className="space-y-2">
        {friends.map((friend) => (
          <ProfilePreview key={friend.id} user={friend} />
        ))}
      </div>
    </div>
  );
};

export default FriendsList;
