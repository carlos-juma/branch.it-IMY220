import React from "react";
import { Link } from "react-router-dom";

const ProjectPreview = ({ project }) => {
  return (
    <div className="p-4 bg-white shadow rounded-lg hover:shadow-md transition">
      <h3 className="text-xl font-semibold">
        <Link to={`/project/${project.id}`}>{project.name}</Link>
      </h3>
      <p className="text-gray-600">{project.description}</p>
      <p className="text-sm text-gray-400">Type: {project.type}</p>
    </div>
  );
};

export default ProjectPreview;
