import React from "react";
import { useParams } from "react-router-dom";

import Project from "../components/project/Project";
import Files from "../components/project/Files";
import Messages from "../components/project/Messages";
import EditProjectForm from "../components/project/EditProjectForm";

const ProjectPage = () => {
  const { id } = useParams();

  // Dummy project data
  const project = {
    id,
    name: "Version Control App",
    description: "A simple Git clone with React + Node.",
    type: "Web App",
    version: "1.0.0"
  };

  const files = ["index.js", "App.jsx", "server.js", "README.md"];

  const messages = [
    { user: "Jane", text: "Checked in new feature branch", date: "2025-09-01" },
    { user: "John", text: "Fixed bug in login", date: "2025-09-03" }
  ];

  return (
    <main className="p-6 max-w-4xl mx-auto space-y-6">
      <h1 className="text-3xl font-bold mb-4">Project {id}</h1>
      <Project project={project} />
      <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Files files={files} />
        <Messages messages={messages} />
      </section>
      <EditProjectForm project={project} />
    </main>
  );
};

export default ProjectPage;
