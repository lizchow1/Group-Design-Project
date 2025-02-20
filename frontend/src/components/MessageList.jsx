import React from 'react';

import Message from "./Message";

const MessageList = ({ messages, chatEndRef }) => {
  return (
    <div className="flex-1 overflow-y-auto p-4 bg-white shadow-md rounded-lg space-y-3">
      {messages.map((msg, index) => (
        <Message key={index} sender={msg.sender} text={msg.text} />
      ))}
      <div ref={chatEndRef}></div>
    </div>
  );
};

export default MessageList;
