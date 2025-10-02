// Authentication utilities for handling JWT tokens and API calls

export const authUtils = {
  // Get token from localStorage
  getToken: () => {
    return localStorage.getItem('authToken');
  },

  // Get user data from localStorage
  getUser: () => {
    const userData = localStorage.getItem('userData');
    return userData ? JSON.parse(userData) : null;
  },

  // Check if user is authenticated
  isAuthenticated: () => {
    return !!localStorage.getItem('authToken');
  },

  // Logout user
  logout: () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('userData');
    window.location.href = '/login';
  },

  // Make authenticated API request
  apiCall: async (url, options = {}) => {
    const token = authUtils.getToken();
    
    const defaultOptions = {
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
      },
      ...options,
    };

    try {
      const response = await fetch(url, defaultOptions);
      
      // If unauthorized, logout user
      if (response.status === 401) {
        authUtils.logout();
        return null;
      }

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'API request failed');
      }

      return data;
    } catch (error) {
      console.error('API call error:', error);
      throw error;
    }
  }
};

// API endpoints
export const API_ENDPOINTS = {
  // User endpoints
  LOGIN: '/api/users/login',
  REGISTER: '/api/users/register',
  GET_PROFILE: (id) => `/api/users/${id}`,
  UPDATE_PROFILE: (id) => `/api/users/${id}`,
  SEARCH_USERS: '/api/search/users',
  DELETE_ACCOUNT: (id) => `/api/users/${id}`,

  // Project endpoints
  GET_PROJECTS: '/api/projects',
  CREATE_PROJECT: '/api/projects',
  GET_PROJECT: (id) => `/api/projects/${id}`,
  UPDATE_PROJECT: (id) => `/api/projects/${id}`,
  DELETE_PROJECT: (id) => `/api/projects/${id}`,
  ADD_COLLABORATOR: (id) => `/api/projects/${id}/collaborators`,
  REMOVE_COLLABORATOR: (id, userId) => `/api/projects/${id}/collaborators/${userId}`,

  // File endpoints
  GET_FILES: (projectId) => `/api/projects/${projectId}/files`,
  UPLOAD_FILE: (projectId) => `/api/projects/${projectId}/files`,
  GET_FILE: (projectId, fileId) => `/api/projects/${projectId}/files/${fileId}`,
  UPDATE_FILE: (projectId, fileId) => `/api/projects/${projectId}/files/${fileId}`,
  DELETE_FILE: (projectId, fileId) => `/api/projects/${projectId}/files/${fileId}`,

  // Commit endpoints
  GET_COMMITS: (projectId) => `/api/projects/${projectId}/commits`,
  CREATE_COMMIT: (projectId) => `/api/projects/${projectId}/commits`,
  GET_COMMIT: (projectId, commitId) => `/api/projects/${projectId}/commits/${commitId}`,

  // Activity endpoints
  GET_PERSONAL_FEED: '/api/activity/feed',
  GET_GLOBAL_FEED: '/api/activity/global',
  GET_USER_ACTIVITY: (userId) => `/api/activity/user/${userId}`,
  CREATE_ACTIVITY: '/api/activity',

  // Friendship endpoints
  SEND_FRIEND_REQUEST: '/api/friendships/request',
  GET_FRIEND_REQUESTS: '/api/friendships/requests',
  GET_SENT_REQUESTS: '/api/friendships/requests/sent',
  ACCEPT_FRIEND_REQUEST: (requestId) => `/api/friendships/accept/${requestId}`,
  DECLINE_FRIEND_REQUEST: (requestId) => `/api/friendships/decline/${requestId}`,
  GET_FRIENDS: '/api/friendships',
  UNFRIEND: (friendId) => `/api/friendships/${friendId}`,
  GET_FRIENDSHIP_STATUS: (userId) => `/api/friendships/status/${userId}`,

  // Search endpoints
  SEARCH_PROJECTS: '/api/search/projects',
  SEARCH_COMMITS: '/api/search/commits',
  GLOBAL_SEARCH: '/api/search/all',
};