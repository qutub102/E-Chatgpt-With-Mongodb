import React from 'react';
import Message from './Message';

const ChatWindow = ({ messages }) => {
    return (
      <div className="chat-window">
        {messages.map((message, index) => (
          <Message key={index} message={message} />
        ))}
      </div>
    );
  };
  
  export default ChatWindow;