import React, { useState } from "react";
import Box from '@mui/material/Box';
import Rating from '@mui/material/Rating';
import Typography from '@mui/material/Typography';



const RatingComponent = ({rating}) => {

  return (
    <div>
        <Box sx={{ '& > legend': { mt: 2 } }}>
      
          <Typography component="legend"/>
          <Rating name="read-only" value={rating} readOnly />
      
        </Box>
  
    </div>
  );
};

export default RatingComponent;
