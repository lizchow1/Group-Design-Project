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
  onToggleBookmark 
}) => {
  const [isFlipped, setIsFlipped] = useState(false);
  const navigate = useNavigate();

  const handleRecipeClick = (recipeID) => {
    console.log("recipeID", recipeID)
    navigate(`/app/${recipeID}`);
  };

  return (
    <div 
      style={{ perspective: "1000px" }}
      className="relative w-[500px] min-w-[400px] h-[450px] mx-auto cursor-pointer"
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
            {video ? (
              <video src={video} className="w-full h-[300px] object-cover" controls />
            ) : (
              <img 
                src={image} 
                alt={name} 
                className="w-full h-[300px] object-cover cursor-pointer"
              />
            )}
          </div>

          <div className="p-6">
            <h3 className="text-2xl font-bold text-gray-800">{name}</h3>
            <p className="text-lg text-gray-500 mt-2">{username}</p>
            <div className="flex flex-wrap gap-2 mt-4">
              {tags.map((tag, index) => (
                <span key={index} className="bg-green-100 text-green-800 text-sm font-medium px-3 py-1 rounded-full">
                  {tag}
                </span>
              ))}
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
          className="absolute w-full h-full rounded-2xl shadow-lg border border-gray-200 bg-white p-6 flex flex-col items-start justify-center"
          style={{
            backfaceVisibility: "hidden",
            transform: "rotateY(180deg)", 
          }}
        >
          <h3 className="text-2xl font-bold text-gray-800 mb-2">{name}</h3>
          
          <p className="text-md text-gray-600 mb-1"><strong>Cooking Time:</strong> {cooking_time}</p>

          <p className="text-md text-gray-600 mb-1"><strong>Ingredients:</strong></p>
          <ul className="text-gray-500 text-sm list-disc list-inside mb-2">
            {ingredients.split(',').map((item, idx) => (
              <li key={idx}>{item.trim()}</li>
            ))}
          </ul>

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
