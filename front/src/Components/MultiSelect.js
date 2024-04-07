import React from 'react';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Theme from './Theme';
import { ThemeProvider } from '@mui/material/styles';
import Select from '@mui/material/Select';


// Function for a multi-select dropdown menu 
const MultiSelect = ({ label, value, handleChange, menuItems }) => {
  return (
    // Apply the theme to the component
    <ThemeProvider theme={Theme}> 
    
    <FormControl fullWidth variant="outlined">
      {/* Input label for the select */}
      <InputLabel 
        id={`${label}-select-label`} 
        sx={{
          '&.Mui-focused': {
            color: '#000000' , 
          },
        }}
        >
        {label}
      </InputLabel>

      {/* Select component */}
      <Select
        label={label}
        color='secondary'
        labelId={`${label}-select-label`}
        value={value}
        onChange={handleChange}
        sx={{
          fontFamily: '"Rigot", sans-serif',
          backgroundColor: '#f7f7f7',
        }}
        >
        {/* Menu items, should be defined and sendt in where the component is used */}
        {menuItems.map((item) => (
          <MenuItem key={item.value} value={item.value}>{item.name}</MenuItem>
          ))}
      </Select>
    </FormControl>
    </ThemeProvider>
  );
};

export default MultiSelect;
