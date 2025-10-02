import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { authUtils, API_ENDPOINTS } from "../utils/auth";
import CollaborationManager from "../components/project/CollaborationManager";

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
          <div className="p-6 border-b border-gray-200">
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
                  <button
                    onClick={() => setShowUploadForm(true)}
                    className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
                  >
                    + Add file
                  </button>
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
          {/* Main Content - Files */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-lg border border-gray-200">
              <div className="px-6 py-4 border-b border-gray-200">
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
                  <div className="text-4xl mb-4">📁</div>
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

          {/* Sidebar - Contributors & Stats */}
          <div className="lg:col-span-1 space-y-6">
            {/* Collaboration Manager - Only for owners */}
            {isOwner && (
              <CollaborationManager 
                project={project} 
                onCollaborationChange={fetchProjectData}
              />
            )}

            {/* Contributors */}
            <div className="bg-white rounded-lg border border-gray-200">
              <div className="px-4 py-3 border-b border-gray-200">
                <h3 className="text-sm font-semibold text-gray-900">Contributors</h3>
              </div>
              <div className="p-4 space-y-3">
                {contributors.map((contributor) => (
                  <div key={contributor.id} className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-sm font-medium">
                        {contributor.name.charAt(0).toUpperCase()}
                      </div>
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

            {/* Project Statistics */}
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
    </div>
  );
};

export default ProjectPage;
