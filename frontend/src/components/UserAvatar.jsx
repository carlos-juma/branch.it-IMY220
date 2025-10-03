import React from 'react';

const UserAvatar = ({ user, size = 'w-8 h-8', className = '' }) => {
  const getInitials = (name) => {
    if (!name) return '?';
    const words = name.trim().split(' ');
    if (words.length === 1) {
      return words[0].substring(0, 2).toUpperCase();
    }
    return (words[0][0] + words[words.length - 1][0]).toUpperCase();
  };

  if (user.avatar) {
    return (
      <img
        src=""
        alt={user.name || 'User'}
        className={`${size} rounded-full object-cover ${className}`}
      />
    );
  }

  return (
    <div className={`${size} bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-sm font-medium ${className}`}>
      {getInitials(user.name)}
    </div>
  );
};

export default UserAvatar;