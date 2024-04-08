import React from 'react';
import Button from '@mui/material/Button';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import SendIcon from '@mui/icons-material/Send';
import DeleteIcon from '@mui/icons-material/Delete';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import SaveIcon from '@mui/icons-material/Save';
import LockResetIcon from '@mui/icons-material/LockReset';
import EditIcon from '@mui/icons-material/Edit';
import LoginIcon from '@mui/icons-material/Login';
import LogoutIcon from '@mui/icons-material/Logout';
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


const CustomButton = ({ children, choosenvar, iconName, themeMode, submit, fullWidth, ...props  }) => {
    const theme = Theme(themeMode);

    const buttonStyle = {
        width: fullWidth ? '100%' : 'auto', 
    };

    return (
        <ThemeProvider theme={theme}>
            <Button
                style={buttonStyle} {...props}
                variant='contained'
                startIcon={<IconSelector iconName={iconName} />} 
                type={submit ? 'submit' : 'button'} 
                sx={{
                    // ytterligere stiltilpasninger om nødvendig
                }}
            >
                {children}
            </Button>
        </ThemeProvider>
    );
};

export default CustomButton;