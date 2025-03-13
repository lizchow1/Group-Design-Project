import React from 'react';
import ReactMarkdown from 'react-markdown';
import ErrorBoundary from './ErrorBoundary';
import '../MarkdownStyles.css';

const Message = ({ sender, text }) => {
  return (
    <div className={`flex ${sender === "User" ? "justify-end" : "justify-start"}`}>
      <div
        className={`p-3 max-w-xs md:max-w-md rounded-lg shadow-lg ${
          sender === "User" ? "bg-blue-500 text-white" : "bg-gray-200 text-gray-900"
        }`}
      >
        <strong>{sender}:</strong>
        <ErrorBoundary>
          <div className="markdown-content">
            <ReactMarkdown>{text}</ReactMarkdown>
          </div>
        </ErrorBoundary>
      </div>
    </div>
  );
};

export default Message;