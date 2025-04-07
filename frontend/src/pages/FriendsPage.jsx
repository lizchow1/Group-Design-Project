import React, { useEffect, useState } from "react";
import { getFriends } from "../utils/api";
import FriendCard from "../components/FriendCard";

const FriendsPage = () => {
    const [friends, setFriends] = useState([]);

    useEffect(() => {
        const fetchFriends = async () => {
            const data = await getFriends();
            setFriends(data);
        };
        fetchFriends();
    }, []);

    return (
        <div className="relative montserrat-font flex flex-col items-center justify-start min-h-screen w-screen text-green-800 pl-32 pt-20">
        <div className="flex items-center gap-4 mt-6 mb-12">
          <h1 className="text-3xl font-bold text-green-600">Your Friends</h1>
        </div>
        <   div className="flex flex-col items-center w-full max-w-7xl mt-8">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full">
                    {friends.map(friend => (
                        <FriendCard key={friend.id || friend.username} friend={friend} />
                    ))}
                </div>
            </div>
        </div>
    );
};

export default FriendsPage;
