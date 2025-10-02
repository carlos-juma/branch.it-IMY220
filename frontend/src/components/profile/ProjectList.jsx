import React, { useState, useEffect } from "react";
import { authUtils, API_ENDPOINTS } from "../../utils/auth";
import { Link } from "react-router-dom";

const ProjectList = ({ userId, isOwnProfile }) => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchProjects();
  }, [userId]);

  const fetchProjects = async () => {
    try {
      setLoading(true);
      // Fetch all public projects for now - could be filtered by user later
      const data = await authUtils.apiCall(API_ENDPOINTS.GET_PROJECTS);
      
      // Filter projects by owner if viewing someone's profile
      const filteredProjects = userId ? 
        data.filter(project => project.ownerId._id === userId || project.ownerId.id === userId) : 
        data;
      
      setProjects(filteredProjects);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-white p-4 rounded-xl shadow">
        <h3 className="text-lg font-semibold mb-3">Projects</h3>
        <p className="text-gray-500">Loading projects...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white p-4 rounded-xl shadow">
        <h3 className="text-lg font-semibold mb-3">Projects</h3>
        <p className="text-red-500">Error loading projects: {error}</p>
      </div>
    );
  }

  return (
    <div className="bg-white p-4 rounded-xl shadow">
      <h3 className="text-lg font-semibold mb-3">Projects</h3>
      {projects.length > 0 ? (
        <ul>
          {projects.map((project) => (
            <li key={project._id} className="border-b py-2">
              <Link 
                to={`/project/${project._id}`}
                className="font-bold text-blue-600 hover:text-blue-800"
              >
                {project.name}
              </Link>
              <p className="text-sm text-gray-600">{project.description}</p>
              <p className="text-xs text-gray-400">
                Type: {project.type} | Status: {project.status}
              </p>
              {project.tags && project.tags.length > 0 && (
                <div className="mt-1">
                  {project.tags.map((tag, idx) => (
                    <span key={idx} className="inline-block bg-gray-200 text-xs px-2 py-1 rounded mr-1">
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-gray-500">
          {isOwnProfile ? "You haven't created any projects yet." : "No projects found."}
        </p>
      )}
    </div>
  );
};

export default ProjectList;
