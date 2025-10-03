import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import Profile from "../components/profile/Profile";
import EditProfileForm from "../components/profile/EditProfileForm";
import CreateProjectForm from "../components/profile/CreateProjectForm";
import FriendshipActions from "../components/profile/FriendshipActions";
import UserAvatar from "../components/UserAvatar";
import { authUtils, API_ENDPOINTS } from "../utils/auth";

const ProfilePage = () => {
  const { id } = useParams();
  const [user, setUser] = useState(null);
  const [friends, setFriends] = useState([]);
  const [projects, setProjects] = useState([]);
  const [stats, setStats] = useState({ commits: 0, projects: 0, collaborations: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('friends');
  const [showEditForm, setShowEditForm] = useState(false);
  
  const currentUser = authUtils.getUser();
  const isOwnProfile = currentUser && currentUser.id === id;

  useEffect(() => {
    fetchUserData();
  }, [id]);

  const fetchUserData = async () => {
    try {
      setLoading(true);
      
      const userData = await authUtils.apiCall(API_ENDPOINTS.GET_PROFILE(id));
      setUser(userData);

      const projectsData = await authUtils.apiCall(API_ENDPOINTS.GET_PROJECTS);
      const userProjects = projectsData.filter(project => 
        project.ownerId._id === id || project.ownerId.id === id
      );
      setProjects(userProjects);

      setStats({
        commits: userProjects.reduce((acc, project) => acc + (project.commits || 0), 0),
        projects: userProjects.length,
        collaborations: projectsData.filter(project => 
          project.collaborators && project.collaborators.some(collab => collab._id === id || collab.id === id)
        ).length
      });

      if (isOwnProfile) {
        const friendsData = await authUtils.apiCall(API_ENDPOINTS.GET_FRIENDS);
        setFriends(friendsData);
      }

    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleProfileUpdate = (updatedUser) => {
    setUser(updatedUser);
    setShowEditForm(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center py-12">Loading...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center text-red-600 py-12">Error: {error}</div>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center py-12">User not found</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <div className="max-w-6xl mx-auto px-6 py-8">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 mb-6">
          <div className="flex items-start justify-between">
            <div className="flex items-center space-x-6">
              <div className="relative">
                <div className="w-24 h-24 bg-blue-500 rounded-full flex items-center justify-center text-white text-4xl font-bold border-4 border-blue-200">
                  {user.name.charAt(0).toUpperCase()}
                </div>
                <div className="absolute -bottom-1 -right-1 w-8 h-8 bg-green-500 rounded-full border-4 border-white flex items-center justify-center">
                  <span className="text-white text-xs">✓</span>
                </div>
              </div>
              
              <div>
                <h1 className="text-3xl font-bold text-gray-900">{user.name}</h1>
                <p className="text-gray-600 text-lg">{user.email}</p>
                <div className="flex items-center space-x-4 mt-2 text-sm text-gray-500">
                  <span>⏰ Joined {new Date(user.createdAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</span>
                  <span>👥 {friends.length} Friends</span>
                </div>
                {user.bio && (
                  <p className="text-gray-700 mt-2 max-w-md">{user.bio}</p>
                )}
                <div className="mt-3">
                  <span className="inline-block w-3 h-3 bg-green-500 rounded-full"></span>
                </div>
              </div>
            </div>
            
            <div className="flex space-x-3">
              {isOwnProfile ? (
                <button 
                  onClick={() => setShowEditForm(!showEditForm)}
                  className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg font-medium transition-colors"
                >
                   EDIT PROFILE
                </button>
              ) : (
                <div className="space-y-2">
                  <FriendshipActions userId={id} onFriendshipChange={fetchUserData} />
                </div>
              )}
            </div>
          </div>
        </div>

        {showEditForm && isOwnProfile && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 mb-6">
            <EditProfileForm user={user} onUpdate={handleProfileUpdate} />
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Statistics</h2>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-orange-50 border border-orange-200 rounded-xl p-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center">
                      <span className="text-white font-bold">🔥</span>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-gray-900">{Math.max(1, stats.commits)}</div>
                      <div className="text-sm text-gray-600">Day streak</div>
                    </div>
                  </div>
                </div>
                
                <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-yellow-500 rounded-lg flex items-center justify-center">
                      <span className="text-white font-bold">⚡</span>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-gray-900">{stats.commits * 10 + 487}</div>
                      <div className="text-sm text-gray-600">Total XP</div>
                    </div>
                  </div>
                </div>
                
                <div className="bg-purple-50 border border-purple-200 rounded-xl p-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-purple-500 rounded-lg flex items-center justify-center">
                      <span className="text-white font-bold">👑</span>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-gray-900">{Math.max(1, stats.projects + friends.length)}</div>
                      <div className="text-sm text-gray-600">Total commits</div>
                    </div>
                  </div>
                </div>
                
                <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-amber-600 rounded-lg flex items-center justify-center">
                      <span className="text-white font-bold">🥉</span>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-gray-900">Developer</div>
                      <div className="text-sm text-gray-600">Current level</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Achievements</h2>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-gradient-to-r from-red-50 to-orange-50 border border-red-200 rounded-xl">
                  <div className="flex items-center space-x-4">
                    <div className="w-16 h-16 bg-gradient-to-br from-red-500 to-orange-500 rounded-xl flex items-center justify-center relative">
                      <span className="text-white text-2xl">🔥</span>
                      <div className="absolute -bottom-1 -right-1 bg-red-600 text-white text-xs px-1 rounded">
                        LVL 1
                      </div>
                    </div>
                    <div className="flex-1">
                      <h3 className="font-bold text-gray-900">Code Streak</h3>
                      <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                        <div className="bg-gradient-to-r from-red-500 to-orange-500 h-2 rounded-full" style={{width: `${Math.min(100, (stats.commits / 3) * 100)}%`}}></div>
                      </div>
                      <p className="text-sm text-gray-600 mt-1">Commit {Math.max(3 - stats.commits, 0)} more days in a row</p>
                    </div>
                  </div>
                  <span className="text-sm text-gray-500">{stats.commits}/3</span>
                </div>
                
                <div className="flex items-center justify-between p-4 bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-xl">
                  <div className="flex items-center space-x-4">
                    <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-500 rounded-xl flex items-center justify-center relative">
                      <span className="text-white text-2xl">🌟</span>
                      <div className="absolute -bottom-1 -right-1 bg-green-600 text-white text-xs px-1 rounded">
                        LVL 2
                      </div>
                    </div>
                    <div className="flex-1">
                      <h3 className="font-bold text-gray-900">Project Creator</h3>
                      <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                        <div className="bg-gradient-to-r from-green-500 to-emerald-500 h-2 rounded-full" style={{width: `${Math.min(100, (stats.projects / 5) * 100)}%`}}></div>
                      </div>
                      <p className="text-sm text-gray-600 mt-1">Create {Math.max(5 - stats.projects, 0)} more projects</p>
                    </div>
                  </div>
                  <span className="text-sm text-gray-500">{stats.projects}/5</span>
                </div>
              </div>
            </div>

            {isOwnProfile && (
              <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
                <CreateProjectForm onProjectCreated={fetchUserData} />
              </div>
            )}
          </div>

          <div className="space-y-6">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Friends</h2>
              
              <div className="flex border-b border-gray-200 mb-6">
                <button
                  onClick={() => setActiveTab('friends')}
                  className={`flex-1 py-2 px-4 text-center font-medium transition-colors ${
                    activeTab === 'friends'
                      ? 'border-b-2 border-blue-500 text-blue-600'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  FRIENDS
                </button>
                <button
                  onClick={() => setActiveTab('achievements')}
                  className={`flex-1 py-2 px-4 text-center font-medium transition-colors ${
                    activeTab === 'achievements'
                      ? 'border-b-2 border-blue-500 text-blue-600'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  ACHIEVEMENTS
                </button>
              </div>

              {activeTab === 'friends' && (
                <>
                  {friends.length > 0 ? (
                    <div className="space-y-3">
                      {friends.slice(0, 6).map((friend) => (
                        <div key={friend._id || friend.id} className="flex items-center space-x-3 p-2 hover:bg-gray-50 rounded-lg">
                          <UserAvatar 
                            user={friend}
                            size="w-10 h-10"
                          />
                          <div className="flex-1">
                            <a href={`/profile/${friend._id || friend.id}`} className="font-medium text-gray-900 hover:text-blue-600">
                              {friend.name}
                            </a>
                            <p className="text-sm text-gray-500">{friend.email}</p>
                          </div>
                        </div>
                      ))}
                      {friends.length > 6 && (
                        <div className="text-center py-2">
                          <span className="text-sm text-gray-500">+{friends.length - 6} more</span>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <div className="text-6xl mb-4">👥</div>
                      <p className="text-gray-600 mb-4">Learning is more fun and effective when you connect with others.</p>
                      <div className="space-y-2">
                        <button className="w-full flex items-center justify-between p-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors">
                          <div className="flex items-center space-x-3">
                            <span className="text-2xl">🔍</span>
                            <div className="text-left">
                              <div className="font-medium text-gray-900">Find friends</div>
                              <div className="text-sm text-gray-500">Search for other developers</div>
                            </div>
                          </div>
                          <span className="text-gray-400">›</span>
                        </button>
                        <button className="w-full flex items-center justify-between p-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors">
                          <div className="flex items-center space-x-3">
                            <span className="text-2xl">📧</span>
                            <div className="text-left">
                              <div className="font-medium text-gray-900">Invite friends</div>
                              <div className="text-sm text-gray-500">Share your profile</div>
                            </div>
                          </div>
                          <span className="text-gray-400">›</span>
                        </button>
                      </div>
                    </div>
                  )}
                </>
              )}

              {activeTab === 'achievements' && (
                <div className="text-center py-8">
                  <div className="text-6xl mb-4">🏆</div>
                  <p className="text-gray-600 mb-4">Achievements showcase your coding milestones and accomplishments.</p>
                  <div className="space-y-3">
                    <div className="flex items-center space-x-3 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                      <span className="text-2xl">🥇</span>
                      <div className="text-left flex-1">
                        <div className="font-medium text-gray-900">Project Creator</div>
                        <div className="text-sm text-gray-500">Created {stats.projects} projects</div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                      <span className="text-2xl">👥</span>
                      <div className="text-left flex-1">
                        <div className="font-medium text-gray-900">Team Player</div>
                        <div className="text-sm text-gray-500">Collaborated on {stats.collaborations} projects</div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3 p-3 bg-green-50 border border-green-200 rounded-lg">
                      <span className="text-2xl">💻</span>
                      <div className="text-left flex-1">
                        <div className="font-medium text-gray-900">Code Contributor</div>
                        <div className="text-sm text-gray-500">Made {stats.commits} commits</div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Projects</h2>
              {projects.length > 0 ? (
                <div className="space-y-3">
                  {projects.slice(0, 5).map((project) => (
                    <div key={project._id} className="p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                      <a href={`/project/${project._id}`} className="font-medium text-blue-600 hover:text-blue-800">
                        {project.name}
                      </a>
                      <p className="text-sm text-gray-600 mt-1">{project.description}</p>
                      <div className="flex items-center space-x-2 mt-2">
                        <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">{project.type}</span>
                        <span className="text-xs text-gray-500">{project.status}</span>
                      </div>
                    </div>
                  ))}
                  {projects.length > 5 && (
                    <div className="text-center py-2">
                      <a href="/projects" className="text-sm text-blue-600 hover:text-blue-800">View all projects</a>
                    </div>
                  )}
                </div>
              ) : (
                <p className="text-gray-500 text-center py-4">
                  {isOwnProfile ? "You haven't created any projects yet." : "No projects found."}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
