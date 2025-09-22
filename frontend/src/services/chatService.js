// Chat Service for Real-time Messaging
import api from './api';

class ChatService {
  constructor() {
    this.pollingInterval = null;
    this.onMessageReceived = null;
    this.onUserStatusChange = null;
  }

  // Get all users for chat list
  async getUsers() {
    try {
      const response = await api.get('/chat/users');
      return response.data.users || response.data; // Handle both formats
    } catch (error) {
      console.error('Error fetching users:', error);
      throw error;
    }
  }

  // Get chat messages between current user and another user
  async getMessages(userId, page = 1, limit = 50) {
    if (!userId || userId === 'undefined') {
      console.error('Invalid userId provided to getMessages:', userId);
      throw new Error('Invalid user ID');
    }
    
    try {
      const response = await api.get(`/chat/messages/${userId}`, {
        params: { page, limit }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching messages:', error);
      throw error;
    }
  }

  // Send a message to another user
  async sendMessage(receiverId, content) {
    if (!receiverId || receiverId === 'undefined') {
      console.error('Invalid receiverId provided to sendMessage:', receiverId);
      throw new Error('Invalid receiver ID');
    }
    
    try {
      const response = await api.post('/chat/messages', {
        receiver_id: receiverId,
        content: content
      });
      return response.data;
    } catch (error) {
      console.error('Error sending message:', error);
      throw error;
    }
  }

  // Mark messages as read
  async markAsRead(userId) {
    if (!userId || userId === 'undefined') {
      console.error('Invalid userId provided to markAsRead:', userId);
      throw new Error('Invalid user ID');
    }
    
    try {
      const response = await api.put(`/chat/messages/read/${userId}`);
      return response.data;
    } catch (error) {
      console.error('Error marking messages as read:', error);
      throw error;
    }
  }

  // Get unread message count
  async getUnreadCount() {
    try {
      const response = await api.get('/chat/unread-count');
      return response.data;
    } catch (error) {
      console.error('Error fetching unread count:', error);
      throw error;
    }
  }

  // Get online users
  async getOnlineUsers() {
    try {
      const response = await api.get('/chat/online-users');
      return response.data;
    } catch (error) {
      console.error('Error fetching online users:', error);
      throw error;
    }
  }

  // Update user's online status
  async updateOnlineStatus(isOnline = true) {
    try {
      const response = await api.put('/chat/status', {
        is_online: isOnline,
        last_seen: new Date().toISOString()
      });
      return response.data;
    } catch (error) {
      console.error('Error updating online status:', error);
      throw error;
    }
  }

  // Start polling for new messages (fallback for real-time updates)
  startPolling(userId, callback) {
    this.stopPolling(); // Stop any existing polling
    
    if (!userId || !callback) return;
    
    this.onMessageReceived = callback;
    
    // Poll every 3 seconds for new messages
    this.pollingInterval = setInterval(async () => {
      try {
        const messages = await this.getMessages(userId, 1, 20);
        callback(messages);
      } catch (error) {
        console.error('Polling error:', error);
      }
    }, 3000);
  }

  // Stop polling
  stopPolling() {
    if (this.pollingInterval) {
      clearInterval(this.pollingInterval);
      this.pollingInterval = null;
    }
  }

  // Start status polling for online users
  startStatusPolling(callback) {
    if (!callback) return;
    
    this.onUserStatusChange = callback;
    
    // Poll every 30 seconds for user status
    this.statusPollingInterval = setInterval(async () => {
      try {
        const onlineUsers = await this.getOnlineUsers();
        callback(onlineUsers);
      } catch (error) {
        console.error('Status polling error:', error);
      }
    }, 30000);
  }

  // Stop status polling
  stopStatusPolling() {
    if (this.statusPollingInterval) {
      clearInterval(this.statusPollingInterval);
      this.statusPollingInterval = null;
    }
  }

  // Cleanup all polling
  cleanup() {
    this.stopPolling();
    this.stopStatusPolling();
  }

  // Local storage helpers for offline functionality
  getCachedMessages(userId) {
    try {
      const cacheKey = `chat_messages_${userId}`;
      const cached = localStorage.getItem(cacheKey);
      return cached ? JSON.parse(cached) : [];
    } catch (error) {
      console.error('Error reading cached messages:', error);
      return [];
    }
  }

  cacheMessages(userId, messages) {
    try {
      const cacheKey = `chat_messages_${userId}`;
      localStorage.setItem(cacheKey, JSON.stringify(messages));
    } catch (error) {
      console.error('Error caching messages:', error);
    }
  }

  clearCache(userId = null) {
    try {
      if (userId) {
        const cacheKey = `chat_messages_${userId}`;
        localStorage.removeItem(cacheKey);
      } else {
        // Clear all chat cache
        const keys = Object.keys(localStorage);
        keys.forEach(key => {
          if (key.startsWith('chat_messages_')) {
            localStorage.removeItem(key);
          }
        });
      }
    } catch (error) {
      console.error('Error clearing cache:', error);
    }
  }

  // Utility methods
  formatMessage(message) {
    return {
      id: message.id,
      senderId: message.sender_id,
      receiverId: message.receiver_id,
      content: message.content,
      timestamp: message.created_at,
      read: message.read_at !== null,
      senderName: message.sender_name,
      receiverName: message.receiver_name
    };
  }

  formatUser(user) {
    return {
      id: user.id,
      username: user.username,
      fullName: user.full_name,
      email: user.email,
      isOnline: user.is_online || false,
      lastSeen: user.last_seen,
      avatar: user.avatar || null
    };
  }

  // Generate avatar color based on username
  generateAvatarColor(username) {
    const colors = [
      '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', 
      '#FFEAA7', '#DDA0DD', '#98D8C8', '#F7DC6F',
      '#BB8FCE', '#85C1E9', '#82E0AA', '#F8C471'
    ];
    
    const hash = username.split('').reduce((a, b) => {
      a = ((a << 5) - a) + b.charCodeAt(0);
      return a & a;
    }, 0);
    
    return colors[Math.abs(hash) % colors.length];
  }

  // Get user initials for avatar
  getUserInitials(username, fullName = null) {
    const name = fullName || username;
    const names = name.trim().split(' ');
    
    if (names.length === 1) {
      return names[0].charAt(0).toUpperCase();
    } else {
      return (names[0].charAt(0) + names[names.length - 1].charAt(0)).toUpperCase();
    }
  }

  // Format time for display
  formatMessageTime(timestamp) {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now - date;
    const oneDay = 24 * 60 * 60 * 1000;
    const oneWeek = 7 * oneDay;

    if (diff < 60000) { // Less than 1 minute
      return 'Just now';
    } else if (diff < 3600000) { // Less than 1 hour
      const minutes = Math.floor(diff / 60000);
      return `${minutes}m ago`;
    } else if (diff < oneDay && date.toDateString() === now.toDateString()) { // Same day
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } else if (diff < oneWeek) { // Less than a week
      const days = Math.floor(diff / oneDay);
      return `${days}d ago`;
    } else {
      return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
    }
  }

  // Check if user is online (within last 5 minutes)
  isUserOnline(lastSeen) {
    if (!lastSeen) return false;
    const lastSeenDate = new Date(lastSeen);
    const now = new Date();
    const diff = now - lastSeenDate;
    return diff < 5 * 60 * 1000; // 5 minutes
  }
}

// Create singleton instance
const chatService = new ChatService();

export default chatService;