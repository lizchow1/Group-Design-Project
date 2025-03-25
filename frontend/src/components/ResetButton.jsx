import React from 'react';

const ResetButton = ({ onReset }) => {
  const handleReset = async () => {
    try {
      // Make a POST request to reset the chat context on the server
      await fetch("http://127.0.0.1:5000/reset", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });

      // Clear the stored recipe from localStorage
      localStorage.clear();

      // Call the parent onReset function to clear the local chat memory
      onReset();

      console.log("Chat and recipe storage reset successfully.");
    } catch (error) {
      console.error("Error resetting chat:", error);
    }
  };

  return (
    <button
      onClick={handleReset}
      className="mt-4 p-2 bg-red-500 text-black shadow-lg rounded-lg"
    >
      Reset Chat
    </button>
  );
};

export default ResetButton;
