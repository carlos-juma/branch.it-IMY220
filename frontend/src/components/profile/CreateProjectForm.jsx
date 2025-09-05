import React, { useState } from "react";

const CreateProjectForm = () => {
  const [projectName, setProjectName] = useState("");
  const [description, setDescription] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    alert(`New project: ${projectName}, ${description}`);
    setProjectName("");
    setDescription("");
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-4 rounded-xl shadow">
      <h3 className="text-lg font-semibold mb-2">Create Project</h3>
      <input
        type="text"
        value={projectName}
        onChange={(e) => setProjectName(e.target.value)}
        className="w-full border p-2 rounded mb-2"
        placeholder="Project name"
      />
      <textarea
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        className="w-full border p-2 rounded mb-2"
        placeholder="Project description"
      />
      <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded">
        Create
      </button>
    </form>
  );
};

export default CreateProjectForm;
