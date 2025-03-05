import React from "react";
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Select from '@mui/material/Select';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Checkbox from '@mui/material/Checkbox';
import Autocomplete from '@mui/material/Autocomplete';
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';
import CheckBoxIcon from '@mui/icons-material/CheckBox';


const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;
const checkedIcon = <CheckBoxIcon fontSize="small" />;

const AddRecipeCard = ({ handleSubmit, initialData }) => {
    const available_tags = ["Easy", "Indian", "Vegan", "Gluten free", "Comfort food", "Under 15 min"]
    
  const [minutes, setMinutes] = React.useState(initialData?.cooking_time || '');
  const [image, setImage] = React.useState(initialData?.image || '' );
  const [ingredients, setIngredients] = React.useState(initialData?.ingredients || "• ");
  const [name, setName] = React.useState(initialData?.name || '');
  const [description, setDescription] = React.useState(initialData?.description || '');
  const [tags, setTags] = React.useState(initialData?.tags || []);
  const [isSubmitting, setIsSubmitting] = React.useState(false);

    const green = {
        '& .MuiOutlinedInput-root': {
          '&.Mui-focused fieldset': {
            borderColor: 'green',
          },
        },
        '& .MuiInputLabel-root': {
    '&.Mui-focused': {
      color: 'green',
    },
  },
      };

    const handleMinutesChange = (event) => {
      setMinutes(event.target.value);
    };

    const handleNameChange = (event) => {
      setName(event.target.value);
  };

  const handleDescriptionChange = (event) => {
      setDescription(event.target.value);
  };

  const handleTagsChange = (event, newValue) => {
    setTags(newValue);
  };
  

  const handleIngredientsChange = (event) => {
    const newIngredient = event.target.value;
    const lines = newIngredient.split("\n").map((line) => line.trimStart());

    const formattedLines = lines.map((line, index) => {
        if (line.startsWith("•") && !line.startsWith("• ")) {
          return "• "; 
        }
        return line;
    });

    if (formattedLines.length === 0 || (formattedLines.length === 1 && formattedLines[0] === "")) {
      setIngredients("• ");
    } else {
      setIngredients(formattedLines.join("\n"));
    }
};


    const handleKeyDown = (event) => {
      if (event.key === "Enter") {
        event.preventDefault();

        const lines = ingredients.split("\n");
        const lastLine = lines[lines.length - 1].trim();

        if (lastLine.length > 1) {
          setIngredients((prevIngredient) => prevIngredient + "\n• ");
        }
      }

      if (event.key === "Backspace") {
        const lines = ingredients.split("\n");

        if (lines.length === 1 && lines[0] === "• ") {
          event.preventDefault();
          return;
        }

        if (lines[lines.length - 1] === "• ") {
          event.preventDefault();
          setIngredients(lines.slice(0, -1).join("\n"));
        }
      }
      };

      const handleFileChange = (event) => {
        const imagePath = event.target.value;
        
        if (imagePath.trim()) {
          setImage(imagePath);
        } else {
          setImage("");
        }
      };

  const handleSubmitForm = () => {
    if (!isFormValid || isSubmitting) return;
    
    handleSubmit({
      name,
      description,
      ingredients,
      minutes,
      tags,
      image
    });
    const updatedData = {
      name,
      description,
      ingredients, // ingredients
      minutes,
      tags,
      image
    };
    console.log("Submit data:", image);
  
  };
  
    const isFormValid = name.trim() !== '' && description.trim() !== '' && minutes !== '';

    return (
      <div class="flex flex-col items-center justify-center w-full">
        <div class="flex flex-row">
          <div class="flex flex-col">
            <div>
              <Box
                component="form"
                sx={{ '& .MuiTextField-root': { m: 1, width: '23ch' } }}
                noValidate
                autoComplete="off"
              >
                <TextField
                  required
                  id="outlined-required"
                  label="Name"
                  value={name}
                  onChange={handleNameChange}
                  sx={green}
                />
              </Box>
            </div>

            <div class="mt-6">
              <FormControl required sx={{ m: 1, minWidth: 170, ...green }}>
                <InputLabel id="demo-simple-select-required-label">Cooking time</InputLabel>
                  <Select
                    labelId="demo-simple-select-required-label"
                    id="demo-simple-select-required"
                    value={minutes}
                    label="Cooking time*"
                    onChange={handleMinutesChange}
                  >
                      <MenuItem value={15}>15 min</MenuItem>
                      <MenuItem value={30}>30 min</MenuItem>
                      <MenuItem value={45}>45 min</MenuItem>
                      <MenuItem value={60}>60 min</MenuItem>
                      <MenuItem value={90}>90 min or more</MenuItem>
                  </Select>
              </FormControl>
            </div>

            <div class="flex flex-row ml-2 mt-8">
              <Box>
                <TextField
                  required
                  label="Ingredients"
                  id="fullWidth"
                  multiline
                  rows={6}
                  variant="outlined" 
                  value={ingredients}
                  onChange={handleIngredientsChange}
                  onKeyDown={handleKeyDown}
                  sx={green }
                />
              </Box>
              
              <div class="ml-10">
                <Box>
                  <TextField
                        sx={green}
                        required
                        id="outlined-multiline-static"
                        label="Description"
                        value={description}
                        onChange={handleDescriptionChange}
                        multiline
                        rows={6}
                      />
                </Box>
              </div>
            </div>
    
            <div class="mt-10 ml-2">
              <Autocomplete
                multiple
                id="checkboxes-tags-demo"
                options={available_tags}
                sx={green}
                disableCloseOnSelect
                getOptionLabel={(option) => option}
                onChange={handleTagsChange}
                value={tags}
                renderOption={(props, option, { selected }) => {
                  const { key, ...optionProps } = props;
                  return (
                    <li key={key} {...optionProps}>
                      <Checkbox
                        icon={icon}
                        checkedIcon={checkedIcon}
                        style={{ marginRight: 8 }}
                        checked={selected}
                      />
                      {option}
                    </li>
                  );
                }}
                style={{ width: 500 }}
                renderInput={(params) => (
                  <TextField 
                  {...params} 
                  label="Tags"
                   />
                )}
              />
            </div>
          </div>

          <div 
              className="montserrat-font p-6 border border-gray-300 rounded-[5px] w-[400px] ml-10 flex items-center justify-center flex-col">
            <div className="font-bold text-gray-500">Add an image</div>
            <div>
              <input
                type="text"
                className="border-2 border-gray-500 p-2 rounded-md w-full focus:outline-none text-black"
                onChange={handleFileChange}
                value={image}
                placeholder="Enter image path here"
              />
            </div>
              {/*
            <div className="text-gray-500">
              {fileName ? fileName : "Drag and drop a file here"}
            </div>
              
            <div className="bg-green-700 text-white p-2 mt-4 rounded-[5px] hover:bg-green-800 cursor-pointer"
            onClick={() => document.getElementById("fileInput").click()}
            >
              
              <input 
                type="file" 
                id="fileInput" 
                className="hidden" 
                onChange={handleFileChange} 
            />
              Browse Files
            </div>
            */}
          </div>
        </div>

        <div
          className={`font-bold text-xl p-2 mt-20 rounded-[5px] w-fit items-center ${
            isFormValid ? 'bg-green-700 text-white hover:bg-green-800 cursor-pointer' : 'bg-gray-400 text-white cursor-not-allowed'
          }`}
          onClick={isFormValid && !isSubmitting ? handleSubmitForm : null}
        >
          Upload recipe
      </div>

      </div>
        

      );
};

export default AddRecipeCard;
