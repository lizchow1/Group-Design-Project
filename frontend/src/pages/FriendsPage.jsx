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
        <div className="relative montserrat-font flex flex-col items-center justify-start min-h-screen w-screen text-green-800 pl-24 pt-24">
            <h1 className="text-3xl font-bold mt-6 top-6 text-green-600 z-20 text-center mb-12">
                Your Friends
            </h1>

            <div className="flex flex-col items-center w-full max-w-7xl mt-16">
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
