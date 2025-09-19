// src/services/adminService.js
import api from './api';

// User Management
export const getAllUsers = async (skip = 0, limit = 50) => {
  try {
    const response = await api.get(`/admin/users/?skip=${skip}&limit=${limit}`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.detail || 'Failed to fetch users');
  }
};

export const updateUserRole = async (userId, role) => {
  try {
    const response = await api.put(`/admin/users/${userId}/role`, { role });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.detail || 'Failed to update user role');
  }
};

export const updateUserStatus = async (userId, isActive) => {
  try {
    const response = await api.put(`/admin/users/${userId}/status`, { is_active: isActive });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.detail || 'Failed to update user status');
  }
};

export const deleteUser = async (userId) => {
  try {
    const response = await api.delete(`/admin/users/${userId}`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.detail || 'Failed to delete user');
  }
};

export const createUser = async (userData) => {
  try {
    const response = await api.post('/admin/users/create', userData);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.detail || 'Failed to create user');
  }
};

export const updateUser = async (userId, userData) => {
  try {
    const response = await api.put(`/admin/users/${userId}`, userData);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.detail || 'Failed to update user');
  }
};

// Challenge Management
export const getAllChallenges = async (skip = 0, limit = 50) => {
  try {
    const response = await api.get(`/admin/challenges/?skip=${skip}&limit=${limit}`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.detail || 'Failed to fetch challenges');
  }
};

export const updateChallenge = async (challengeId, challengeData) => {
  try {
    const response = await api.put(`/admin/challenges/${challengeId}`, challengeData);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.detail || 'Failed to update challenge');
  }
};

export const deleteChallenge = async (challengeId) => {
  try {
    const response = await api.delete(`/admin/challenges/${challengeId}`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.detail || 'Failed to delete challenge');
  }
};

export const createChallenge = async (challengeData) => {
  try {
    const response = await api.post('/admin/challenges/create', challengeData);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.detail || 'Failed to create challenge');
  }
};

// Submission Management
export const getAllSubmissions = async (skip = 0, limit = 100, challengeId = null, userId = null) => {
  try {
    let url = `/admin/submissions/?skip=${skip}&limit=${limit}`;
    if (challengeId) url += `&challenge_id=${challengeId}`;
    if (userId) url += `&user_id=${userId}`;
    
    const response = await api.get(url);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.detail || 'Failed to fetch submissions');
  }
};

// Platform Statistics
export const getPlatformStats = async () => {
  try {
    const response = await api.get('/admin/stats');
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.detail || 'Failed to fetch platform stats');
  }
};
