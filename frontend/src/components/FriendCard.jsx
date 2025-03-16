import React from "react";
import { Link } from "react-router-dom";

const FriendCard = ({ friend }) => {
    return (
        <Link to={`/friends/${friend.username}`} className="border-2 border-green-500 p-4 rounded-lg shadow-lg text-center bg-white text-green-500 hover:bg-gray-100 transition w-40 h-20 flex items-center justify-center">
            <p className="text-lg text-green-500 font-semibold">{friend.username}</p>
        </Link>
    );
};

export default FriendCard;