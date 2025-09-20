import React, { useState, useRef, useEffect } from 'react';
import { Minimize2, Maximize2, Trash2 } from 'lucide-react';
import chatbotService from '../services/chatbotService';
import './Chatbot.css';

const Chatbot = () => {
  const [messages, setMessages] = useState([chatbotService.getWelcomeMessage()]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isMinimized, setIsMinimized] = useState(true);
  const [showSuggestions, setShowSuggestions] = useState(true);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessage = async (messageText = null) => {
    // Handle event objects from button clicks
    const actualMessageText = (typeof messageText === 'string') ? messageText : null;
    const messageToSend = actualMessageText || inputMessage;
    
    if (!messageToSend || !messageToSend.trim() || isLoading) return;

    try {
      // Validate message
      const validatedMessage = chatbotService.validateMessage(messageToSend);
      
      // Check authentication
      if (!chatbotService.isAuthenticated()) {
        const errorMessage = chatbotService.createErrorMessage(
          "Please log in to use the chatbot."
        );
        setMessages(prev => [...prev, errorMessage]);
        return;
      }

      // Hide suggestions after first message
      setShowSuggestions(false);

      // Create user message
      const userMessage = chatbotService.createMessage(validatedMessage, 'user');
      setMessages(prev => [...prev, userMessage]);
      setInputMessage('');
      setIsLoading(true);

      // Send message to API
      const response = await chatbotService.sendMessage(
        validatedMessage,
        "Interactive Creator Platform coding assistant"
      );

      if (response.response) {
        const botMessage = chatbotService.createMessage(response.response, 'bot', Date.now() + 1);
        setMessages(prev => [...prev, botMessage]);
      } else {
        throw new Error('No response received');
      }
    } catch (error) {
      console.error('Chatbot error:', error);
      const errorText = chatbotService.handleError(error);
      const errorMessage = chatbotService.createErrorMessage(errorText, Date.now() + 1);
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSuggestionClick = (suggestion) => {
    setInputMessage(suggestion);
    sendMessage(suggestion);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const clearChat = () => {
    setMessages([chatbotService.getWelcomeMessage()]);
    setShowSuggestions(true);
    setInputMessage('');
  };

  const formatTime = (timestamp) => {
    return timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const formatMessage = (text) => {
    // Simple formatting for code blocks
    return text.split('\n').map((line, index) => (
      <span key={index}>
        {line}
        {index < text.split('\n').length - 1 && <br />}
      </span>
    ));
  };

  return (
    <div className={`chatbot-container ${isMinimized ? 'minimized' : ''}`}>
      {isMinimized ? (
        // Minimized circular button
        <div 
          className="chatbot-minimized-button"
          onClick={() => setIsMinimized(false)}
          title="Open AI Coding Assistant"
        >
          <div className="chatbot-avatar">🤖</div>
        </div>
      ) : (
        // Full chatbot interface
        <>
          <div className="chatbot-header">
            <div className="chatbot-title">
              <div className="chatbot-avatar">🤖</div>
              <div>
                <span>AI Coding Assistant</span>
                <div className="chatbot-status">
                  <div className="status-dot"></div>
                  <span>Online</span>
                </div>
              </div>
            </div>
            <div className="chatbot-controls">
              <button 
                className="chatbot-control-btn clear-btn" 
                onClick={clearChat}
                title="Clear Chat"
              >
                <Trash2 size={20} />
              </button>
              <button 
                className="chatbot-control-btn minimize-btn" 
                onClick={() => setIsMinimized(!isMinimized)}
                title={isMinimized ? "Maximize" : "Minimize"}
              >
                {isMinimized ? <Maximize2 size={18} /> : <Minimize2 size={18} />}
              </button>
            </div>
          </div>

          <div className="chatbot-messages">
            {messages.map((message) => (
              <div 
                key={message.id} 
                className={`message ${message.sender} ${message.isError ? 'error' : ''}`}
              >
                <div className="message-content">
                  <div className="message-text">
                    {formatMessage(message.text)}
                  </div>
                  <div className="message-time">
                    {formatTime(message.timestamp)}
                  </div>
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="message bot">
                <div className="message-content">
                  <div className="message-text typing">
                    <div className="typing-indicator">
                      <span></span>
                      <span></span>
                      <span></span>
                    </div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Suggestions */}
          {showSuggestions && messages.length === 1 && !isLoading && (
            <div className="quick-suggestions">
              {chatbotService.getQuickSuggestions().map((suggestion, index) => (
                <button
                  key={index}
                  className="quick-suggestion"
                  onClick={() => handleSuggestionClick(suggestion)}
                >
                  {suggestion}
                </button>
              ))}
            </div>
          )}

          <div className="chatbot-input">
            <div className="input-container">
              <textarea
                ref={inputRef}
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Ask me anything about coding..."
                disabled={isLoading}
                rows="1"
              />
              <button 
                onClick={sendMessage} 
                disabled={!inputMessage.trim() || isLoading}
                className="send-button"
              >
                {isLoading ? '⏳' : '➤'}
              </button>
            </div>
            <div className="input-hint">
              Press Enter to send, Shift+Enter for new line
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Chatbot;