import React, { useEffect, useState } from "react";
import AddRecipeForm from "../components/AddRecipeForm";


const AddRecipe = () => {

  return (
    <div className="montserrat-font flex flex-col justify-center items-center w-full"> 
      <div class="text-5xl font-bold text-green-800 mb-12 text-center">
        Add recipe
      </div>

      <div>
        <AddRecipeForm/>
      </div>

    </div>
  );
};

export default AddRecipe;
