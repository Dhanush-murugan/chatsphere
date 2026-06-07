// API service for backend communication

import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests
api.interceptors.request.use(
  async (config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export const userService = {
  // Get user by username
  getUserByUsername: (username) =>
    api.get(`/users/search`, { params: { username } }),

  // Get user profile
  getUserProfile: (uid) => api.get(`/users/${uid}`),

  // Update user profile
  updateProfile: (uid, data) => api.put(`/users/${uid}`, data),

  // Check if username exists
  checkUsername: (username) =>
    api.get(`/users/check-username/${username}`),

  // Get list of users for search
  searchUsers: (query) => api.get(`/users/search`, { params: { q: query } }),
};

export const chatService = {
  // Create or get chat
  createChat: (participantIds) =>
    api.post('/chats', { participantIds }),

  // Get user's chats
  getUserChats: () => api.get('/chats'),

  // Get chat by ID
  getChat: (chatId) => api.get(`/chats/${chatId}`),

  // Delete chat
  deleteChat: (chatId) => api.delete(`/chats/${chatId}`),
};

export const messageService = {
  // Get messages for a chat (for pagination/history)
  getMessages: (chatId, limit = 50) =>
    api.get(`/messages/${chatId}`, { params: { limit } }),

  // Delete message
  deleteMessage: (chatId, messageId) =>
    api.delete(`/messages/${chatId}/${messageId}`),

  // React to message
  reactToMessage: (chatId, messageId, emoji) =>
    api.post(`/messages/${chatId}/${messageId}/react`, { emoji }),
};

export const mediaService = {
  // Get upload token for Firebase Storage
  getUploadToken: () => api.get('/media/upload-token'),
};

export const storyService = {
  // Create story
  createStory: (mediaUrl) => api.post('/stories', { mediaUrl }),

  // Get stories
  getStories: () => api.get('/stories'),

  // Delete story
  deleteStory: (storyId) => api.delete(`/stories/${storyId}`),

  // Mark story as viewed
  viewStory: (storyId) => api.post(`/stories/${storyId}/view`),
};

export default api;
