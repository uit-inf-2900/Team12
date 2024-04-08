import React from 'react';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import IconButton from '@mui/material/IconButton';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import Theme from './Theme';
import { ThemeProvider } from '@mui/material/styles';
import SendIcon from '@mui/icons-material/Send';

const InputField = ({ label, register, errors, type, readOnly, onSubmit,  ...inputProps }) => {
    // Chechk the type, state for passwors visabilit and toggle password visibility
    const isPassword = type === "password";
    const [showPassword, setShowPassword] = React.useState(false);
    const togglePasswordVisibility = () => setShowPassword(!showPassword);


    // Function to handle the send action
    const handleSendClick = (event) => {
        if (onSubmit) {
            event.preventDefault(); // prevent default if you are handling the submission
            onSubmit(); // pass the submit function
        }
    };


    return (
        <ThemeProvider theme={Theme}>
            {/* Text field component */}
            <TextField
                color='secondary'
                {...register}
                {...inputProps}
                type={isPassword && showPassword ? "text" : type}   // Show text instead of password if showPassword is true
                label={label}
                error={!!errors}                                    // Set error state based on whether errors exist
                helperText={errors ? errors.message : ''}           // Display error message if errors exist
                variant="outlined"
                margin="dense"
                fullWidth
                InputProps={{
                    readOnly: readOnly,                             // Set readOnly state
                    // Show eye icon for password input fields
                    endAdornment: (
                        <InputAdornment position="end">
                            {isPassword ? (
                                <IconButton
                                    aria-label="toggle password visibility"
                                    onClick={togglePasswordVisibility}
                                >
                                    {showPassword ? <VisibilityOff /> : <Visibility />}
                                </IconButton>
                            ) : type === "send" ? (
                                <IconButton
                                    aria-label="send email"
                                    onClick={handleSendClick}
                                >
                                    <SendIcon />
                                </IconButton>
                            ) : null}
                        </InputAdornment>
                    ),
                    ...inputProps.InputProps,
                }}
                onMouseDown={readOnly ? (event) => event.preventDefault() : undefined}
            />
        </ThemeProvider>
    );
};

export default InputField;
