import React, { useState } from "react";
import BookmarkBorderOutlinedIcon from "@mui/icons-material/BookmarkBorderOutlined";
import BookmarkIcon from "@mui/icons-material/Bookmark";
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import { useNavigate } from "react-router-dom";

const FlipRecipeCard = ({ 
  id,
  image, 
  video, 
  name, 
  username, 
  tags, 
  cooking_time, 
  ingredients, 
  description, 
  isBookmarked, 
  onToggleBookmark,
  onFollow,
  isFollowing
}) => {
  const [isFlipped, setIsFlipped] = useState(false);
  const navigate = useNavigate();
  const normalizedIngredients = typeof ingredients === 'string'
  ? ingredients.split(/\n|•|,/).map(item => item.trim()).filter(Boolean)
  : Array.isArray(ingredients)
    ? ingredients
    : [];

  const handleRecipeClick = (recipeID) => {
    navigate(`/app/${recipeID}`);
  };

  return (
    <div 
      style={{ perspective: "1000px" }}
      className="relative w-[500px] min-w-[400px] h-[475px] mx-auto cursor-pointer"
      onClick={() => setIsFlipped(!isFlipped)}
    >
      <div 
        className="relative w-full h-full transition-transform duration-500"
        style={{
          transformStyle: "preserve-3d",
          transform: isFlipped ? "rotateY(180deg)" : "none",
        }}
      >

        <div 
          className="absolute w-full h-full rounded-2xl shadow-lg border border-gray-200 bg-white"
          style={{ backfaceVisibility: "hidden" }}
        >
          <div className="relative overflow-hidden rounded-t-2xl">
          {image.startsWith("data:video") ? (
          <video 
            controls 
            className="w-full h-[300px] object-cover cursor-pointer"
          >
            <source src={image} type="video/mp4"  />
            Your browser does not support the video tag.
          </video>
        ) : (
          <img src={image} alt={name} className="w-full h-[300px] object-cover cursor-pointer" />
        )}
          </div>

          <div className="flex flex-col gap-2 p-3">
            <h3 className="text-2xl font-bold text-gray-800">{name}</h3>

            <div className="flex flex-wrap items-center gap-2">
              <p className="text-lg text-gray-500">{username}</p>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onFollow(username);
                }}
                className={`text-xs px-3 py-0.5 rounded-full border whitespace-nowrap focus:outline-none ${
                  isFollowing
                    ? 'bg-green-500 text-white border-green-500'
                    : 'bg-gray-100 text-gray-600 border-gray-300'
                } hover:shadow-md transition-colors duration-200`}
                style={{
                  backgroundColor: isFollowing ? '#22c55e' : '',
                }}
              >
                {isFollowing ? 'Following' : 'Follow'}
              </button>
            </div>
              
            <div className="flex flex-wrap gap-2 mt-1 mb-10">
              {tags.slice(0, 3).map((tag, index) => (
                <span key={index} className="bg-green-100 text-green-800 text-sm font-medium px-3 py-1 rounded-full">
                  {tag}
                </span>
              ))}
              {tags.length > 3 && (
                <span className="bg-gray-200 text-gray-600 text-sm font-medium px-3 py-1 rounded-full">
                  +
                </span>
              )}
            </div>
          </div>

          <button
            onClick={(e) => { 
              e.stopPropagation(); 
              onToggleBookmark();
            }} 
            className="absolute bottom-6 right-6 text-gray-600 hover:text-green-600 transition"
          >
            {isBookmarked ? <BookmarkIcon fontSize="medium" /> : <BookmarkBorderOutlinedIcon fontSize="medium" />}
          </button>
        </div>

        <div 
          className="absolute w-full h-full rounded-2xl shadow-lg border border-gray-200 bg-white p-6 flex flex-col items-start justify-start overflow-hidden"
          style={{
            backfaceVisibility: "hidden",
            transform: "rotateY(180deg)", 
          }}
        >
          <h3 className="text-2xl font-bold text-gray-800 mb-2">{name}</h3>
          
          <p className="text-md text-gray-600 mb-1"><strong>Cooking Time:</strong> {cooking_time}</p>

          <p className="text-md text-gray-600 mb-1"><strong>Ingredients:</strong></p>
          <div className="mb-2">
            <ul className="text-gray-500 text-sm list-disc list-inside max-h-24 overflow-hidden">
              {normalizedIngredients.slice(0, 5).map((item, idx) => (
                <li key={idx}>{item}</li>
              ))}
            </ul>
            {normalizedIngredients.length > 5 && (
              <p className="italic text-gray-400 text-sm mt-1">...and more</p>
            )}
          </div>
          <p className="text-md text-gray-600 mb-1"><strong>Description:</strong></p>
          <p className="text-gray-500 text-sm">{description}</p>
          <div className="mt-8 flex flex-row hover:scale-105 transform transition duration-200">
            <p>
            <InfoOutlinedIcon/>
            </p>
            <p className="ml-3 text-gray-600  cursor-pointer" onClick={(e) => { 
                e.stopPropagation();
                handleRecipeClick(id);
              }}>
              Full recipe details
            </p>
          </div>
        </div>

      </div>
    </div>
  );
};

export default FlipRecipeCard;
