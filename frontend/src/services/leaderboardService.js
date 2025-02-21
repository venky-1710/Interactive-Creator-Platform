// src/services/leaderboardService.js
import api from './api';

export const getLeaderboard = async () => {
  try {
    const response = await api.get('/leaderboard/');
    return response.data;
  } catch (error) {
    throw new Error('Failed to fetch leaderboard');
  }
};