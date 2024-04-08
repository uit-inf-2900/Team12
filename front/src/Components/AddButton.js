import React, { useState } from 'react';
import { Fab } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';


// Creates a + circle button that scales up when hovered
const AddButton = ({ onClick }) => {
    const [isHovered, setIsHovered] = useState(false);

    // Define styles
    const defaultStyle = {
        backgroundColor: '#F6964B', 
        color: 'white',
        transition: 'transform 0.3s ease, background-color 0.3s ease',
    };

    const hoverStyle = {
        backgroundColor: '#d06514', 
        transform: 'scale(1.1)', 
    };

    return (
        <Fab
            style={isHovered ? { ...defaultStyle, ...hoverStyle } : defaultStyle}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            onClick={onClick}
        >
            <AddIcon />
        </Fab>
    );
};

export default AddButton;
