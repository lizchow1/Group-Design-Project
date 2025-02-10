import React from "react";
import RecipeCard from "../components/RecipeCard";

const Home = () => {
  return (
    <div className="flex items-center justify-center p-6 bg-gray-100 min-h-screen">
      <RecipeCard
        image="https://images.pexels.com/photos/1059905/pexels-photo-1059905.jpeg"
        name="Vegan Cobb Salad"
        username="chef123"
        tags={["15 mins", "vegan", "easy"]}
        isBookmarked={false}
        onBookmarkToggle={() => console.log("Toggled bookmark")}
      />
    </div>
  );
};

export default Home;
