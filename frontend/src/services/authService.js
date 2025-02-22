// src/services/authService.js
import api from './api';

export const loginUser = async (username, password) => {
  try {
    // FastAPI expects form data for token endpoint
    const formData = new FormData();
    formData.append('username', username);
    formData.append('password', password);
    
    const response = await api.post('/token', formData, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    });
    
    const token = response.data.access_token;
    
    // Now get the user data
    const userResponse = await api.get('/users/me', {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    
    return {
      user: userResponse.data,
      token
    };
  } catch (error) {
    throw new Error(error.response?.data?.detail || 'Login failed');
  }
};

export const registerUser = async (userData) => {
  try {
    const response = await api.post('/users/', userData);
    const user = response.data;
    
    // After registration, we need to login
    const authResponse = await loginUser(userData.username, userData.password);
    return authResponse;
  } catch (error) {
    throw new Error(error.response?.data?.detail || 'Registration failed');
  }
};

export const getCurrentUser = async () => {
  try {
    const response = await api.get('/users/me');
    return response.data;
  } catch (error) {
    throw new Error('Failed to get current user');
  }
};

export const logoutUser = () => {
  // FastAPI uses token-based auth, so we just need to remove the token
  localStorage.removeItem('token'); // Remove the token from local storage
  // This function can be expanded to include server-side logout if needed
};
