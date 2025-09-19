// src/utils/errorHandler.js
export const handleApiError = (error) => {
  console.error('API Error:', error);
  
  if (error.response) {
    // Server responded with error status
    const { status, data } = error.response;
    
    switch (status) {
      case 400:
        return data.detail || 'Bad request. Please check your input.';
      case 401:
        return 'Authentication failed. Please log in again.';
      case 403:
        return 'Access denied. You do not have permission for this action.';
      case 404:
        return 'Resource not found.';
      case 422:
        return data.detail || 'Invalid data provided.';
      case 500:
        return 'Server error. Please try again later.';
      default:
        return data.detail || `Request failed with status ${status}`;
    }
  } else if (error.request) {
    // Request made but no response received
    return 'Network error. Please check your connection and try again.';
  } else {
    // Something else happened
    return error.message || 'An unexpected error occurred.';
  }
};

export const showToast = (message, type = 'info') => {
  // This would integrate with your toast system
  console.log(`${type.toUpperCase()}: ${message}`);
  
  // You can implement actual toast notification here
  // For now, we'll just use browser notification as fallback
  if (typeof window !== 'undefined' && window.alert) {
    if (type === 'error') {
      alert(`Error: ${message}`);
    }
  }
};