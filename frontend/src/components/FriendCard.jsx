import React from "react";
import { Link } from "react-router-dom";

const FriendCard = ({ friend }) => {
  return (
    <Link
      to={`/friends/${friend.username}`}
      className="border-2 border-green-500 p-6 rounded-xl shadow-lg bg-white text-green-500 hover:bg-gray-100 transition flex flex-col items-center w-52 h-52"
    >
      {friend.image_url ? (
        <img
          src={friend.image_url}
          alt={friend.username}
          className="w-20 h-20 rounded-full object-cover mb-3"
        />
      ) : (
        <div className="w-16 h-16 rounded-full bg-black mb-2" />
      )}
      <p className="text-lg font-semibold text-green-600 text-center">{friend.username}</p>
    </Link>
  );
};

export default FriendCard;