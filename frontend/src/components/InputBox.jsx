import React from 'react';

const InputBox = ({ input, setInput, sendMessage }) => {
  return (
    <div className="mt-4 flex items-center bg-white p-3 shadow-lg rounded-lg">
      <input
        type="text"
        className="flex-1 p-2 border border-gray-300 rounded-lg focus:outline-none"
        placeholder="Ask for a recipe..."
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && sendMessage()}
      />
      <button
        onClick={sendMessage}
        className="ml-2 bg-blue-500 text-black px-4 py-2 rounded-lg hover:bg-blue-600 transition"
      >
        Send
      </button>
    </div>
  );
};

export default InputBox;
