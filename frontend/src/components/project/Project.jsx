import React from "react";

const Project = ({ project }) => {
  return (
    <div className="bg-white p-6 rounded-xl shadow">
      <h2 className="text-2xl font-bold mb-2">{project.name}</h2>
      <p className="text-gray-600 mb-2">{project.description}</p>
      <p className="text-sm text-gray-400">Type: {project.type}</p>
      <p className="text-sm text-gray-400">Version: {project.version}</p>
    </div>
  );
};

export default Project;
