// src/services/leaderboardService.js
import api from './api';

export const getLeaderboard = async (timeFilter = 'all-time') => {
  try {
    const params = timeFilter !== 'all-time' ? { period: timeFilter } : {};
    const response = await api.get('/leaderboard/', { params });
    return response.data;
  } catch (error) {
    throw new Error('Failed to fetch leaderboard');
  }
};

export const getUserStats = async (userId) => {
  try {
    const response = await api.get(`/users/${userId}/stats`);
    return response.data;
  } catch (error) {
    throw new Error('Failed to fetch user stats');
  }
};