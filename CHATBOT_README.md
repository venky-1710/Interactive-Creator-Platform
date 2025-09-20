# AI Chatbot Setup Guide

## Overview
The Interactive Creator Platform now includes an AI-powered chatbot using Google's Gemini API. The chatbot helps users with programming questions, debugging, algorithm explanations, and coding best practices.

## Features
- 🤖 **AI-Powered Assistance**: Powered by Google's Gemini Pro model
- 💬 **Real-time Chat**: Instant responses to coding questions
- 🎨 **Modern UI**: Beautiful, responsive chat interface
- 📱 **Mobile Friendly**: Optimized for all screen sizes
- 🔒 **Secure**: Requires user authentication
- ⚡ **Quick Suggestions**: Pre-defined prompts for common questions

## Setup Instructions

### Backend Setup

1. **Install Dependencies**
   ```bash
   cd backend
   pip install google-generativeai==0.3.2
   ```

2. **Get Gemini API Key**
   - Visit [Google AI Studio](https://makersuite.google.com/app/apikey)
   - Create a new API key
   - Copy the API key

3. **Configure Environment Variables**
   - Copy `.env.example` to `.env`
   - Add your Gemini API key:
   ```bash
   GEMINI_API_KEY=your_gemini_api_key_here
   ```

4. **Start the Backend Server**
   ```bash
   python main.py
   ```

### Frontend Setup

The chatbot component is already integrated into the main application. No additional setup required.

## Usage

### For Users
1. **Login**: You must be logged in to use the chatbot
2. **Access**: The chatbot appears as a floating widget on the bottom-right of the screen
3. **Chat**: Click to expand and start asking questions
4. **Quick Suggestions**: Use pre-defined prompts for common questions

### Chatbot Features
- **Minimize/Maximize**: Click the arrow button to toggle size
- **Clear Chat**: Click the trash button to start fresh
- **Status Indicator**: Shows online/offline status
- **Mobile Responsive**: Adapts to mobile screens automatically

### Example Questions
- "How do I optimize this Python code?"
- "Explain bubble sort algorithm"
- "What's the difference between == and === in JavaScript?"
- "Help me debug this error message"
- "Best practices for REST API design"

## API Endpoints

### POST /chatbot
Send a message to the AI chatbot.

**Request Body:**
```json
{
  "message": "Your question here",
  "context": "Optional context"
}
```

**Response:**
```json
{
  "response": "AI generated response",
  "error": null
}
```

**Authentication:** Required (Bearer token)

## Configuration

### Backend Configuration
The chatbot can be configured in `main.py`:

- **Model**: Uses `gemini-pro` model by default
- **Context**: Includes system prompt for coding assistance
- **Error Handling**: Comprehensive error handling and user feedback

### Frontend Configuration
The chatbot UI can be customized in `Chatbot.jsx` and `Chatbot.css`:

- **Position**: Bottom-right by default
- **Colors**: Matches platform theme
- **Animations**: Smooth transitions and loading states
- **Mobile**: Responsive design for all devices

## Security Considerations

1. **API Key Protection**: Store API key in environment variables
2. **Authentication Required**: Only authenticated users can access chatbot
3. **Input Validation**: Messages are validated before processing
4. **Rate Limiting**: Consider implementing rate limiting for production
5. **Content Filtering**: Gemini has built-in safety features

## Troubleshooting

### Common Issues

1. **"Chatbot unavailable"**
   - Check if GEMINI_API_KEY is set in environment variables
   - Verify API key is valid and has quota available

2. **"Please log in"**
   - User must be authenticated to use chatbot
   - Check if JWT token is valid

3. **Network errors**
   - Verify backend server is running
   - Check CORS configuration for frontend domain

4. **Mobile display issues**
   - Chatbot automatically adapts to mobile screens
   - Check CSS media queries if customizing

### Error Messages
- **"API key not configured"**: Add GEMINI_API_KEY to .env file
- **"Authentication failed"**: User needs to log in
- **"Rate limit exceeded"**: Too many requests, wait and retry
- **"Network error"**: Check internet connection and server status

## Development

### File Structure
```
backend/
├── main.py              # Main FastAPI app with chatbot endpoint
├── requirements.txt     # Python dependencies
└── .env                # Environment variables

frontend/src/
├── components/
│   ├── Chatbot.jsx     # Main chatbot component
│   └── Chatbot.css     # Chatbot styles
├── services/
│   └── chatbotService.js # Chatbot API service
└── App.js              # App integration
```

### Adding New Features
1. **Custom Prompts**: Modify system context in chatbot endpoint
2. **UI Enhancements**: Update Chatbot.jsx and Chatbot.css
3. **Additional Models**: Configure different Gemini models
4. **Analytics**: Add usage tracking and analytics

## Production Deployment

### Environment Variables
```bash
# Required for production
GEMINI_API_KEY=your_production_api_key
SECRET_KEY=strong_jwt_secret_key
MONGODB_URL=your_production_mongodb_url

# Optional optimizations
CORS_ORIGINS=https://yourdomain.com
DEBUG=False
```

### Performance Optimization
- Implement caching for common responses
- Add rate limiting to prevent abuse
- Monitor API usage and costs
- Consider using Gemini Pro Vision for image-related questions

### Monitoring
- Track chatbot usage and user satisfaction
- Monitor API response times and error rates
- Set up alerts for API quota limits
- Log important events and errors

## Support

For issues and questions:
1. Check this README for common solutions
2. Review server logs for error details
3. Test API key with Gemini API directly
4. Verify all environment variables are set correctly

## License

This chatbot implementation is part of the Interactive Creator Platform and follows the same license terms.