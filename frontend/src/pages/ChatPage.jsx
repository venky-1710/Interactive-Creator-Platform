import React from 'react';
import Chat from '../components/Chat';

const ChatPage = () => {
  return (
    <div style={{ 
      height: '100vh', 
      background: '#f5f5f5',
      display: 'flex',
      flexDirection: 'column',
      overflow: 'hidden'
    }}>
      <div style={{ 
        flex: 1,
        maxWidth: '1200px',
        margin: '0 auto',
        width: '100%',
        height: '100%',
        overflow: 'hidden'
      }}>
        <Chat />
      </div>
    </div>
  );
};

export default ChatPage;