import React, { useState } from "react";
import RateReviewOutlinedIcon from '@mui/icons-material/RateReviewOutlined';
import { useUser } from "../contexts/UserContext";
import { useParams } from "react-router-dom";
import { createComment, createRating } from "../utils/api";
import Box from '@mui/material/Box';
import Rating from '@mui/material/Rating';
import Typography from '@mui/material/Typography';



const ReviewSection = ({ comments, setIsUpdated }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [reviewText, setReviewText] = useState('');
  const { user } = useUser();
  const { recipeId } = useParams();
  const [value, setValue] = React.useState(0);

  const hasUserCommented = comments.some(comment => comment.username === user.username);

  const handleModalToggle = () => {
    setIsModalOpen(!isModalOpen);
  };

  const handleReviewChange = (e) => {
    setReviewText(e.target.value);
  };

  const handleSubmitReview = async () => {
    if (reviewText.trim() && user.username.trim()) {
      const commentData = {
        username: user.username,
        comment_text: reviewText,
      };
    
      try {
        const result = await createComment(recipeId, commentData);

        if (setIsUpdated) {
          setIsUpdated(true);
        }
  
        setReviewText('');
        setIsModalOpen(false);
      } catch (error) {
        console.error("Error submitting comment:", error.message);
      }
    }

    if (value > 0 && user.username.trim()) {
      const ratingData = {
        username: user.username,
        rating_value: value,
      };
      try {
        const result = await createRating(recipeId, ratingData);

        if (setIsUpdated) {
          setIsUpdated(true);
        }
  
        setReviewText('');
        setIsModalOpen(false);
      } catch (error) {
        console.error("Error submitting comment:", error.message);
      }
    }
    
  };

  return (
    <div>

      {!hasUserCommented && (
        <div className="flex flex-row mt-4">
          <RateReviewOutlinedIcon 
          fontSize="large"
          />
          <p 
            className="text-3xl ml-4 underline cursor-pointer"
            onClick={handleModalToggle}
          >
            Write a review
          </p>
        </div>
      )}

      {isModalOpen && (
        <div className="fixed inset-0 backdrop-blur-sm bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg shadow-lg w-1/3">
          <div className="self-start items-start ">
              Rate recipe
            <Box sx={{ '& > legend': { mt: 2 } }}>
              <Typography component="legend"/>
              <div className="">
                <Rating
                  name="simple-controlled"
                  value={value}
                  onChange={(event, newValue) => {
                    setValue(newValue);
                  }}
                />
              </div>
            </Box>
          </div>
            <h2 className="text-xl mb-4">Leave a comment</h2>
            <textarea
              className="text-base w-full h-32 p-2 border border-gray-300 rounded-md"
              value={reviewText}
              onChange={handleReviewChange}
              placeholder="Write your review here..."
            />
            <div className="flex justify-end mt-4">
              {(reviewText.trim() || value > 0) && (
                <div 
                  className="bg-green-600 text-white px-4 py-2 rounded-md cursor-pointer"
                  onClick={handleSubmitReview}
                >
                  Submit
                </div>
              )}
              <div 
                className="bg-gray-300 text-black px-4 py-2 rounded-md ml-2 cursor-pointer"
                onClick={handleModalToggle}
              >
                Cancel
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReviewSection;
