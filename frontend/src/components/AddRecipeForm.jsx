import React from "react";
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Select from '@mui/material/Select';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import Autocomplete from '@mui/material/Autocomplete';
import Stack from '@mui/material/Stack';



const AddRecipeCard = () => {
    const tags = ["Easy", "Indian", "Vegan", "Gluten free", "Comfort food", "Under 15 min"]
    const [minutes, setMinutes] = React.useState('');
    const green = {
        '& .MuiOutlinedInput-root': {
          '&.Mui-focused fieldset': {
            borderColor: 'green', // Change border color to green when focused
          },
        },
        '& .MuiInputLabel-root': {
    '&.Mui-focused': {
      color: 'green', // Change label color to green when focused
    },
  },
      };

    const handleChange = (event) => {
      setMinutes(event.target.value);
    };

    
  


    return (
        <div class="ml-36 -mt-56 flex flex-col">
        <div>
          <Box
            component="form"
            sx={{ '& .MuiTextField-root': { m: 1, width: '25ch' } }}
            noValidate
            autoComplete="off"
          >
            <TextField
              required
              id="outlined-required"
              label="Name"
              defaultValue=""
              sx={green}
            />
          </Box>
        </div>

        <div>
        <FormControl required sx={{ m: 1, minWidth: 170, ...green }}>
        <InputLabel id="demo-simple-select-required-label">Cooking time</InputLabel>
        <Select
          labelId="demo-simple-select-required-label"
          id="demo-simple-select-required"
          value={minutes}
          label="Cooking time*"
          onChange={handleChange}
        >
          
          <MenuItem value={15}>15 min</MenuItem>
          <MenuItem value={30}>30 min</MenuItem>
          <MenuItem value={45}>45 min</MenuItem>
          <MenuItem value={60}>60 min</MenuItem>
          <MenuItem value={90}>90 min or more</MenuItem>
        </Select>
      </FormControl>
        </div>
        
        <div>
        <Autocomplete
      multiple
      id="checkboxes-tags-demo"
      options={top100Films}
      disableCloseOnSelect
      getOptionLabel={(option) => option.title}
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
            {option.title}
          </li>
        );
      }}
      style={{ width: 500 }}
      renderInput={(params) => (
        <TextField {...params} label="Checkboxes" placeholder="Favorites" />
      )}
    />
    </div>

        </div>
      );
};

export default AddRecipeCard;
