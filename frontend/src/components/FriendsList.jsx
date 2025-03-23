import React from 'react';

function FriendsList({ users = [] }) {
  if (users.length === 0) {
    return <p className="text-gray-500">No followers.</p>;
  }

  return (
    <div className="max-w-sm mx-auto p-4 bg-white shadow rounded">
      <h2 className="text-lg font-semibold mb-4">Your Followers</h2>

      <div className="space-y-3">
        {users.map((user) => (
          <div 
            key={user.id} 
            className="flex items-center space-x-3 border-b last:border-b-0 pb-2"
          >
            <img 
              src={user.avatar} 
              alt={user.username} 
              className="w-10 h-10 rounded-full object-cover"
            />
            <span className="text-gray-700">{user.username}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default FriendsList;
