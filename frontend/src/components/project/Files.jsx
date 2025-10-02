import React, { useState } from "react";
import { authUtils, API_ENDPOINTS } from "../../utils/auth";

const Files = ({ files, projectId, onFilesChange }) => {
  const [showUploadForm, setShowUploadForm] = useState(false);
  const [filename, setFilename] = useState("");
  const [content, setContent] = useState("");
  const [uploading, setUploading] = useState(false);

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!filename.trim() || !content.trim()) return;

    try {
      setUploading(true);
      await authUtils.apiCall(API_ENDPOINTS.UPLOAD_FILE(projectId), {
        method: 'POST',
        body: JSON.stringify({
          filename: filename.trim(),
          content: content.trim(),
          fileType: 'text',
          path: '/'
        })
      });

      // Reset form
      setFilename("");
      setContent("");
      setShowUploadForm(false);
      
      // Refresh files list
      if (onFilesChange) {
        onFilesChange();
      }
      
      alert('File uploaded successfully!');
    } catch (error) {
      alert('Failed to upload file: ' + error.message);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="bg-white p-4 rounded-xl shadow">
      <div className="flex justify-between items-center mb-3">
        <h3 className="text-lg font-semibold">Files</h3>
        <button
          onClick={() => setShowUploadForm(!showUploadForm)}
          className="text-sm bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
        >
          {showUploadForm ? 'Cancel' : 'Add File'}
        </button>
      </div>

      {showUploadForm && (
        <form onSubmit={handleUpload} className="mb-4 p-3 bg-gray-50 rounded">
          <input
            type="text"
            value={filename}
            onChange={(e) => setFilename(e.target.value)}
            placeholder="Filename (e.g., index.js)"
            className="w-full p-2 border rounded mb-2"
            required
          />
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="File content..."
            className="w-full p-2 border rounded mb-2"
            rows="4"
            required
          />
          <button
            type="submit"
            disabled={uploading}
            className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600 disabled:opacity-50"
          >
            {uploading ? 'Uploading...' : 'Upload'}
          </button>
        </form>
      )}

      <ul className="space-y-2">
        {files && files.length > 0 ? (
          files.map((file, idx) => (
            <li key={file._id || idx} className="border-b pb-1 flex justify-between items-center">
              <div>
                <span className="font-medium">
                  {typeof file === 'string' ? file : file.filename}
                </span>
                {typeof file === 'object' && file.size && (
                  <span className="text-xs text-gray-400 ml-2">
                    ({file.size} bytes)
                  </span>
                )}
              </div>
              {typeof file === 'object' && (
                <span className="text-xs text-gray-400">
                  by {file.authorId?.name || 'Unknown'}
                </span>
              )}
            </li>
          ))
        ) : (
          <li className="text-gray-500">No files yet.</li>
        )}
      </ul>
    </div>
  );
};

export default Files;
