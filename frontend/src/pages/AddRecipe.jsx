import React, { useEffect, useState } from "react";
import AddRecipeForm from "../components/AddRecipeForm";


const AddRecipe = () => {

  return (
    <div className="montserrat-font flex flex-col justify-center items-center w-full"> 
      <h1 class="text-3xl font-bold mt-6 top-6 text-black z-20 text-center mb-12">
        Add recipe
      </h1>

      <div>
        <AddRecipeForm/>
      </div>

    </div>
  );
};

export default AddRecipe;
