import React from "react";
import { Link } from "react-router-dom";

const CommentSection = ({ comments }) => {
    return (
      <div>
        <p>Comments:</p>
  
        <div className="mt-6">
          <div className="border-t border-gray-300 w-full" />
          
          {comments.length > 0 ? (
            comments.map((comment, index) => (
              <div key={index} className="flex flex-col items-start">
                <span className="md:text-base mt-4 mb-4">{comment}</span>
                <div className="border-t border-gray-300 w-full"></div>
              </div>
            ))
          ) : (
            <p className="text-gray-500">No comments yet.</p>
          )}
        </div>
      </div>
    );
  };
  
  export default CommentSection;
  