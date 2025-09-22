# Real-time Chat Component

A comprehensive real-time chat component for the Interactive Creator Platform that allows users to send and receive messages with profile integration and online status indicators.

## Features

✅ **Real-time Messaging** - Messages update automatically using polling (3-second intervals)
✅ **User Profiles** - Integration with user profiles including avatars and names
✅ **Online Status** - Shows which users are currently online
✅ **Unread Indicators** - Displays unread message counts
✅ **Responsive Design** - Works on desktop and mobile devices
✅ **Unique CSS Classes** - All classes prefixed with `chat-rt-` to avoid conflicts
✅ **Accessibility** - Keyboard navigation and screen reader support
✅ **Dark Mode** - Automatic dark mode support
✅ **Message History** - Persistent message storage
✅ **Typing Indicators** - Visual feedback for message sending

## Usage

### Basic Integration

```jsx
import React from 'react';
import Chat from '../components/Chat';

function ChatPage() {
  return (
    <div style={{ height: '100vh', padding: '20px' }}>
      <Chat />
    </div>
  );
}

export default ChatPage;
```

### Integration in Router

```jsx
import { Routes, Route } from 'react-router-dom';
import Chat from '../components/Chat';

function App() {
  return (
    <Routes>
      <Route path="/chat" element={<Chat />} />
      {/* Other routes */}
    </Routes>
  );
}
```

### As Modal/Popup

```jsx
import React, { useState } from 'react';
import Chat from '../components/Chat';

function ChatModal() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button onClick={() => setIsOpen(true)}>
        Open Chat
      </button>
      
      {isOpen && (
        <div className="modal-backdrop">
          <div className="modal-content" style={{ width: '80%', height: '80%' }}>
            <button onClick={() => setIsOpen(false)}>Close</button>
            <Chat />
          </div>
        </div>
      )}
    </>
  );
}
```

## API Endpoints

The chat component uses the following backend endpoints:

### User Management
- `GET /chat/users` - Get all users available for chat
- `GET /chat/online-users` - Get currently online users
- `PUT /chat/status` - Update user's online status

### Messaging
- `GET /chat/messages/{user_id}` - Get messages with a specific user
- `POST /chat/messages` - Send a new message
- `PUT /chat/messages/read/{user_id}` - Mark messages as read
- `GET /chat/unread-count` - Get total unread message count
- `GET /chat/conversations` - Get list of conversations

### Request/Response Examples

#### Send Message
```javascript
POST /chat/messages
{
  "receiver_id": "user_id_here",
  "content": "Hello, how are you?"
}

Response:
{
  "id": "message_id",
  "sender_id": "current_user_id",
  "receiver_id": "user_id_here",
  "content": "Hello, how are you?",
  "created_at": "2023-12-07T10:30:00Z",
  "read_at": null,
  "sender_name": "john_doe",
  "receiver_name": "jane_smith"
}
```

#### Get Messages
```javascript
GET /chat/messages/user_id_here?page=1&limit=50

Response:
{
  "messages": [
    {
      "id": "message_id",
      "sender_id": "user_id",
      "receiver_id": "other_user_id",
      "content": "Message content",
      "created_at": "2023-12-07T10:30:00Z",
      "read_at": "2023-12-07T10:35:00Z",
      "sender_name": "username",
      "receiver_name": "other_username"
    }
  ],
  "total": 25,
  "page": 1,
  "limit": 50
}
```

## Database Schema

### Messages Collection
```javascript
{
  "_id": ObjectId,
  "sender_id": ObjectId,
  "receiver_id": ObjectId,
  "content": String,
  "created_at": DateTime,
  "read_at": DateTime | null
}
```

### Users Collection (Extended)
```javascript
{
  "_id": ObjectId,
  "username": String,
  "email": String,
  "full_name": String,
  "last_seen": DateTime,
  // ... other user fields
}
```

## Styling

All CSS classes are prefixed with `chat-rt-` to avoid conflicts:

