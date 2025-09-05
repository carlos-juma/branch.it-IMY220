import React, { useState } from "react";

const EditProjectForm = ({ project }) => {
  const [name, setName] = useState(project.name);
  const [desc, setDesc] = useState(project.description);

  const handleSubmit = (e) => {
    e.preventDefault();
    alert(`Project updated: ${name}, ${desc}`);
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-4 rounded-xl shadow">
      <h3 className="text-lg font-semibold mb-2">Edit Project</h3>
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="w-full border p-2 rounded mb-2"
        placeholder="Project name"
      />
      <textarea
        value={desc}
        onChange={(e) => setDesc(e.target.value)}
        className="w-full border p-2 rounded mb-2"
        placeholder="Description"
      />
      <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">
        Save
      </button>
    </form>
  );
};

export default EditProjectForm;
