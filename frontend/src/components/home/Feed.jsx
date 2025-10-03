import React, { useState, useEffect } from "react";
import ProjectPreview from "../project/ProjectPreview";
import UserAvatar from "../UserAvatar";
import { authUtils, API_ENDPOINTS } from "../../utils/auth";

const Feed = ({ projects }) => {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showProjects, setShowProjects] = useState(true);

  useEffect(() => {
    fetchActivityFeed();
  }, []);

  const fetchActivityFeed = async () => {
    try {
      setLoading(true);
      const activityData = await authUtils.apiCall(API_ENDPOINTS.GET_PERSONAL_FEED);
      setActivities(activityData || []);
    } catch (error) {
      console.error('Error fetching activity feed:', error);
      setActivities([]);
    } finally {
      setLoading(false);
    }
  };

  const renderActivityItem = (activity) => {
    switch (activity.type) {
      case 'commit':
        return (
          <div key={activity.data._id} className="p-4 bg-white shadow rounded-lg">
            <div className="flex items-center mb-2">
              <UserAvatar 
                user={activity.user} 
                className="mr-2"
              />
              <div>
                <span className="font-medium">{activity.user.name}</span>
                <span className="text-gray-500 text-sm ml-2">
                  committed to {activity.project.name}
                </span>
              </div>
            </div>
            <p className="text-gray-700">{activity.data.message}</p>
            <p className="text-xs text-gray-400 mt-1">
              {new Date(activity.timestamp).toLocaleString()}
            </p>
          </div>
        );
      case 'message':
        return (
          <div key={activity.data._id} className="p-4 bg-white shadow rounded-lg">
            <div className="flex items-center mb-2">
              <UserAvatar 
                user={activity.user} 
                className="mr-2"
              />
              <div>
                <span className="font-medium">{activity.user.name}</span>
                <span className="text-gray-500 text-sm ml-2">
                  in {activity.project.name}
                </span>
              </div>
            </div>
            <p className="text-gray-700">{activity.data.message}</p>
            <p className="text-xs text-gray-400 mt-1">
              {new Date(activity.timestamp).toLocaleString()}
            </p>
          </div>
        );
      default:
        return null;
    }
  };

  if (loading) {
    return (
      <div className="space-y-4">
        <p className="text-gray-500">Loading feed...</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex space-x-4 mb-4">
        <button
          onClick={() => setShowProjects(true)}
          className={`px-3 py-1 rounded ${showProjects ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
        >
          Projects
        </button>
        <button
          onClick={() => setShowProjects(false)}
          className={`px-3 py-1 rounded ${!showProjects ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
        >
          Activity Feed
        </button>
      </div>

      {showProjects ? (
        // Show projects
        projects && projects.length > 0 ? (
          projects.map((project) => (
            <ProjectPreview key={project._id || project.id} project={{
              ...project,
              id: project._id || project.id
            }} />
          ))
        ) : (
          <p className="text-gray-500">No projects found.</p>
        )
      ) : (
        // Show activity feed
        activities && activities.length > 0 ? (
          activities.map(renderActivityItem)
        ) : (
          <div className="p-4 bg-white shadow rounded-lg">
            <p className="text-gray-500">No recent activity. Start by creating a project or connecting with friends!</p>
          </div>
        )
      )}
    </div>
  );
};

export default Feed;
