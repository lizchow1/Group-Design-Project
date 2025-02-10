import React from "react";

const RecipeCard = ({
  image,
  video,
  name,
  username,
  tags,
  isBookmarked,
  onBookmarkToggle,
}) => {
  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-200 w-80">
      <div className="relative overflow-hidden rounded-t-2xl">
        {video ? (
          <video
            src={video}
            className="w-full h-48 object-cover"
            controls
          />
        ) : (
          <img
            src={image}
            alt={name}
            className="w-full h-48 object-cover"
          />
        )}
        <button
          onClick={onBookmarkToggle}
          className="absolute top-4 right-4 bg-white bg-opacity-75 p-2 rounded-full shadow hover:bg-opacity-100 transition"
        >
          {isBookmarked ? "" : ""}
        </button>
      </div>
      
      <div className="p-4">
        <h3 className="text-xl font-bold text-gray-800">{name}</h3>
        <p className="text-sm text-gray-500 mt-1">
          {username}
        </p>
        <div className="flex flex-wrap gap-2 mt-3">
          {tags.map((tag, index) => (
            <span
              key={index}
              className="bg-green-100 text-green-800 text-xs font-medium px-2 py-1 rounded-full"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};

export default RecipeCard;
