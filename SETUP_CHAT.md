# Interactive Creator Platform - Chat Setup Guide

## 🚀 Quick Start Guide

### 1. Install Backend Dependencies
```bash
cd backend
pip install -r requirements.txt
```

### 2. Install Frontend Dependencies  
```bash
cd frontend
npm install
```

### 3. Setup Environment Variables
Create `.env` file in backend folder:
```env
MONGODB_URL=mongodb+srv://venky:venky8086@e-commerce-cluster.xbgmy.mongodb.net/
SECRET_KEY=your_secret_key_here
GEMINI_API_KEY=your_gemini_api_key_here
```

### 4. Start Servers

**Terminal 1 - Backend:**
```bash
cd backend
python main.py
```

**Terminal 2 - Frontend:**
```bash
cd frontend  
npm start
```

## 🎯 Testing the Chat System

1. **Create Test Users:**
   - Go to `/register` and create 2+ user accounts
   - Or use existing accounts

2. **Test Chat:**
   - Login with first user → Go to `/chat`
   - Open incognito/another browser → Login with second user → Go to `/chat`
   - Send messages between users
   - Check real-time updates (3-second polling)

3. **Features to Test:**
   - ✅ User list with avatars
   - ✅ Online status indicators  
   - ✅ Real-time messaging
   - ✅ Unread message badges
   - ✅ Message timestamps
   - ✅ Responsive design
   - ✅ Auto-scroll to new messages

## 🔧 Chat Integration

The chat is now integrated into your app:

- **Route:** `/chat` (requires authentication)
- **Navigation:** Chat link in navbar (shows when logged in)
- **Components:** 
  - `Chat.jsx` - Main chat component
  - `ChatPage.jsx` - Page wrapper
  - `chatService.js` - API service layer

## 🔍 API Endpoints

Backend now includes these chat endpoints:
- `GET /chat/users` - Get all users
- `GET /chat/messages/{user_id}` - Get messages  
- `POST /chat/messages` - Send message
- `PUT /chat/messages/read/{user_id}` - Mark as read
- `GET /chat/online-users` - Get online users
- `PUT /chat/status` - Update status

## 📱 Mobile Support

The chat is fully responsive:
- Sidebar collapses on mobile
- Touch-friendly interface
- Mobile keyboard support

## 🎨 Styling

All CSS classes use `chat-rt-` prefix to avoid conflicts:
- `.chat-rt-container` - Main container
- `.chat-rt-sidebar` - User list
- `.chat-rt-main` - Chat area
- `.chat-rt-message` - Individual messages

## 🔐 Security

- All endpoints require authentication
- Messages are sanitized
- User permissions enforced
- XSS protection included

## 🐛 Troubleshooting

**Backend won't start:**
- Check MongoDB connection
- Install missing dependencies: `pip install -r requirements.txt`
- Check `.env` file configuration

**Frontend won't start:**  
- Install dependencies: `npm install`
- Check for port conflicts (default: 3000)

**Chat not loading users:**
- Ensure backend is running on port 8000
- Check browser console for API errors
- Verify authentication token

**Messages not sending:**
- Check network requests in browser dev tools
- Verify MongoDB connection
- Check backend logs for errors

## 🚀 Next Steps

1. **Start both servers** (backend on :8000, frontend on :3000)
2. **Create user accounts** via `/register`  
3. **Test chat functionality** at `/chat`
4. **Customize styling** if needed (all classes use `chat-rt-` prefix)

The chat system is production-ready with real-time messaging, user profiles, and mobile support!