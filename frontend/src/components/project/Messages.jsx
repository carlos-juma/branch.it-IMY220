import React, { useState } from "react";
import { authUtils, API_ENDPOINTS } from "../../utils/auth";

const Messages = ({ messages, projectId }) => {
  const [newCommitMessage, setNewCommitMessage] = useState("");
  const [isCommitting, setIsCommitting] = useState(false);
  const [showCommitForm, setShowCommitForm] = useState(false);

  const handleCommit = async (e) => {
    e.preventDefault();
    if (!newCommitMessage.trim()) return;

    try {
      setIsCommitting(true);
      await authUtils.apiCall(API_ENDPOINTS.CREATE_COMMIT(projectId), {
        method: 'POST',
        body: JSON.stringify({
          message: newCommitMessage.trim(),
          branch: 'main',
          filesChanged: []
        })
      });

      setNewCommitMessage("");
      setShowCommitForm(false);
      alert('Commit created successfully!');
      // In a real app, you'd refresh the messages here
    } catch (error) {
      alert('Failed to create commit: ' + error.message);
    } finally {
      setIsCommitting(false);
    }
  };

  return (
    <div className="bg-white p-4 rounded-xl shadow">
      <div className="flex justify-between items-center mb-3">
        <h3 className="text-lg font-semibold">Activity</h3>
        <button
          onClick={() => setShowCommitForm(!showCommitForm)}
          className="text-sm bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600"
        >
          {showCommitForm ? 'Cancel' : 'New Commit'}
        </button>
      </div>

      {showCommitForm && (
        <form onSubmit={handleCommit} className="mb-4 p-3 bg-gray-50 rounded">
          <textarea
            value={newCommitMessage}
            onChange={(e) => setNewCommitMessage(e.target.value)}
            placeholder="Commit message..."
            className="w-full p-2 border rounded mb-2"
            rows="3"
            required
          />
          <button
            type="submit"
            disabled={isCommitting}
            className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600 disabled:opacity-50"
          >
            {isCommitting ? 'Committing...' : 'Commit'}
          </button>
        </form>
      )}

      <ul className="space-y-2">
        {messages && messages.length > 0 ? (
          messages.map((msg, idx) => (
            <li key={idx} className="border-b pb-1">
              <div className="flex items-center mb-1">
                <strong className="text-sm">{msg.user}</strong>
                {msg.type === 'commit' && (
                  <span className="ml-2 text-xs bg-green-100 text-green-800 px-2 py-0.5 rounded">
                    commit
                  </span>
                )}
              </div>
              <p className="text-sm text-gray-700">{msg.text}</p>
              <p className="text-xs text-gray-400">{msg.date}</p>
            </li>
          ))
        ) : (
          <li className="text-gray-500">No activity yet.</li>
        )}
      </ul>
    </div>
  );
};

export default Messages;