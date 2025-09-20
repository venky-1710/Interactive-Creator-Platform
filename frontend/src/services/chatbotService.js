// src/services/chatbotService.js
import api from './api';

const chatbotService = {
  // Send message to chatbot
  sendMessage: async (message, context = null) => {
    try {
      const response = await api.post('/chatbot', {
        message,
        context
      });
      return response.data;
    } catch (error) {
      console.error('Chatbot service error:', error);
      throw error;
    }
  },

  // Format message for display
  formatMessage: (text) => {
    // Basic text formatting
    return text
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') // Bold
      .replace(/\*(.*?)\*/g, '<em>$1</em>') // Italic
      .replace(/`(.*?)`/g, '<code>$1</code>') // Inline code
      .replace(/```([\s\S]*?)```/g, '<pre><code>$1</code></pre>'); // Code blocks
  },

  // Validate message before sending
  validateMessage: (message) => {
    if (!message || typeof message !== 'string') {
      throw new Error('Message must be a non-empty string');
    }
    
    if (message.trim().length === 0) {
      throw new Error('Message cannot be empty');
    }

    if (message.length > 2000) {
      throw new Error('Message is too long (max 2000 characters)');
    }

    return message.trim();
  },

  // Create message object
  createMessage: (text, sender = 'user', id = null) => {
    return {
      id: id || Date.now(),
      text: text,
      sender: sender,
      timestamp: new Date(),
      isError: false
    };
  },

  // Create error message
  createErrorMessage: (text, id = null) => {
    return {
      id: id || Date.now(),
      text: text,
      sender: 'bot',
      timestamp: new Date(),
      isError: true
    };
  },

  // Get welcome message
  getWelcomeMessage: () => {
    return {
      id: 1,
      text: "Hello! I'm your AI coding assistant. I can help you with:\n\n• Programming questions and debugging\n• Algorithm and data structure explanations\n• Code review and optimization tips\n• Learning resources and best practices\n• General coding concepts\n\nHow can I assist you today?",
      sender: 'bot',
      timestamp: new Date(),
      isError: false
    };
  },

  // Get quick suggestions for common questions
  getQuickSuggestions: () => {
    return [
      "How do I optimize this code?",
      "Explain this algorithm",
      "Help me debug this error",
      "Best practices for this language",
      "Code review suggestions"
    ];
  },

  // Check if user is authenticated
  isAuthenticated: () => {
    const token = localStorage.getItem('token');
    return token !== null && token !== undefined;
  },

  // Handle API errors
  handleError: (error) => {
    if (error.response) {
      // Server responded with error
      switch (error.response.status) {
        case 401:
          return "Please log in to use the chatbot.";
        case 403:
          return "You don't have permission to use the chatbot.";
        case 429:
          return "Too many requests. Please wait a moment and try again.";
        case 500:
          return "Server error. Please try again later.";
        default:
          return error.response.data?.detail || "An error occurred. Please try again.";
      }
    } else if (error.request) {
      // Request made but no response received
      return "Network error. Please check your connection and try again.";
    } else {
      // Something else happened
      return error.message || "An unexpected error occurred.";
    }
  }
};

export default chatbotService;