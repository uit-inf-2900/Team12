import React from 'react';
import { Snackbar, Alert } from '@mui/material';

// Function to display alerts to the user 
function SetAlert({ open, setOpen, severity, message }) {
    // Function to close the alert message 
    const handleClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setOpen(false);
    };

    return (
    // Snackbar displays a brief messages to the user
    <Snackbar 
        open={open} 
        autoHideDuration={6000}         // How long the message is displayed in ms before it disappears 
        onClose={handleClose}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }} 
        sx={{
            position: 'fixed', 
            top: '10%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            '& .MuiPaper-root': {
            },
            zIndex: 1400,
            // Apply backdrop filter to blur the background
            backdropFilter: 'blur(4px)',
            backgroundColor: 'rgba(255, 255, 255, 0.5)'
        }}
        >
        {/* Alert component within Snackbar */}
        <Alert  onClose={handleClose} 
                severity={severity}         // specifies the level of the Alert being displayed (error, Warning, Info, Success)
                variant="outlined"
                sx={{ width: '100%' }}>
            {message}
        </Alert>
    </Snackbar>
    );    
}

export default SetAlert;
