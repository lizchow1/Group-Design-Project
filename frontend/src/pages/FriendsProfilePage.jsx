import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getFriends, getUserRecipes } from "../utils/api";
import RecipeCard from "../components/RecipeCard";

const FriendProfilePage = () => {
    const { friendId } = useParams();
    const [friend, setFriend] = useState(null);
    const [recipes, setRecipes] = useState([]);

    useEffect(() => {
        const fetchFriendData = async () => {
            const friendsList = await getFriends();
            const friendData = friendsList.find(f => f.username === friendId);
            if (friendData) {
                setFriend(friendData);
                const userRecipes = await getUserRecipes(friendData.username);
                setRecipes(userRecipes);
            }
        };
        fetchFriendData();
    }, [friendId]);

    if (!friend) return <p>Loading...</p>;

    return (
        <div className="relative montserrat-font flex flex-col items-center justify-start min-h-screen w-screen text-green-800 pl-24 pt-24">
            {friend?.image_url ? (
    <img
      src={friend.image_url}
      alt={`${friend.username} profile`}
      className="w-20 h-20 rounded-full object-cover"
    />
  ) : (
    <div className="w-20 h-20 rounded-full bg-black" />
  )}
            <h1 className="text-3xl font-bold mt-6 top-6 text-green-600 z-20 text-center mb-12">
                {friend.username}'s Profile
            </h1>

            <div className="flex flex-col items-center w-full max-w-7xl mt-16">
                <h2 className="text-xl font-semibold text-green-800 mb-6">Recipes</h2>
                {recipes.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
                    {recipes.map((recipe) => (
                        <RecipeCard 
                            key={recipe.id} 
                            image={recipe.image} 
                            name={recipe.name} 
                            username={friend.username} 
                            tags={recipe.tags || []} 
                            small={true} 
                            isBookmarked={recipe.isBookmarked} 
                            onToggleBookmark={() => {}} 
                            onFullDetailsClick={() => {}} 
                        />
                    ))}
                </div>
                ) : (
                    <p className="text-gray-500">No recipes yet.</p>
                )
                }
                
            </div>
        </div>
    );
};

export default FriendProfilePage;