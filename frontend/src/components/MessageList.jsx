import React, { useState, useEffect } from 'react';
import Message from "./Message";

const MessageList = ({ messages, chatEndRef }) => {
  const [height, setHeight] = useState('0px');
  const [opacity, setOpacity] = useState(0);

  useEffect(() => {
    if (messages.length > 0) {
      setHeight('500px');
      setOpacity(1);
    } else {
      setHeight('0px');
      setOpacity(0);
    }
  }, [messages]);

  return (
    <div
      className={`w-[700px] overflow-y-auto p-4 bg-white shadow-lg rounded-lg space-y-3 transition-all duration-700 ease-in-out`}
      style={{
        height,
        opacity,
      }}
    >
      {messages.map((msg, index) => (
        <Message key={index} sender={msg.sender} text={msg.text} />
      ))}
      <div ref={chatEndRef}></div>
    </div>
  );
};

export default MessageList;
