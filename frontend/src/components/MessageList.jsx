import React from 'react';
import Message from "./Message";

const MessageList = ({ messages, chatEndRef }) => {
  return (
    <div className={`w-[400px] h-[500px] overflow-y-auto p-4 bg-white shadow-lg rounded-lg space-y-3 ${messages.length === 0 ? "hidden" : ""}`}>
      {messages.map((msg, index) => (
        <Message key={index} sender={msg.sender} text={msg.text} />
      ))}
      <div ref={chatEndRef}></div>
    </div>
  );
};

export default MessageList;
