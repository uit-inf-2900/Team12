import React from 'react';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import IconButton from '@mui/material/IconButton';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import Theme from './Theme';
import { ThemeProvider } from '@mui/material/styles';

const InputField = ({ label, register, errors, type, readOnly, ...inputProps }) => {
    // Chechk the type, state for passwors visabilit and toggle password visibility
    const isPassword = type === "password";
    const [showPassword, setShowPassword] = React.useState(false);
    const togglePasswordVisibility = () => setShowPassword(!showPassword);

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
                    endAdornment: isPassword && !readOnly ? (
                        <InputAdornment position="end">
                            <IconButton
                                aria-label="toggle password visibility"
                                onClick={togglePasswordVisibility}
                                // edge="end"
                            >
                                {showPassword ? <VisibilityOff /> : <Visibility />}
                            </IconButton>
                        </InputAdornment>
                    ) : null                                        // Don't show eye icon for non-password input fields or readOnly input fields
                }}
                // Conditionally remove cursor pointer based on readOnly state
                onMouseDown={readOnly ? (event) => event.preventDefault() : undefined}
            />
        </ThemeProvider>
    );
};

export default InputField;
