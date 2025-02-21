// src/services/challengeService.js
import api from './api';

export const getAllChallenges = async (filters = {}) => {
  try {
    const response = await api.get('/challenges', { params: filters });
    return response.data;
  } catch (error) {
    throw new Error('Failed to fetch challenges');
  }
};

export const getChallengeById = async (id) => {
  try {
    const response = await api.get(`/challenges/${id}`);
    return response.data;
  } catch (error) {
    throw new Error('Failed to fetch challenge details');
  }
};

export const submitChallenge = async (submissionData) => {
  try {
    const response = await api.post('/submissions/', submissionData);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.detail || 'Submission failed');
  }
};

export const getUserSubmissions = async () => {
  try {
    const response = await api.get('/submissions/');
    return response.data;
  } catch (error) {
    throw new Error('Failed to fetch submissions');
  }
};