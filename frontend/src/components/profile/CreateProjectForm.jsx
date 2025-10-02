import React, { useState } from "react";
import { authUtils, API_ENDPOINTS } from "../../utils/auth";

const CreateProjectForm = ({ onProjectCreated }) => {
  const [projectName, setProjectName] = useState("");
  const [description, setDescription] = useState("");
  const [type, setType] = useState("");
  const [tags, setTags] = useState("");
  const [isPublic, setIsPublic] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const tagsArray = tags.split(',').map(tag => tag.trim()).filter(tag => tag);
      
      const project = await authUtils.apiCall(API_ENDPOINTS.CREATE_PROJECT, {
        method: 'POST',
        body: JSON.stringify({
          name: projectName.trim(),
          description: description.trim(),
          type: type.trim(),
          tags: tagsArray,
          isPublic
        })
      });

      // Reset form
      setProjectName("");
      setDescription("");
      setType("");
      setTags("");
      setIsPublic(true);

      alert('Project created successfully!');
      
      if (onProjectCreated) {
        onProjectCreated(project);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-4 rounded-xl shadow">
      <h3 className="text-lg font-semibold mb-2">Create Project</h3>
      
      {error && (
        <div className="mb-3 p-2 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
        </div>
      )}

      <input
        type="text"
        value={projectName}
        onChange={(e) => setProjectName(e.target.value)}
        className="w-full border p-2 rounded mb-2"
        placeholder="Project name"
        required
        disabled={isLoading}
      />
      
      <input
        type="text"
        value={type}
        onChange={(e) => setType(e.target.value)}
        className="w-full border p-2 rounded mb-2"
        placeholder="Project type (e.g., Web App, Mobile App)"
        required
        disabled={isLoading}
      />
      
      <textarea
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        className="w-full border p-2 rounded mb-2"
        placeholder="Project description"
        rows="3"
        disabled={isLoading}
      />
      
      <input
        type="text"
        value={tags}
        onChange={(e) => setTags(e.target.value)}
        className="w-full border p-2 rounded mb-2"
        placeholder="Tags (comma-separated)"
        disabled={isLoading}
      />
      
      <div className="mb-2">
        <label className="flex items-center">
          <input
            type="checkbox"
            checked={isPublic}
            onChange={(e) => setIsPublic(e.target.checked)}
            className="mr-2"
            disabled={isLoading}
          />
          Make project public
        </label>
      </div>
      
      <button 
        type="submit" 
        className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 disabled:opacity-50"
        disabled={isLoading}
      >
        {isLoading ? 'Creating...' : 'Create'}
      </button>
    </form>
  );
};

export default CreateProjectForm;
