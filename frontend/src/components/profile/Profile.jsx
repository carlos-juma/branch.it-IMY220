import React from "react";

const Profile = ({ user }) => {
  return (
    <div className="bg-white shadow-md rounded-xl p-6 flex items-center space-x-6">
      <img
        src={user.avatar}
        alt={user.name}
        className="w-24 h-24 rounded-full object-cover"
      />
      <div>
        <h2 className="text-2xl font-bold">{user.name}</h2>
        <p className="text-gray-600">{user.bio}</p>
        <p className="text-sm text-gray-500">{user.location}</p>
        <p className="text-sm text-gray-500">{user.email}</p>
      </div>
    </div>
  );
};

export default Profile;
