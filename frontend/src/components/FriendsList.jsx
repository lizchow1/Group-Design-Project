import React from "react";
import { Link } from "react-router-dom";

function FriendsList({ users = [] }) {
  if (users.length === 0) {
    return <p className="text-gray-500">No followers.</p>;
  }

  return (
    <div className="max-w-sm mx-auto p-4 bg-white shadow rounded">
      <div className="space-y-3">
        {users.map((user) => (
          <Link
            to={`/friends/${user.username}`}
            key={user.id}
            className="flex items-center gap-3 mb-4 hover:bg-gray-100 p-2 rounded transition"
          >
            {user.image_url ? (
              <img
                src={user.image_url}
                alt={user.username}
                className="w-10 h-10 rounded-full object-cover"
              />
            ) : (
              <div className="w-10 h-10 rounded-full bg-black" />
            )}
            <span className="text-green-800 font-medium">{user.username}</span>
          </Link>
        ))}
      </div>
    </div>
  );
}

export default FriendsList;