### Main Classes
- `.chat-rt-container` - Main chat container
- `.chat-rt-sidebar` - User list sidebar
- `.chat-rt-main` - Chat messages area
- `.chat-rt-user-item` - Individual user in the list
- `.chat-rt-message` - Individual message
- `.chat-rt-input-area` - Message input area

### Customization

You can override styles by targeting the specific classes:

```css
/* Custom theme colors */
.chat-rt-container {
  --primary-color: #your-brand-color;
  --background-color: #your-bg-color;
}

/* Custom message bubble colors */
.chat-rt-message.chat-rt-sent .chat-rt-message-content {
  background: var(--primary-color);
}

/* Custom avatar colors */
.chat-rt-user-avatar {
  border: 2px solid var(--primary-color);
}
```

## Real-time Updates

The component uses polling for real-time updates:

- **Message Polling**: Every 3 seconds when a chat is active
- **Status Polling**: Every 30 seconds for user online status
- **Automatic Cleanup**: Polling stops when component unmounts

### Upgrading to WebSockets

To upgrade to WebSockets for true real-time messaging:

1. Install Socket.IO:
```bash
npm install socket.io-client
```

2. Replace polling with WebSocket events in `chatService.js`
3. Update backend to support WebSocket connections

## Performance Optimizations

- **Message Caching**: Messages are cached locally
- **Pagination**: Messages are loaded in chunks
- **Optimistic Updates**: Messages appear immediately before server confirmation
- **Debounced Typing**: Input changes are debounced
- **Virtual Scrolling**: For large message histories (can be added)

## Accessibility Features

- **Keyboard Navigation**: Full keyboard support
- **Screen Reader Support**: Proper ARIA labels
- **Focus Management**: Logical tab order
- **High Contrast Mode**: Automatic adaptation
- **Reduced Motion**: Respects user preferences

## Mobile Responsiveness

- **Responsive Layout**: Adapts to mobile screens
- **Touch Friendly**: Large touch targets
- **Gesture Support**: Swipe gestures (can be enhanced)
- **Mobile Keyboard**: Proper input handling

## Security Considerations

- **Authentication**: All endpoints require authentication
- **Input Sanitization**: Messages are sanitized
- **Rate Limiting**: Should be implemented on backend
- **XSS Protection**: Content is properly escaped
- **Message Length Limits**: 1000 characters per message

## Error Handling

- **Network Errors**: Graceful degradation
- **Retry Logic**: Automatic retry for failed sends
- **Offline Support**: Basic offline caching
- **User Feedback**: Clear error messages

## Browser Support

- **Modern Browsers**: Chrome 80+, Firefox 75+, Safari 13+, Edge 80+
- **Mobile Browsers**: iOS Safari 13+, Chrome Mobile 80+
- **Polyfills**: Includes necessary polyfills

## Development Tips

### Testing Messages
1. Create multiple user accounts
2. Login with different browsers/incognito tabs
3. Send messages between accounts
4. Test online/offline status

### Debugging
- Check browser console for errors
- Monitor network requests in dev tools
- Use React DevTools for component state
- Check localStorage for cached messages

### Common Issues
1. **Messages not updating**: Check polling intervals
2. **Users not showing online**: Verify status endpoint
3. **CSS conflicts**: Ensure all classes use `chat-rt-` prefix
4. **Authentication errors**: Verify JWT tokens

## Future Enhancements

- [ ] **WebSocket Integration** - Replace polling with WebSockets
- [ ] **File Sharing** - Send images and documents
- [ ] **Message Reactions** - Like/emoji reactions
- [ ] **Group Chats** - Multi-user conversations
- [ ] **Message Search** - Search through chat history
- [ ] **Push Notifications** - Browser notifications
- [ ] **Voice Messages** - Audio message support
- [ ] **Video Calls** - Integrated video calling
- [ ] **Message Encryption** - End-to-end encryption
- [ ] **Chat Bots** - Automated responses

## License

This chat component is part of the Interactive Creator Platform and follows the same license terms.