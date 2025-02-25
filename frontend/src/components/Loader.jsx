import React from 'react';

const Loader = () => {
  return (
    <div className="flex justify-start">
      <div className="p-3 bg-gray-200 text-gray-900 rounded-lg shadow-lg animate-pulse">
        Cooking...
      </div>
    </div>
  );
};

export default Loader;
