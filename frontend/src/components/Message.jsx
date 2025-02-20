import React from 'react';

const Message = ({ sender, text }) => {
  return (
    <div className={`flex ${sender === "User" ? "justify-end" : "justify-start"}`}>
      <div
        className={`p-3 max-w-xs md:max-w-md rounded-lg shadow-sm ${
          sender === "User" ? "bg-blue-500 text-white" : "bg-gray-200 text-gray-900"
        }`}
      >
        <strong>{sender}:</strong> {text}
      </div>
    </div>
  );
};

export default Message;
