import React from "react";
import { Link } from "react-router-dom";

const ProfilePreview = ({ user }) => {
  return (
    <div className="flex items-center bg-white p-3 rounded-lg shadow hover:shadow-md transition">
      {/* Avatar */}
      <img
        src={user.avatar}
        alt={user.name}
        className="w-12 h-12 rounded-full object-cover mr-4"
      />

      {/* Info */}
      <div>
        <Link
          to={`/profile/${user.id}`}
          className="font-semibold text-lg text-blue-600 hover:underline"
        >
          {user.name}
        </Link>
        {user.tagline && (
          <p className="text-sm text-gray-500">{user.tagline}</p>
        )}
      </div>
    </div>
  );
};

export default ProfilePreview;
