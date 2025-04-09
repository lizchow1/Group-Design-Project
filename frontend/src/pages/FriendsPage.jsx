import React, { useEffect, useState } from "react";
import { getFollowing } from "../utils/api";
import { useUser } from "../contexts/UserContext";
import FriendCard from "../components/FriendCard";
import CircularProgress from "@mui/material/CircularProgress";

const FriendsPage = () => {
  const [friends, setFriends] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useUser();

  useEffect(() => {
    const fetchFriends = async () => {
      if (!user) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const response = await getFollowing(user.username);
        if (response && response.following) {
          setFriends(response.following);
        } else {
          setFriends([]);
        }
      } catch (err) {
        console.error("Failed to fetch following users:", err);
        setFriends([]);
      } finally {
        setLoading(false);
      }
    };

    fetchFriends();
  }, [user]);

  return (
    <div className="relative montserrat-font flex flex-col items-center justify-start min-h-screen w-screen text-green-800 pl-32 pt-20">
      <div className="flex items-center gap-4 mt-6 mb-12">
        <h1 className="text-3xl font-bold text-green-600">Your Friends</h1>
      </div>

      <div className="flex flex-col items-center w-full max-w-7xl mt-8">
        {loading ? (
          <div className="flex justify-center items-center w-full py-12">
            <CircularProgress color="success" />
          </div>
        ) : friends.length === 0 ? (
          <p className="text-gray-500">You’re not following anyone yet.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full">
            {friends.map((friend) => (
              <FriendCard key={friend.id || friend.username} friend={friend} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default FriendsPage;
