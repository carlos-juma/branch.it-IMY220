import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { authUtils, API_ENDPOINTS } from "../utils/auth";
import CollaborationManager from "../components/project/CollaborationManager";
import UserAvatar from "../components/UserAvatar";

const ProjectPage = () => {
  const { id } = useParams();
  const [project, setProject] = useState(null);
  const [files, setFiles] = useState([]);
  const [commits, setCommits] = useState([]);
  const [contributors, setContributors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedBranch, setSelectedBranch] = useState('main');
  const [showUploadForm, setShowUploadForm] = useState(false);
  const [uploadData, setUploadData] = useState({ filename: '', content: '' });
  const [showCollaborationManager, setShowCollaborationManager] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const navigate = useNavigate();

  const currentUser = authUtils.getUser();
  const isOwner = project && currentUser && (project.ownerId._id === currentUser.id || project.ownerId.id === currentUser.id);
  const isCollaborator = project && currentUser && project.collaborators && 
    project.collaborators.some(collab => collab._id === currentUser.id || collab.id === currentUser.id);
  const hasAccess = isOwner || isCollaborator;

  useEffect(() => {
    fetchProjectData();
  }, [id]);

  const fetchProjectData = async () => {
    try {
      setLoading(true);
      
      const projectData = await authUtils.apiCall(API_ENDPOINTS.GET_PROJECT(id));
      setProject(projectData);
      
      // Fetch project files
      const filesData = await authUtils.apiCall(API_ENDPOINTS.GET_FILES(id));
      setFiles(filesData || []);
      
      const commitsData = await authUtils.apiCall(API_ENDPOINTS.GET_COMMITS(id));
      setCommits(commitsData || []);
      
      const allContributors = new Map();
      
      if (projectData.ownerId) {
        allContributors.set(projectData.ownerId._id || projectData.ownerId.id, {
          ...projectData.ownerId,
          id: projectData.ownerId._id || projectData.ownerId.id,
          commits: commitsData.filter(c => c.authorId._id === projectData.ownerId._id || c.authorId.id === projectData.ownerId.id).length,
          role: 'Owner'
        });
      }
      
      // Add collaborators
      if (projectData.collaborators) {
        projectData.collaborators.forEach(collab => {
          const id = collab._id || collab.id;
          allContributors.set(id, {
            ...collab,
            id,
            commits: commitsData.filter(c => c.authorId._id === id || c.authorId.id === id).length,
            role: 'Collaborator'
          });
        });
      }
      
      // Add commit authors who might not be collaborators
      commitsData.forEach(commit => {
        const authorId = commit.authorId._id || commit.authorId.id;
        if (!allContributors.has(authorId)) {
          allContributors.set(authorId, {
            ...commit.authorId,
            id: authorId,
            commits: commitsData.filter(c => c.authorId._id === authorId || c.authorId.id === authorId).length,
            role: 'Contributor'
          });
        }
      });
      
      setContributors(Array.from(allContributors.values()));
      
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async (e) => {
    e.preventDefault();
    if (!uploadData.filename.trim() || !uploadData.content.trim()) return;

    try {
      await authUtils.apiCall(API_ENDPOINTS.UPLOAD_FILE(id), {
        method: 'POST',
        body: JSON.stringify({
          filename: uploadData.filename.trim(),
          content: uploadData.content.trim(),
          fileType: 'text',
          path: '/'
        })
      });

      setUploadData({ filename: '', content: '' });
      setShowUploadForm(false);
      fetchProjectData();
      alert('File uploaded successfully!');
    } catch (error) {
      alert('Failed to upload file: ' + error.message);
    }
  };

  const handleDeleteProject = async () => {
    try {
      setIsDeleting(true);
      await authUtils.apiCall(API_ENDPOINTS.DELETE_PROJECT(id), {
        method: 'DELETE'
      });
      
      alert('Project deleted successfully!');
      navigate('/projects'); // Navigate to projects page after deletion
    } catch (error) {
      alert('Failed to delete project: ' + error.message);
    } finally {
      setIsDeleting(false);
      setShowDeleteConfirm(false);
    }
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  };

  const getFileIcon = (filename) => {
    const ext = filename.split('.').pop()?.toLowerCase();
    const iconMap = {
      'js': '📄', 'jsx': '⚛️', 'ts': '🔷', 'tsx': '⚛️',
      'py': '🐍', 'java': '☕', 'cpp': '⚙️', 'c': '⚙️',
      'html': '🌐', 'css': '🎨', 'scss': '🎨',
      'json': '📋', 'xml': '📋', 'yml': '📋', 'yaml': '📋',
      'md': '📝', 'txt': '📄', 'pdf': '📕',
      'png': '🖼️', 'jpg': '🖼️', 'jpeg': '🖼️', 'gif': '🖼️', 'svg': '🖼️'
    };
    return iconMap[ext] || '📄';
  };

  const totalAdditions = commits.reduce((acc, commit) => acc + (commit.additions || Math.floor(Math.random() * 50) + 1), 0);
  const totalDeletions = commits.reduce((acc, commit) => acc + (commit.deletions || Math.floor(Math.random() * 20) + 1), 0);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center py-12">Loading project...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center text-red-600 py-12">Error: {error}</div>
        </div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center py-12">Project not found</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="bg-white rounded-lg border border-gray-200 mb-6">
          <div className="p-6 ">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">{project.name}</h1>
                {project.description && (
                  <p className="text-gray-600 mt-2">{project.description}</p>
                )}
                <div className="flex items-center space-x-4 mt-3">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    {project.type}
                  </span>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    {project.status}
                  </span>
                  {project.isPublic ? (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                       Public
                    </span>
                  ) : (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                       Private
                    </span>
                  )}
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <div className="relative">
                  <select 
                    value={selectedBranch}
                    onChange={(e) => setSelectedBranch(e.target.value)}
                    className="appearance-none bg-gray-50 border border-gray-300 rounded-md px-4 py-2 pr-8 text-sm font-medium text-gray-700 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="main"> Main Branch</option>
                    <option value="develop"> Develop</option>
                    <option value="feature"> Feature</option>
                  </select>
                  <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                    <svg className="h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>
                
                {hasAccess && (
                  <>
                    <button
                      onClick={() => setShowUploadForm(true)}
                      className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
                    >
                      + Add file
                    </button>
                    {isOwner && (
                      <>
                        <button
                          onClick={() => setShowCollaborationManager(true)}
                          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
                        >
                           Manage Team
                        </button>
                        <button
                          onClick={() => setShowDeleteConfirm(true)}
                          className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
                        >
                           Delete Project
                        </button>
                      </>
                    )}
                  </>
                )}
              </div>
            </div>
          </div>

          {showUploadForm && (
            <div className="p-6 bg-gray-50 border-t border-gray-200">
              <form onSubmit={handleFileUpload} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Filename</label>
                  <input
                    type="text"
                    value={uploadData.filename}
                    onChange={(e) => setUploadData(prev => ({ ...prev, filename: e.target.value }))}
                    placeholder="e.g., index.js"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Content</label>
                  <textarea
                    value={uploadData.content}
                    onChange={(e) => setUploadData(prev => ({ ...prev, content: e.target.value }))}
                    placeholder="File content..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    rows="6"
                    required
                  />
                </div>
                <div className="flex space-x-3">
                  <button
                    type="submit"
                    className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md text-sm font-medium"
                  >
                    Upload File
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowUploadForm(false);
                      setUploadData({ filename: '', content: '' });
                    }}
                    className="bg-gray-300 hover:bg-gray-400 text-gray-700 px-4 py-2 rounded-md text-sm font-medium"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-3">
            <div className="bg-white rounded-lg border border-gray-200">
              <div className="px-6 py-4">
                <h2 className="text-lg font-semibold text-gray-900">Project files</h2>
              </div>
              
              {files.length > 0 ? (
                <div className="divide-y divide-gray-200">
                  {files.map((file, index) => (
                    <div key={file._id || index} className="px-6 py-4 hover:bg-gray-50 transition-colors">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3 flex-1">
                          <span className="text-xl">{getFileIcon(file.filename)}</span>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-gray-900 truncate">
                              {file.filename}
                            </p>
                            {file.authorId && (
                              <p className="text-xs text-gray-500">
                                Last modified by {file.authorId.name} • {new Date(file.createdAt).toLocaleDateString()}
                              </p>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center space-x-4 text-sm text-gray-500">
                          <span>{formatFileSize(file.size || 0)}</span>
                          <button className="text-blue-600 hover:text-blue-800">View</button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="px-6 py-12 text-center">
                  <div className="text-4xl mb-4"></div>
                  <p className="text-gray-500">No files in this project yet.</p>
                  {hasAccess && (
                    <button
                      onClick={() => setShowUploadForm(true)}
                      className="mt-4 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium"
                    >
                      Add your first file
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>

          <div className="lg:col-span-1 space-y-6">
            {isOwner && (
              <CollaborationManager 
                project={project} 
                onCollaborationChange={fetchProjectData}
              />
            )}

            <div className="bg-white rounded-lg border border-gray-200">
              <div className="px-4 py-3">
                <h3 className="text-sm font-semibold text-gray-900">Contributors</h3>
              </div>
              <div className="p-4 space-y-3">
                {contributors.map((contributor) => (
                  <div key={contributor.id} className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <UserAvatar 
                        user={contributor}
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">{contributor.name}</p>
                        <p className="text-xs text-gray-500">{contributor.role}</p>
                      </div>
                    </div>
                    <span className="text-xs text-gray-400">{contributor.commits || 0} commits</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-lg border border-gray-200">
              <div className="p-4 space-y-4">
                <div className="flex items-center justify-center">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">+{totalAdditions}</div>
                    <div className="text-xs text-gray-500">Additions</div>
                  </div>
                </div>
                
                <div className="flex items-center justify-center">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-red-600">-{totalDeletions}</div>
                    <div className="text-xs text-gray-500">Deletions</div>
                  </div>
                </div>

                <div className="pt-4 border-t border-gray-200">
                  <div className="text-center space-y-2">
                    <div className="text-sm font-medium text-gray-900">{commits.length} commits</div>
                    <div className="text-sm font-medium text-gray-900">{files.length} files</div>
                    <div className="text-sm font-medium text-gray-900">{contributors.length} contributors</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <div className="flex items-center mb-4">
              <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center mr-3">
                <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.268 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900">Delete Project</h3>
            </div>
            
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete "<strong>{project?.name}</strong>"? This action cannot be undone. 
              All files, commits, and project data will be permanently removed.
            </p>
            
            <div className="flex space-x-3">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                disabled={isDeleting}
                className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium py-2 px-4 rounded-md transition-colors disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteProject}
                disabled={isDeleting}
                className="flex-1 bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-4 rounded-md transition-colors disabled:opacity-50 flex items-center justify-center"
              >
                {isDeleting ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Deleting...
                  </>
                ) : (
                  'Delete Project'
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProjectPage;
