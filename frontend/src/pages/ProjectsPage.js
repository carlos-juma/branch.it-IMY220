import React, { useState, useEffect } from "react";
import ProjectPreview from "../components/project/ProjectPreview";
import { authUtils, API_ENDPOINTS } from "../utils/auth";

const ProjectsPage = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all'); // all, mine, public

  const currentUser = authUtils.getUser();

  useEffect(() => {
    fetchProjects();
  }, [filter]);

  const fetchProjects = async () => {
    try {
      setLoading(true);
      const data = await authUtils.apiCall(API_ENDPOINTS.GET_PROJECTS);
      
      let filteredProjects = data || [];
      
      if (filter === 'mine') {
        filteredProjects = data.filter(project => 
          project.ownerId._id === currentUser.id || 
          project.collaborators.some(collab => collab._id === currentUser.id)
        );
      } else if (filter === 'public') {
        filteredProjects = data.filter(project => project.isPublic);
      }
      
      setProjects(filteredProjects);
    } catch (error) {
      console.error('Error fetching projects:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <main className="p-6 max-w-6xl mx-auto">
        <div className="text-center">Loading projects...</div>
      </main>
    );
  }

  return (
    <main className="p-6 max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Projects</h1>
        
        {/* Filter buttons */}
        <div className="flex space-x-2">
          <button
            onClick={() => setFilter('all')}
            className={`px-4 py-2 rounded ${filter === 'all' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
          >
            All Projects
          </button>
          <button
            onClick={() => setFilter('mine')}
            className={`px-4 py-2 rounded ${filter === 'mine' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
          >
            My Projects
          </button>
          <button
            onClick={() => setFilter('public')}
            className={`px-4 py-2 rounded ${filter === 'public' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
          >
            Public Projects
          </button>
        </div>
      </div>

      {projects.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project) => (
            <ProjectPreview 
              key={project._id} 
              project={{
                ...project,
                id: project._id
              }} 
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">
            {filter === 'mine' ? 'You haven\'t created or joined any projects yet.' :
             filter === 'public' ? 'No public projects found.' :
             'No projects found.'}
          </p>
          {filter === 'mine' && (
            <a 
              href="/home" 
              className="inline-block mt-4 bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600"
            >
              Create Your First Project
            </a>
          )}
        </div>
      )}
    </main>
  );
};

export default ProjectsPage;