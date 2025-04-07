import React, { useEffect, useState } from "react";

const SearchBar = ({ onSearch }) => {
  const [query, setQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState(query);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedQuery(query);
    }, 300); 

    return () => {
      clearTimeout(handler);
    };
  }, [query]);

  useEffect(() => {
    onSearch(debouncedQuery);
  }, [debouncedQuery]);

  const handleInputChange = (e) => {
    setQuery(e.target.value);
  };

  return (
    <div className="flex items-center space-x-2 mt-2">
      <input
        type="text"
        value={query}
        onChange={handleInputChange}
        placeholder="Search recipes..."
        className="border border-gray-300 rounded-md px-2 py-1 w-64"
      />
    </div>
  );
};

export default SearchBar;
