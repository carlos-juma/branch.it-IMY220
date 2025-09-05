import React from "react";

const Messages = ({ messages }) => {
  return (
    <div className="bg-white p-4 rounded-xl shadow">
      <h3 className="text-lg font-semibold mb-3">Activity</h3>
      <ul className="space-y-2">
        {messages.map((msg, idx) => (
          <li key={idx} className="border-b pb-1">
            <p><strong>{msg.user}</strong>: {msg.text}</p>
            <p className="text-xs text-gray-400">{msg.date}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Messages;