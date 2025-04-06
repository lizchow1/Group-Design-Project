import React, { useState } from "react";
import RateReviewOutlinedIcon from '@mui/icons-material/RateReviewOutlined';
import { useUser } from "../contexts/UserContext";
import { useParams } from "react-router-dom";
import { createComment } from "../utils/api";


const CommentSection = ({ comments }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [reviewText, setReviewText] = useState('');
  const { user } = useUser();
  const { recipeId } = useParams();


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
  
        console.log("Comment added:", result.comment);
        setReviewText('');
        setIsModalOpen(false);
      } catch (error) {
        console.error("Error submitting comment:", error.message);
      }
    }
  };

  return (
    <div>
      <p>Comments:</p>

      <div className="mt-6">
        <div className="border-t border-gray-300 w-full" />
        
        {comments.length > 0 ? (
            comments.map((comment, index) => (
              <div key={index} className="flex flex-col items-start">
                <span className="md:text-base mt-4 mb-4">{comment.comment_text}</span>
                <div className="border-t border-gray-300 w-full"></div>
              </div>
            ))
          ) : (
            <div>
              <p className="text-base text-gray-500 mb-6">No comments yet.</p>
              <div className="flex flex-row">
                <RateReviewOutlinedIcon />
                <p 
                  className="text-base ml-4 text-blue-500 underline cursor-pointer"
                  onClick={handleModalToggle}
                >
                  Write a review
                </p>
              </div>
            </div>
          )}

      </div>

      {/* Modal for writing a review */}
      {isModalOpen && (
        <div className="fixed inset-0 backdrop-blur-sm bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg shadow-lg w-1/3">
            <h2 className="text-xl mb-4">Write a Review</h2>
            <textarea
              className="text-base w-full h-32 p-2 border border-gray-300 rounded-md"
              value={reviewText}
              onChange={handleReviewChange}
              placeholder="Write your review here..."
            />
            <div className="flex justify-end mt-4">
            {reviewText.trim() && (
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

export default CommentSection;
