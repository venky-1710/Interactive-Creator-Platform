import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../hooks/useAuth';
import chatService from '../services/chatService';
import './Chat.css';

const Chat = () => {
  const { user } = useAuth();
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [onlineUsers, setOnlineUsers] = useState(new Set());
  const [unreadCounts, setUnreadCounts] = useState({});
  const [hasNewMessages, setHasNewMessages] = useState(false);

  const [isTyping, setIsTyping] = useState(false);
  const [typingUsers, setTypingUsers] = useState(new Set());
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearch, setShowSearch] = useState(false);
  const [showScrollToBottom, setShowScrollToBottom] = useState(false);
  const [isUserScrolling, setIsUserScrolling] = useState(false);
  const [messageToDelete, setMessageToDelete] = useState(null);
  const [editingMessage, setEditingMessage] = useState(null);
  const [editText, setEditText] = useState('');
  const [replyingTo, setReplyingTo] = useState(null);
  const [messageReactions, setMessageReactions] = useState({});
  const [drafts, setDrafts] = useState({});
  const [uploadingFile, setUploadingFile] = useState(false);
  const [filePreview, setFilePreview] = useState(null);
  const [readReceipts, setReadReceipts] = useState({});
  const [messageThreads, setMessageThreads] = useState({});
  const [visibleRange, setVisibleRange] = useState({ start: 0, end: 50 });
  const VIRTUAL_ITEM_HEIGHT = 80; // Approximate height per message
  const messagesEndRef = useRef(null);
  const messagesContainerRef = useRef(null);
  const chatPollingRef = useRef(null);
  const statusPollingRef = useRef(null);
  const typingTimeoutRef = useRef(null);
  const lastMessageCount = useRef(0);
  const messageCache = useRef(new Map());
  const lastFetchTime = useRef(new Map());
  const isPollingActive = useRef(true);

  // Initialize chat and update user status
  useEffect(() => {
    initializeChat();
    updateUserStatus();
    
    // Cleanup on unmount
    return () => {
      chatService.cleanup();
      updateUserStatus(false);
    };
  }, []);

  // Set up message polling when a user is selected
  useEffect(() => {
    if (selectedUser) {
      fetchMessages();
      markMessagesAsRead(selectedUser.id);
      
      // Adaptive polling - slower when inactive, faster when active
      let pollInterval = 3000; // Default 3 seconds
      
      const adaptivePolling = () => {
        if (!document.hidden && isPollingActive.current) {
          const timeSinceLastFetch = Date.now() - (lastFetchTime.current.get(selectedUser.id) || 0);
          
          // If recent activity, poll more frequently
          if (timeSinceLastFetch < 30000) { // 30 seconds
            pollInterval = 2000; // 2 seconds
          } else if (timeSinceLastFetch < 300000) { // 5 minutes
            pollInterval = 5000; // 5 seconds
          } else {
            pollInterval = 10000; // 10 seconds for idle chats
          }
          
          fetchMessages(true);
        }
      };
      
      // Start adaptive polling
      chatPollingRef.current = setInterval(adaptivePolling, pollInterval);
      
      // Pause polling when tab is hidden
      const handleVisibilityChange = () => {
        isPollingActive.current = !document.hidden;
      };
      
      document.addEventListener('visibilitychange', handleVisibilityChange);
      
      return () => {
        if (chatPollingRef.current) {
          clearInterval(chatPollingRef.current);
          chatPollingRef.current = null;
        }
        document.removeEventListener('visibilitychange', handleVisibilityChange);
      };
    }

    return () => {
      if (chatPollingRef.current) {
        clearInterval(chatPollingRef.current);
        chatPollingRef.current = null;
      }
    };
  }, [selectedUser]);

  // Smart auto-scroll logic
  useEffect(() => {
    const currentMessageCount = messages.length;
    const previousCount = lastMessageCount.current;
    
    // Only auto-scroll if:
    // 1. User just sent a message (check if last message is from current user)
    // 2. User is already scrolled to bottom
    // 3. It's the initial load of messages
    if (currentMessageCount > previousCount) {
      const container = messagesContainerRef.current;
      if (container) {
        const isAtBottom = container.scrollHeight - container.scrollTop <= container.clientHeight + 50;
        const lastMessage = messages[messages.length - 1];
        const isCurrentUserMessage = lastMessage && String(lastMessage.senderId) === String(user.id);
        
        if (isCurrentUserMessage || isAtBottom || previousCount === 0) {
          scrollToBottom();
          setShowScrollToBottom(false);
        } else {
          setShowScrollToBottom(true);
        }
      }
    }
    
    lastMessageCount.current = currentMessageCount;
  }, [messages, user.id]);

  const initializeChat = async () => {
    try {
      await fetchUsers();
      await fetchOnlineUsers();
      
      // Start polling for online status updates
      statusPollingRef.current = setInterval(() => {
        // Only fetch if document is visible to reduce server load
        if (!document.hidden) {
          fetchOnlineUsers();
        }
      }, 30000);
    } catch (error) {
      console.error('Error initializing chat:', error);
    }
  };

  const updateUserStatus = async (isOnline = true) => {
    try {
      await chatService.updateOnlineStatus(isOnline);
    } catch (error) {
      console.error('Error updating user status:', error);
    }
  };

  const fetchUsers = async () => {
    try {
      const response = await chatService.getUsers();
      console.log('Fetched users:', response); // Keep this debug log for now
      
      // Validate user data
      const validUsers = response.filter(chatUser => {
        if (!chatUser.id) {
          console.warn('User missing ID:', chatUser);
          return false;
        }
        return true;
      });
      
      setUsers(validUsers);
      
      // Skip fetching unread counts initially to avoid the undefined error
      // We'll implement this later once basic messaging works
      const counts = {};
      validUsers.forEach(chatUser => {
        counts[chatUser.id] = 0;
      });
      setUnreadCounts(counts);
      
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const fetchOnlineUsers = async () => {
    try {
      const response = await chatService.getOnlineUsers();
      const onlineUserIds = new Set(response.online_users?.map(u => u.id) || []);
      setOnlineUsers(onlineUserIds);
    } catch (error) {
      console.error('Error fetching online users:', error);
    }
  };

  const fetchMessages = async (silent = false) => {
    if (!selectedUser || !selectedUser.id) {
      console.warn('No selected user or user ID is undefined');
      return;
    }
    
    // Check cache first for silent requests
    const cacheKey = selectedUser.id;
    const cachedMessages = messageCache.current.get(cacheKey);
    const lastFetch = lastFetchTime.current.get(cacheKey) || 0;
    const cacheAge = Date.now() - lastFetch;
    
    // Use cache if it's less than 10 seconds old and this is a silent request
    if (silent && cachedMessages && cacheAge < 10000) {
      return;
    }
    
    if (!silent) setLoading(true);
    
    try {
      const response = await chatService.getMessages(selectedUser.id);
      const fetchedMessages = response.messages || [];
      
      // Transform messages to match component format
      const transformedMessages = fetchedMessages.map(msg => ({
        id: msg.id,
        senderId: msg.sender_id,
        receiverId: msg.receiver_id,
        content: msg.content,
        timestamp: msg.created_at,
        read: !!msg.read_at,
        senderName: msg.sender_name,
        receiverName: msg.receiver_name
      }));
      
      // Update cache
      messageCache.current.set(cacheKey, transformedMessages);
      lastFetchTime.current.set(cacheKey, Date.now());
      
      // Check for new messages
      if (silent && transformedMessages.length > lastMessageCount.current) {
        setHasNewMessages(true);
        // Auto-clear new message indicator after 3 seconds
        setTimeout(() => setHasNewMessages(false), 3000);
      }
      
      setMessages(transformedMessages);
      
      // Update unread count for this user
      const unreadCount = transformedMessages.filter(
        msg => msg.receiverId === user.id && !msg.read
      ).length;
      
      setUnreadCounts(prev => ({
        ...prev,
        [selectedUser.id]: unreadCount
      }));
      
    } catch (error) {
      console.error('Error fetching messages:', error);
    } finally {
      if (!silent) setLoading(false);
    }
  };

  const markMessagesAsRead = async (userId) => {
    if (!userId) {
      console.warn('Cannot mark messages as read: userId is undefined');
      return;
    }
    
    try {
      await chatService.markAsRead(userId);
      // Update unread count
      setUnreadCounts(prev => ({
        ...prev,
        [userId]: 0
      }));
    } catch (error) {
      console.error('Error marking messages as read:', error);
    }
  };

  const sendMessage = async () => {
    if (!newMessage.trim() || !selectedUser || !selectedUser.id) {
      console.warn('Cannot send message: missing message content, selected user, or user ID');
      return;
    }

    const tempMessage = {
      id: 'temp_' + Date.now(),
      senderId: user.id,
      receiverId: selectedUser.id,
      content: newMessage.trim(),
      timestamp: new Date().toISOString(),
      read: false,
      senderName: user.username,
      receiverName: selectedUser.username,
      replyTo: replyingTo
    };

    // Optimistically add message to UI
    setMessages(prev => [...prev, tempMessage]);
    const messageContent = newMessage.trim();
    setNewMessage('');
    setReplyingTo(null);

    try {
      const response = await chatService.sendMessage(selectedUser.id, messageContent);
      
      // Replace temp message with real message
      setMessages(prev => 
        prev.map(msg => 
          msg.id === tempMessage.id 
            ? {
                id: response.id,
                senderId: response.sender_id,
                receiverId: response.receiver_id,
                content: response.content,
                timestamp: response.created_at,
                read: !!response.read_at,
                senderName: response.sender_name,
                receiverName: response.receiver_name
              }
            : msg
        )
      );
      
    } catch (error) {
      console.error('Error sending message:', error);
      // Remove temp message on error
      setMessages(prev => prev.filter(msg => msg.id !== tempMessage.id));
      // Restore message content
      setNewMessage(messageContent);
    }
  };

  const scrollToBottom = (behavior = 'smooth') => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior });
    }
  };

  const handleScroll = () => {
    const container = messagesContainerRef.current;
    if (container) {
      const isAtBottom = container.scrollHeight - container.scrollTop <= container.clientHeight + 50;
      setShowScrollToBottom(!isAtBottom);
      
      // Detect if user is manually scrolling
      if (!isAtBottom) {
        setIsUserScrolling(true);
        setTimeout(() => setIsUserScrolling(false), 1000);
      }
      
      // Virtualization - only render visible messages for large lists
      if (messages.length > 100) {
        const scrollTop = container.scrollTop;
        const containerHeight = container.clientHeight;
        const startIndex = Math.max(0, Math.floor(scrollTop / VIRTUAL_ITEM_HEIGHT) - 5);
        const endIndex = Math.min(
          messages.length - 1,
          startIndex + Math.ceil(containerHeight / VIRTUAL_ITEM_HEIGHT) + 10
        );
        
        setVisibleRange({ start: startIndex, end: endIndex });
      } else {
        setVisibleRange({ start: 0, end: messages.length - 1 });
      }
    }
  };

  const formatMessageTime = (timestamp) => {
    if (!timestamp) return 'Now';
    
    try {
      const date = new Date(timestamp);
      
      // Check if date is valid
      if (isNaN(date.getTime())) {
        return 'Now';
      }
      
      const now = new Date();
      const diffMs = now - date;
      const diffMins = Math.floor(diffMs / (1000 * 60));
      const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
      const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
      
      if (diffMins < 1) {
        return 'Just now';
      } else if (diffMins < 60) {
        return `${diffMins}m ago`;
      } else if (diffHours < 24) {
        return date.toLocaleTimeString([], { 
          hour: '2-digit', 
          minute: '2-digit',
          hour12: true 
        });
      } else if (diffDays < 7) {
        return `${diffDays}d ago`;
      } else {
        return date.toLocaleDateString([], { 
          month: 'short', 
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
        });
      }
    } catch (error) {
      console.error('Error formatting timestamp:', error);
      return 'Now';
    }
  };

  const getLastMessage = (userId) => {
    // Get last message from messages state if this user is selected
    if (selectedUser?.id === userId && messages.length > 0) {
      return messages[messages.length - 1];
    }
    
    // Otherwise try to get from cache
    const cachedMessages = chatService.getCachedMessages(userId);
    return cachedMessages.length > 0 ? cachedMessages[cachedMessages.length - 1] : null;
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const handleTyping = () => {
    if (!isTyping && selectedUser) {
      setIsTyping(true);
      // In a real implementation, you'd send typing status to server
      console.log('User started typing');
    }

    // Save draft
    if (selectedUser && newMessage.trim()) {
      setDrafts(prev => ({
        ...prev,
        [selectedUser.id]: newMessage
      }));
    }

    // Clear existing timeout
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    // Set new timeout to stop typing indicator
    typingTimeoutRef.current = setTimeout(() => {
      setIsTyping(false);
      console.log('User stopped typing');
    }, 1000);
  };

  // Load draft when user is selected
  const handleUserSelect = (chatUser) => {
    console.log('Selected user:', chatUser);
    
    if (!chatUser || !chatUser.id) {
      console.error('Invalid user selected:', chatUser);
      return;
    }
    
    // Save current draft before switching
    if (selectedUser && newMessage.trim()) {
      setDrafts(prev => ({
        ...prev,
        [selectedUser.id]: newMessage
      }));
    }
    
    setSelectedUser(chatUser);
    
    // Load draft for new user
    const draft = drafts[chatUser.id];
    setNewMessage(draft || '');
    
    // Mark messages as read when user is selected
    if (unreadCounts[chatUser.id] > 0) {
      markMessagesAsRead(chatUser.id);
    }
  };

  const generateAvatar = (username) => {
    return {
      backgroundColor: chatService.generateAvatarColor(username),
      initial: chatService.getUserInitials(username)
    };
  };

  const commonEmojis = ['😀', '😂', '❤️', '👍', '👎', '😢', '😮', '😡', '👏', '🎉', '🔥', '💯'];

  const handleEmojiClick = (emoji) => {
    setNewMessage(prev => prev + emoji);
    setShowEmojiPicker(false);
  };

  const handleMessageAction = (messageId, action, message) => {
    switch (action) {
      case 'reply':
        setReplyingTo(message);
        break;
      case 'edit':
        setEditingMessage(messageId);
        setEditText(message.content);
        break;
      case 'delete':
        setMessageToDelete(messageId);
        break;
      case 'react':
        handleReaction(messageId, '👍');
        break;
      default:
        console.log(`Action ${action} on message ${messageId}`);
    }
  };

  const handleReaction = (messageId, emoji) => {
    setMessageReactions(prev => ({
      ...prev,
      [messageId]: {
        ...prev[messageId],
        [emoji]: (prev[messageId]?.[emoji] || 0) + 1
      }
    }));
  };

  const confirmDeleteMessage = () => {
    if (messageToDelete) {
      setMessages(prev => prev.filter(msg => msg.id !== messageToDelete));
      setMessageToDelete(null);
      // In real implementation, call API to delete message
      console.log('Message deleted:', messageToDelete);
    }
  };

  const saveEditedMessage = () => {
    if (editingMessage && editText.trim()) {
      setMessages(prev => prev.map(msg => 
        msg.id === editingMessage 
          ? { ...msg, content: editText.trim(), edited: true }
          : msg
      ));
      setEditingMessage(null);
      setEditText('');
      // In real implementation, call API to update message
    }
  };

  const cancelReply = () => {
    setReplyingTo(null);
  };

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    // Validate file size (10MB limit)
    if (file.size > 10 * 1024 * 1024) {
      alert('File size must be less than 10MB');
      return;
    }

    setUploadingFile(true);
    
    try {
      // Create file preview
      const fileUrl = URL.createObjectURL(file);
      const preview = {
        name: file.name,
        size: file.size,
        type: file.type,
        url: fileUrl
      };
      
      setFilePreview(preview);
      
      // In real implementation, upload to server
      console.log('File selected for upload:', file);
      
      // For demo, just add file info to message
      const fileInfo = `📎 ${file.name} (${(file.size / 1024).toFixed(1)}KB)`;
      setNewMessage(prev => prev + (prev ? '\n' : '') + fileInfo);
      
    } catch (error) {
      console.error('Error handling file:', error);
      alert('Error processing file');
    } finally {
      setUploadingFile(false);
    }
  };

  const removeFilePreview = () => {
    if (filePreview) {
      URL.revokeObjectURL(filePreview.url);
      setFilePreview(null);
      // Remove file info from message
      setNewMessage(prev => {
        const lines = prev.split('\n');
        return lines.filter(line => !line.startsWith('📎')).join('\n');
      });
    }
  };

  const filteredMessages = searchQuery 
    ? messages.filter(msg => 
        msg.content.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : messages;



  return (
    <div className="chat-rt-container" role="application" aria-label="Chat application">
      {/* User List Sidebar */}
      <div className="chat-rt-sidebar" role="complementary" aria-label="User list">
        <div className="chat-rt-sidebar-header">
          <h3 id="chat-users-heading">Messages</h3>
          <div className="chat-rt-online-count" aria-live="polite">
            {onlineUsers.size} online
          </div>
        </div>
        
        <div 
          className="chat-rt-user-list" 
          role="list" 
          aria-labelledby="chat-users-heading"
        >
          {users.map(chatUser => {
            const avatar = generateAvatar(chatUser.username);
            const lastMessage = getLastMessage(chatUser.id);
            
            return (
              <div
                key={chatUser.id}
                className={`chat-rt-user-item ${selectedUser?.id === chatUser.id ? 'chat-rt-active' : ''} ${drafts[chatUser.id] ? 'chat-rt-has-draft' : ''}`}
                onClick={() => handleUserSelect(chatUser)}
                role="listitem"
                tabIndex={0}
                aria-label={`Chat with ${chatUser.full_name || chatUser.username}${onlineUsers.has(chatUser.id) ? ' (online)' : ' (offline)'}${unreadCounts[chatUser.id] ? `, ${unreadCounts[chatUser.id]} unread messages` : ''}`}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    handleUserSelect(chatUser);
                  }
                }}
              >
                <div className="chat-rt-user-avatar-container">
                  <div 
                    className="chat-rt-user-avatar"
                    style={{ backgroundColor: avatar.backgroundColor }}
                  >
                    {avatar.initial}
                  </div>
                  {onlineUsers.has(chatUser.id) && (
                    <div className="chat-rt-online-indicator"></div>
                  )}
                </div>
                
                <div className="chat-rt-user-info">
                  <div className="chat-rt-user-name">
                    {chatUser.full_name || chatUser.username}
                  </div>
                  <div className="chat-rt-last-message">
                    {lastMessage ? (
                      <span className={lastMessage.senderId === user.id ? 'chat-rt-sent' : ''}>
                        {lastMessage.senderId === user.id ? 'You: ' : ''}
                        {lastMessage.content.length > 30 
                          ? lastMessage.content.substring(0, 30) + '...' 
                          : lastMessage.content
                        }
                      </span>
                    ) : (
                      <span className="chat-rt-no-messages">No messages yet</span>
                    )}
                  </div>
                </div>
                
                <div className="chat-rt-user-meta">
                  {lastMessage && (
                    <div className="chat-rt-message-time">
                      {formatMessageTime(lastMessage.timestamp)}
                    </div>
                  )}
                  {(unreadCounts[chatUser.id] || 0) > 0 && (
                    <div className="chat-rt-unread-badge">
                      {unreadCounts[chatUser.id]}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Chat Area */}
      <div className="chat-rt-main" role="main" aria-label="Chat conversation">
        {selectedUser ? (
          <>
            {/* Chat Header */}
            <div className="chat-rt-header" role="banner">
              <div className="chat-rt-header-user">
                <div 
                  className="chat-rt-header-avatar"
                  style={{ backgroundColor: generateAvatar(selectedUser.username).backgroundColor }}
                  aria-hidden="true"
                >
                  {generateAvatar(selectedUser.username).initial}
                </div>
                <div className="chat-rt-header-info">
                  <h4 id="chat-partner-name">{selectedUser.full_name || selectedUser.username}</h4>
                  <span 
                    className={`chat-rt-status ${onlineUsers.has(selectedUser.id) ? 'chat-rt-online' : 'chat-rt-offline'}`}
                    aria-live="polite"
                  >
                    {onlineUsers.has(selectedUser.id) ? 'Online' : 'Offline'}
                  </span>
                </div>
              </div>
              <div className="chat-rt-header-actions">
                <button
                  onClick={() => setShowSearch(!showSearch)}
                  className="chat-rt-action-button"
                  title="Search messages"
                >
                  🔍
                </button>
              </div>
            </div>

            {showSearch && (
              <div className="chat-rt-search-bar">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search messages..."
                  className="chat-rt-search-input"
                />
              </div>
            )}

            {/* New Message Notification */}
            {hasNewMessages && (
              <div className="chat-rt-new-message-notification">
                💬 New messages received
              </div>
            )}

            {/* Messages Area */}
            <div 
              className="chat-rt-messages" 
              ref={messagesContainerRef}
              onScroll={handleScroll}
              role="log"
              aria-live="polite"
              aria-label="Chat messages"
              aria-describedby="chat-partner-name"
            >
              {showScrollToBottom && (
                <button
                  onClick={() => scrollToBottom()}
                  className="chat-rt-scroll-to-bottom"
                  aria-label="Scroll to bottom of messages"
                >
                  ↓
                  <span className="chat-rt-sr-only">Scroll to bottom</span>
                </button>
              )}
              {loading ? (
                <div className="chat-rt-loading">
                  <div className="chat-rt-spinner"></div>
                  <span>Loading messages...</span>
                </div>
              ) : messages.length === 0 ? (
                <div className="chat-rt-empty-state">
                  <div className="chat-rt-empty-icon">💬</div>
                  <h4>Start a conversation</h4>
                  <p>Send a message to {selectedUser.full_name || selectedUser.username} to begin chatting.</p>
                </div>
              ) : (
                <div className="chat-rt-message-list">
                  {searchQuery && (
                    <div className="chat-rt-search-results">
                      Found {filteredMessages.length} message{filteredMessages.length !== 1 ? 's' : ''}
                    </div>
                  )}
                  
                  {/* Virtualization container for large lists */}
                  {filteredMessages.length > 100 && (
                    <div 
                      style={{ 
                        height: visibleRange.start * VIRTUAL_ITEM_HEIGHT,
                        background: 'transparent'
                      }} 
                    />
                  )}
                  
                  {filteredMessages
                    .slice(
                      filteredMessages.length > 100 ? visibleRange.start : 0,
                      filteredMessages.length > 100 ? visibleRange.end + 1 : filteredMessages.length
                    )
                    .map((message, virtualIndex) => {
                    const index = filteredMessages.length > 100 ? visibleRange.start + virtualIndex : virtualIndex;
                    // Debug logging
                    if (index === 0) {
                      console.log('Sample message data:', message);
                      console.log('Current user:', user);
                    }
                    
                    // More robust user ID comparison
                    const messageSenderId = message.senderId || message.sender_id;
                    const currentUserId = user.id || user._id;
                    const isCurrentUser = String(messageSenderId) === String(currentUserId);
                    
                    const prevMessage = messages[index - 1];
                    const nextMessage = messages[index + 1];
                    
                    // Check if we need to show date separator
                    const messageDate = new Date(message.timestamp || message.created_at);
                    const prevMessageDate = prevMessage ? new Date(prevMessage.timestamp || prevMessage.created_at) : null;
                    const showDateSeparator = !prevMessageDate || 
                      messageDate.toDateString() !== prevMessageDate.toDateString();
                    
                    // Show sender name for all messages (both sent and received)
                    const prevMessageSenderId = prevMessage ? (prevMessage.senderId || prevMessage.sender_id) : null;
                    const nextMessageSenderId = nextMessage ? (nextMessage.senderId || nextMessage.sender_id) : null;
                    
                    const showSenderName = (
                      index === 0 || 
                      String(prevMessageSenderId) !== String(messageSenderId)
                    );
                    
                    const isConsecutive = prevMessage && String(prevMessageSenderId) === String(messageSenderId);
                    const isLastInGroup = !nextMessage || String(nextMessageSenderId) !== String(messageSenderId);
                    
                    return (
                      <React.Fragment key={message.id}>
                        {showDateSeparator && (
                          <div className="chat-rt-date-separator">
                            {messageDate.toLocaleDateString('en-US', { 
                              weekday: 'long', 
                              month: 'long', 
                              day: 'numeric', 
                              year: 'numeric' 
                            })}
                          </div>
                        )}
                        <div
                          className={`chat-rt-message ${isCurrentUser ? 'chat-rt-sent' : 'chat-rt-received'}${isConsecutive ? ' chat-rt-consecutive' : ''}${isLastInGroup ? ' chat-rt-last-in-group' : ''}`}
                        >
                          {showSenderName && (
                            <div className="chat-rt-sender-name">
                              {isCurrentUser ? 
                                'You' : 
                                (message.sender_name || message.senderName || selectedUser.full_name || selectedUser.username || 'Unknown User')
                              }
                            </div>
                          )}
                          
                          {/* Reply indicator */}
                          {message.replyTo && (
                            <div className="chat-rt-reply-context">
                              <div className="chat-rt-reply-line"></div>
                              <div className="chat-rt-reply-content">
                                <span className="chat-rt-reply-author">
                                  {message.replyTo.senderName}
                                </span>
                                <span className="chat-rt-reply-text">
                                  {message.replyTo.content.substring(0, 50)}
                                  {message.replyTo.content.length > 50 ? '...' : ''}
                                </span>
                              </div>
                            </div>
                          )}
                          
                          <div className="chat-rt-message-bubble">
                            <div className="chat-rt-message-content-wrapper">
                              {editingMessage === message.id ? (
                                <div className="chat-rt-edit-container">
                                  <textarea
                                    value={editText}
                                    onChange={(e) => setEditText(e.target.value)}
                                    className="chat-rt-edit-input"
                                    autoFocus
                                  />
                                  <div className="chat-rt-edit-actions">
                                    <button
                                      onClick={saveEditedMessage}
                                      className="chat-rt-edit-save"
                                    >
                                      Save
                                    </button>
                                    <button
                                      onClick={() => {
                                        setEditingMessage(null);
                                        setEditText('');
                                      }}
                                      className="chat-rt-edit-cancel"
                                    >
                                      Cancel
                                    </button>
                                  </div>
                                </div>
                              ) : (
                                <>
                                  <div className="chat-rt-message-content">
                                    {message.content}
                                    {message.edited && (
                                      <span className="chat-rt-edited-indicator">
                                        (edited)
                                      </span>
                                    )}
                                  </div>
                                  <div className="chat-rt-message-actions">
                                    <button
                                      onClick={() => handleMessageAction(message.id, 'react', message)}
                                      className="chat-rt-action-btn"
                                      title="React"
                                    >
                                      👍
                                    </button>
                                    <button
                                      onClick={() => handleMessageAction(message.id, 'reply', message)}
                                      className="chat-rt-action-btn"
                                      title="Reply"
                                    >
                                      ↩️
                                    </button>
                                    {isCurrentUser && (
                                      <>
                                        <button
                                          onClick={() => handleMessageAction(message.id, 'edit', message)}
                                          className="chat-rt-action-btn"
                                          title="Edit"
                                        >
                                          ✏️
                                        </button>
                                        <button
                                          onClick={() => handleMessageAction(message.id, 'delete', message)}
                                          className="chat-rt-action-btn"
                                          title="Delete"
                                        >
                                          🗑️
                                        </button>
                                      </>
                                    )}
                                  </div>
                                </>
                              )}
                            </div>
                            
                            {/* Message reactions */}
                            {messageReactions[message.id] && Object.keys(messageReactions[message.id]).length > 0 && (
                              <div className="chat-rt-message-reactions">
                                {Object.entries(messageReactions[message.id]).map(([emoji, count]) => (
                                  <button
                                    key={emoji}
                                    className="chat-rt-reaction-button"
                                    onClick={() => handleReaction(message.id, emoji)}
                                  >
                                    {emoji} {count}
                                  </button>
                                ))}
                              </div>
                            )}
                            
                            <div className="chat-rt-message-time">
                              {formatMessageTime(message.timestamp || message.created_at)}
                              {message.edited && (
                                <span className="chat-rt-message-edited">• edited</span>
                              )}
                              {isCurrentUser && (
                                <span className="chat-rt-message-status">
                                  {message.read ? '✓✓' : '✓'}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      </React.Fragment>
                    );
                  })}
                  
                  {/* Bottom spacer for virtualization */}
                  {filteredMessages.length > 100 && (
                    <div 
                      style={{ 
                        height: (filteredMessages.length - visibleRange.end - 1) * VIRTUAL_ITEM_HEIGHT,
                        background: 'transparent'
                      }} 
                    />
                  )}
                  
                  <div ref={messagesEndRef} />
                </div>
              )}
            </div>

            {/* Typing Indicator Area */}
            <div className="chat-rt-typing-area">
              {(typingUsers.size > 0 || isTyping) && (
                <div className="chat-rt-typing-indicator">
                  <div className="chat-rt-typing-avatar">
                    {selectedUser && (
                      <div 
                        className="chat-rt-typing-user-avatar"
                        style={{ backgroundColor: generateAvatar(selectedUser.username).backgroundColor }}
                      >
                        {generateAvatar(selectedUser.username).initial}
                      </div>
                    )}
                  </div>
                  <div className="chat-rt-typing-content">
                    <div className="chat-rt-typing-dots">
                      <span></span>
                      <span></span>
                      <span></span>
                    </div>
                    <span className="chat-rt-typing-text">
                      {typingUsers.size > 0 
                        ? `${Array.from(typingUsers).join(', ')} ${typingUsers.size === 1 ? 'is' : 'are'} typing...`
                        : `${selectedUser?.username || 'Someone'} is typing...`
                      }
                    </span>
                  </div>
                </div>
              )}
            </div>

            {/* Message Input */}
            <div className="chat-rt-input-area">
              {replyingTo && (
                <div className="chat-rt-reply-preview">
                  <div className="chat-rt-reply-header">
                    <span>Replying to {replyingTo.senderName || 'Unknown'}</span>
                    <button onClick={cancelReply} className="chat-rt-reply-close">
                      ✕
                    </button>
                  </div>
                  <div className="chat-rt-reply-message">
                    {replyingTo.content.substring(0, 100)}
                    {replyingTo.content.length > 100 ? '...' : ''}
                  </div>
                </div>
              )}
              
              {filePreview && (
                <div className="chat-rt-file-preview">
                  <div className="chat-rt-file-preview-content">
                    <div className="chat-rt-file-icon">
                      {filePreview.type.startsWith('image/') ? '🖼️' : 
                       filePreview.type.startsWith('video/') ? '🎥' : 
                       filePreview.type.includes('pdf') ? '📄' : '📁'}
                    </div>
                    <div className="chat-rt-file-info">
                      <div className="chat-rt-file-name">{filePreview.name}</div>
                      <div className="chat-rt-file-size">
                        {(filePreview.size / 1024).toFixed(1)} KB
                      </div>
                    </div>
                    <button 
                      onClick={removeFilePreview}
                      className="chat-rt-file-remove"
                      title="Remove file"
                    >
                      ✕
                    </button>
                  </div>
                  {filePreview.type.startsWith('image/') && (
                    <div className="chat-rt-image-preview">
                      <img 
                        src={filePreview.url} 
                        alt="Preview" 
                        style={{ maxWidth: '200px', maxHeight: '150px', borderRadius: '8px' }}
                      />
                    </div>
                  )}
                </div>
              )}
              {showEmojiPicker && (
                <div className="chat-rt-emoji-picker">
                  {commonEmojis.map(emoji => (
                    <button
                      key={emoji}
                      onClick={() => handleEmojiClick(emoji)}
                      className="chat-rt-emoji-button"
                    >
                      {emoji}
                    </button>
                  ))}
                </div>
              )}
              <div className="chat-rt-input-container">
                <input
                  type="file"
                  id="file-upload"
                  onChange={handleFileUpload}
                  style={{display: 'none'}}
                  accept="image/*,video/*,.pdf,.doc,.docx,.txt"
                  aria-label="Upload file"
                />
                <button
                  onClick={() => document.getElementById('file-upload').click()}
                  className="chat-rt-file-button"
                  type="button"
                  aria-label="Upload file"
                  disabled={uploadingFile}
                >
                  📎
                </button>
                <button
                  onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                  className="chat-rt-emoji-toggle"
                  type="button"
                  aria-label={showEmojiPicker ? "Close emoji picker" : "Open emoji picker"}
                  aria-expanded={showEmojiPicker}
                >
                  😀
                </button>
                <textarea
                  value={newMessage}
                  onChange={(e) => {
                    setNewMessage(e.target.value);
                    handleTyping();
                  }}
                  onKeyPress={handleKeyPress}
                  placeholder={`Message ${selectedUser.full_name || selectedUser.username}...`}
                  className="chat-rt-message-input"
                  rows="1"
                  aria-label={`Type a message to ${selectedUser.full_name || selectedUser.username}`}
                  aria-describedby={replyingTo ? "reply-preview" : undefined}
                />
                <button
                  onClick={sendMessage}
                  disabled={!newMessage.trim() && !filePreview}
                  className="chat-rt-send-button"
                  aria-label="Send message"
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <line x1="22" y1="2" x2="11" y2="13"></line>
                    <polygon points="22,2 15,21 11,13 3,9 22,2"></polygon>
                  </svg>
                </button>
              </div>
            </div>
          </>
        ) : (
          /* No User Selected */
          <div className="chat-rt-no-selection">
            <div className="chat-rt-welcome">
              <div className="chat-rt-welcome-icon">💬</div>
              <h3>Welcome to Chat</h3>
              <p>Select a user from the sidebar to start messaging</p>
            </div>
          </div>
        )}
      </div>

      {/* Confirmation Dialogs */}
      {messageToDelete && (
        <div className="chat-rt-modal-overlay">
          <div className="chat-rt-modal">
            <h3>Delete Message</h3>
            <p>Are you sure you want to delete this message? This action cannot be undone.</p>
            <div className="chat-rt-modal-actions">
              <button
                onClick={() => setMessageToDelete(null)}
                className="chat-rt-modal-cancel"
              >
                Cancel
              </button>
              <button
                onClick={confirmDeleteMessage}
                className="chat-rt-modal-confirm"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Chat;