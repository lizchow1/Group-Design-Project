import React from "react";
import { Link } from "react-router-dom";

function FriendsList({ users = [], onUnfollow }) {
  if (users.length === 0) {
    return <p className="text-gray-500">You're not following anyone yet.</p>;
  }

  return (
    <div className="max-w-sm mx-auto p-4 bg-white shadow rounded">
      <div className="space-y-3">
        {users.map((user) => (
          <div
            key={user.id}
            className="flex items-center justify-between gap-3 mb-4 hover:bg-gray-100 p-2 rounded transition"
          >
            <Link to={`/friends/${user.username}`} className="flex items-center gap-3">
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
            <button
              onClick={() => onUnfollow(user.username)}
              className="bg-red-100 text-red-600 text-sm px-3 py-1 rounded hover:bg-red-200 transition"
            >
              Unfollow
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default FriendsList;
