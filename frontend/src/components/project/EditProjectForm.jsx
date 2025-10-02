import React, { useState } from "react";
import { authUtils, API_ENDPOINTS } from "../../utils/auth";

const EditProjectForm = ({ project, onUpdate }) => {
  const [name, setName] = useState(project.name);
  const [description, setDescription] = useState(project.description);
  const [type, setType] = useState(project.type);
  const [tags, setTags] = useState(project.tags ? project.tags.join(', ') : '');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const tagsArray = tags.split(',').map(tag => tag.trim()).filter(tag => tag);
      
      const updatedProject = await authUtils.apiCall(API_ENDPOINTS.UPDATE_PROJECT(project._id || project.id), {
        method: 'PUT',
        body: JSON.stringify({
          name: name.trim(),
          description: description.trim(),
          type: type.trim(),
          tags: tagsArray
        })
      });

      if (onUpdate) {
        onUpdate(updatedProject);
      }

      alert('Project updated successfully!');
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-4 rounded-xl shadow">
      <h3 className="text-lg font-semibold mb-2">Edit Project</h3>
      
      {error && (
        <div className="mb-3 p-2 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
        </div>
      )}

      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
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
        placeholder="Project type"
        required
        disabled={isLoading}
      />
      
      <textarea
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        className="w-full border p-2 rounded mb-2"
        placeholder="Description"
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
      
      <button 
        type="submit" 
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
        disabled={isLoading}
      >
        {isLoading ? 'Saving...' : 'Save'}
      </button>
    </form>
  );
};

export default EditProjectForm;
