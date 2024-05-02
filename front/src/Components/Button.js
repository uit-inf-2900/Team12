import React, { useState } from 'react';
import { Button, Fab, ThemeProvider, createTheme } from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import DeleteIcon from '@mui/icons-material/Delete';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import SaveIcon from '@mui/icons-material/Save';
import LockResetIcon from '@mui/icons-material/LockReset';
import EditIcon from '@mui/icons-material/Edit';
import LoginIcon from '@mui/icons-material/Login';
import LogoutIcon from '@mui/icons-material/Logout';
import AddIcon from '@mui/icons-material/Add';

import Theme from './Theme';

// Select a fitting icon based on the iconName prop
const IconSelector = ({ iconName }) => {
    const icons = {
        send: <SendIcon />,
        delete: <DeleteIcon />,
        upload: <CloudUploadIcon />,
        save: <SaveIcon />,
        reset: <LockResetIcon />,
        edit: <EditIcon />,
        login: <LoginIcon />,
        logout: <LogoutIcon />,
    };
    // Return the icon if it exists in the icons object, otherwise return null
    return icons[iconName] || null;         
};


const CustomButton = ({ children, choosenvar, iconName, themeMode, submit, fullWidth, onClick, ...props  }) => {
    const theme = Theme(themeMode || 'light'); 

    const buttonStyle = {
        width: fullWidth ? '100%' : 'auto', 
    };

    return (
        <ThemeProvider theme={theme}>
            <Button
                style={buttonStyle}
                onClick={onClick}
                {...props}
                variant='contained'
                startIcon={<IconSelector iconName={iconName} />} 
                type={submit ? 'submit' : 'button'} 
            >
                {children}
            </Button>
        </ThemeProvider>
    );
};


const AddButton = ({ onClick }) => {
    const [isHovered, setIsHovered] = useState(false);

    /** Default styles for the button */
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

export { CustomButton, AddButton };
