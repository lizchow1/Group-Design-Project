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
import CancelIcon from '@mui/icons-material/Cancel';



const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;
const checkedIcon = <CheckBoxIcon fontSize="small" />;

const AddRecipeCard = ({ handleSubmit, initialData }) => {  
  const [name, setName] = React.useState(initialData?.name || '');
  const available_tags = ["Easy", "Indian", "Vegan", "Gluten free", "Comfort food", "Under 15 min", "AI-Generated"]
  const [minutes, setMinutes] = React.useState(initialData?.cooking_time || '');
  const [servings, setServings] = React.useState(initialData?.servings || '')
  const [ingredients, setIngredients] = React.useState(initialData?.ingredients || "");
  const [instructions, setInstructions] = React.useState(initialData?.instructions || '');
  const [description, setDescription] = React.useState(initialData?.description || '')
  const [tips, setTips] = React.useState(initialData?.tips || '')
  const [image, setImage] = React.useState(initialData?.image || '' );
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

    const handleServingsChange = (event) => {
      setServings(event.target.value);
    };

    const handleDescriptionChange = (event) => {
      setDescription(event.target.value);
    };

    const handleNameChange = (event) => {
      setName(event.target.value);
    };

    const handleTipsChange = (event) => {
      setTips(event.target.value);
    };

    const handleTagsChange = (event, newValue) => {
      setTags(newValue);
    };

    const handleIngredientsFocus = () => {
      if (ingredients.trim() === "") {
        setIngredients("• ");
      }
    };

    const handleInstructionsFocus = () => {
      if (instructions.trim() === "") {
        setInstructions("1. ");
      }
    };

    const handleInstructionsChange = (event) => {
      const newInstruction = event.target.value;
      const lines = newInstruction.split("\n").map((line) => line.trimStart());
    
      const formattedLines = lines.map((line, index) => {
        const expectedPrefix = `${index + 1}. `;
        if (!line.startsWith(expectedPrefix)) {
          const cleanedLine = line.replace(/^\d+\.\s*/, "");
          return `${expectedPrefix}${cleanedLine}`;
        }
        return line;
      });
    
      if (formattedLines.length === 0 || (formattedLines.length === 1 && formattedLines[0] === "")) {
        setInstructions("1. ");
      } else {
        setInstructions(formattedLines.join("\n"));
      }
    };

    const handleInstructionsKeyDown = (event) => {
      const cursorPosition = event.target.selectionStart;
      const lines = instructions.split("\n");
    
      let total = 0;
      let currentLineIndex = 0;
      for (let i = 0; i < lines.length; i++) {
        total += lines[i].length + 1;
        if (cursorPosition <= total) {
          currentLineIndex = i;
          break;
        }
      }
    
      const lineStartPos = total - (lines[currentLineIndex].length + 1);
      const cursorOffsetInLine = cursorPosition - lineStartPos;
    
      const numberPrefixLength = `${currentLineIndex + 1}. `.length;
      if ((event.key === "ArrowLeft" || event.key === "ArrowUp") && cursorOffsetInLine <= numberPrefixLength) {
        event.preventDefault();
        return;
      }
    
      if (event.key === "Enter") {
        event.preventDefault();
    
        const currentLine = lines[currentLineIndex];
        const contentAfterNumber = currentLine.replace(/^\d+\.\s*/, "").trim();
    
        if (contentAfterNumber.length === 0) {
          return;
        }
    
        const newLineNumber = lines.length + 1;
        setInstructions((prevInstructions) => prevInstructions + `\n${newLineNumber}. `);
      }
    
      if (event.key === "Backspace") {
        if (lines.length === 1 && lines[0] === "1. ") {
          event.preventDefault();
          return;
        }
    
        if (lines[lines.length - 1] === `${lines.length}. `) {
          event.preventDefault();
          setInstructions(lines.slice(0, -1).join("\n"));
        }
      }
    };

    const handleIngredientsChange = (event) => {
      console.log("event", event.target.id)
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

    const handleIngredientsKeyDown = (event) => {
      const cursorPosition = event.target.selectionStart;
      const lines = ingredients.split("\n");
    
      let total = 0;
      let currentLineIndex = 0;
      for (let i = 0; i < lines.length; i++) {
        total += lines[i].length + 1;
        if (cursorPosition <= total) {
          currentLineIndex = i;
          break;
        }
      }
    
      const lineStartPos = total - (lines[currentLineIndex].length + 1);
      const cursorOffsetInLine = cursorPosition - lineStartPos;
    
      if ((event.key === "ArrowLeft" || event.key === "ArrowUp") && cursorOffsetInLine <= 2 && lines[currentLineIndex].startsWith("• ")) {
        event.preventDefault();
        return;
      }

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
      const file = event.target.files[0];
      if (!file) return;
    
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onloadend = () => {
          setImage(reader.result); 
      };
    };
    
    
    const handleSubmitForm = () => {
      if (!isFormValid || isSubmitting) return;      
      
      handleSubmit({
        name,
        instructions,
        ingredients,
        minutes,
        tags,
        image,
        description,
        tips,
        servings,

      });
    
    };
  
    const isFormValid = name.trim() !== '' && instructions.trim() !== '' && minutes !== '';

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

            <div className="flex flex-row">
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

            <div class="mt-6">
              <FormControl required sx={{ m: 1, minWidth: 170, ...green }}>
                <InputLabel id="demo-simple-select-required-label">Servings</InputLabel>
                  <Select
                    labelId="demo-simple-select-required-label"
                    id="demo-simple-select-required"
                    value={servings}
                    label="Servings*"
                    onChange={handleServingsChange}
                  >
                      <MenuItem value={1}>1</MenuItem>
                      <MenuItem value={2}>2</MenuItem>
                      <MenuItem value={3}>3</MenuItem>
                      <MenuItem value={4}>4</MenuItem>
                      <MenuItem value={6}>6 or more</MenuItem>
                  </Select>
              </FormControl>
            </div>
            </div>

            <div class="flex flex-row ml-2 mt-6">
              <Box>
                <TextField
                  required
                  label="Ingredients"
                  id="IngredientInput"
                  multiline
                  rows={6}
                  variant="outlined" 
                  value={ingredients}
                  onChange={handleIngredientsChange}
                  onKeyDown={handleIngredientsKeyDown}
                  onFocus={handleIngredientsFocus}
                  sx={green }
                />
              </Box>
              
              <div class="ml-6">
                <Box>
                  <TextField
                        sx={green}
                        required
                        id="InstructionsInput"
                        label="Instructions" 
                        value={instructions}
                        onChange={handleInstructionsChange}
                        onKeyDown={handleInstructionsKeyDown}
                        onFocus={handleInstructionsFocus}
                        multiline
                        rows={6}
                        variant="outlined" 
                      />
                </Box>
              </div>
            </div>

            <div className="mt-6 flex flex-row">
              <div>
              <Box
                component="form"
                sx={{ '& .MuiTextField-root': { m: 1, width: '23ch' } }}
                noValidate
                autoComplete="off"
              >
                <TextField
                  label="Description"
                  value={description}
                  onChange={handleDescriptionChange}
                  sx={green}
                />
              </Box>
              </div>

              <div>
              <Box
                component="form"
                sx={{ '& .MuiTextField-root': { m: 1, width: '23ch' } }}
                noValidate
                autoComplete="off"
              >
                <TextField
                  label="Tips"
                  value={tips}
                  onChange={handleTipsChange}
                  sx={green}
                />
              </Box>
              </div>
            </div>
    
            <div class="mt-6 ml-2">
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
            <div className="font-bold text-gray-500">Add an image or video</div>

            {image && image !== "" ? (
              <div className="relative">
              <div 
                className="absolute top-0 right-0 m-2 cursor-pointer text-gray-300 z-10"
                onClick={(e) => {
                  e.stopPropagation();
                  setImage('');
                }}
              >
                <CancelIcon />
              </div>
    
              {image.startsWith("data:video") ? (
                <video controls className="w-[200px] h-[200px] object-cover rounded-2xl">
                  <source src={image} type="video/mp4" />
                  Your browser does not support the video tag.
                </video>
              ) : (
                <img src={image} className="w-[200px] h-[200px] object-cover rounded-2xl" alt="Dish" />
              )}
            </div>
              ) : (
                <input type="file" className="mt-0" />
              )}

              
            <div className="bg-green-700 text-white p-2 mt-4 rounded-[5px] hover:bg-green-800 cursor-pointer"
            onClick={() => document.getElementById("fileInput").click()}
            >
              
              <input 
                type="file" 
                id="fileInput" 
                className="hidden" 
                onChange={handleFileChange} 
                accept="image/*, video/*"
            />
              Browse Files
            </div>
            
          </div>
        </div>

        <div
          className={`font-bold text-xl p-2 mt-10 mb-8 rounded-[5px] w-fit items-center ${
            isFormValid ? 'bg-green-700 text-white hover:bg-green-800 cursor-pointer' : ' text-white cursor-not-allowed'
          }`}
          onClick={isFormValid && !isSubmitting ? handleSubmitForm : null}
        >
          Upload recipe
      </div>

      </div>

      );
};

export default AddRecipeCard;
