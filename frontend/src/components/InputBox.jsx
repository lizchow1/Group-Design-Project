import React from 'react';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';

const InputBox = ({ input, setInput, sendMessage }) => {
  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault(); // Prevent page refresh
      sendMessage();
    }
  };

  return (
    <div className="mt-4 flex items-center bg-white p-3 shadow-lg rounded-lg">
      <Box
        component="form"
        sx={{ '& .MuiTextField-root': { m: 1, width: '23ch' } }}
        noValidate
        autoComplete="off"
        className="flex-1"
      >
        <TextField
          required
          id="outlined-required"
          label="Ask for a recipe"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          sx={{ width: '100%' }}
        />
      </Box>
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
