import React from "react";

const ProjectList = ({ projects }) => {
  return (
    <div className="bg-white p-4 rounded-xl shadow">
      <h3 className="text-lg font-semibold mb-3">Projects</h3>
      <ul>
        {projects.map((project) => (
          <li key={project.id} className="border-b py-2">
            <p className="font-bold">{project.name}</p>
            <p className="text-sm text-gray-600">{project.description}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ProjectList;
