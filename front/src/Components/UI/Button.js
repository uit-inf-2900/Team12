import React, { useState } from 'react';
import { Button, Fab, ThemeProvider, Tooltip } from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import DeleteIcon from '@mui/icons-material/Delete';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import SaveIcon from '@mui/icons-material/Save';
import LockResetIcon from '@mui/icons-material/LockReset';
import EditIcon from '@mui/icons-material/Edit';
import LoginIcon from '@mui/icons-material/Login';
import LogoutIcon from '@mui/icons-material/Logout';
import AddIcon from '@mui/icons-material/Add';

import Theme from '../Utilities/Theme';


/**
 * Component that selects an icon based on the provided `iconName` prop.
 */

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



/**
 * Custom button component.
 */
const CustomButton = ({ children, choosenvar, iconName, themeMode, submit, fullWidth, onClick, ...props  }) => {
    // Choose a theme based on the themeMode prop, or default to light theme 
    // the button will be white or grey depending on the themeMode
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


/**
 * Add (+) button component.
 */
const AddButton = ({ onClick, hoverTitle }) => {
    const [isHovered, setIsHovered] = useState(false);

    /** Default styles for the button */
    const defaultStyle = {
        backgroundColor: '#F6964B', 
        color: 'white',
        transition: 'transform 0.3s ease, background-color 0.3s ease',
    };

    /** Define custom styles for this specific tooltip that displays a message */
    const tooltipStyles = { 
        backgroundColor: '#F6964B', 
        fontSize: '0.8rem', 
        font: '"Rigot", sans-serif'
    };


    /** Hover styles for the button */
    const hoverStyle = {
        backgroundColor: '#d06514', 
        transform: 'scale(1.1)', 
    };

    return (
        <Tooltip title="Add a new item" placement="right" componentsProps={{ tooltip: { sx: tooltipStyles } }} > 
            <Fab
                style={isHovered ? { ...defaultStyle, ...hoverStyle } : defaultStyle}
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
                onClick={onClick}
            >
                <AddIcon />
            </Fab>
        </Tooltip>
    );
};

export { CustomButton, AddButton };
