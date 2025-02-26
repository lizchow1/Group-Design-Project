import React, { useState } from "react";
import BookmarkBorderOutlinedIcon from "@mui/icons-material/BookmarkBorderOutlined";
import BookmarkIcon from "@mui/icons-material/Bookmark";

const RecipeCard = ({ image, video, name, username, tags, small }) => {
  const [isBookmarked, setIsBookmarked] = useState(false);

  const handleBookmarkToggle = () => {
    setIsBookmarked((prev) => !prev);
  };

  return (
    <div className={`relative bg-white rounded-2xl shadow-lg border border-gray-200 ${small ? "w-[400px] min-w-[350px]" : "w-[500px] min-w-[400px]"} mx-auto bg-gray-100`}>
      <div className="relative overflow-hidden rounded-t-2xl">
        {video ? (
          <video src={video} className="w-full h-[300px] object-cover" controls />
        ) : (
          <img src={image} alt={name} className="w-full h-[300px] object-cover" />
        )}
      </div>

      <div className="p-6">
        <h3 className="text-2xl font-bold text-gray-800">{name}</h3>
        <p className="text-lg text-gray-500 mt-2">{username}</p>
        <div className="flex flex-wrap gap-2 mt-4">
          {tags.map((tag, index) => (
            <span
              key={index}
              className="bg-green-100 text-green-800 text-sm font-medium px-3 py-1 rounded-full"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>

      <button
        onClick={handleBookmarkToggle}
        className="absolute bottom-6 right-6 text-gray-600 hover:text-green-600 transition"
        style={{
          background: "none",
          border: "none",
          padding: 0,
          cursor: "pointer",
        }}
      >
        {isBookmarked ? (
          <BookmarkIcon fontSize="medium" />
        ) : (
          <BookmarkBorderOutlinedIcon fontSize="medium" />
        )}
      </button>
    </div>
  );
};

export default RecipeCard;
