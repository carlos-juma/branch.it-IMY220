import React from "react";
import ProjectPreview from "../project/ProjectPreview";

const Feed = ({ projects }) => {
  return (
    <div className="space-y-4">
      {projects.map((project) => (
        <ProjectPreview key={project.id} project={project} />
      ))}
    </div>
  );
};

export default Feed;
