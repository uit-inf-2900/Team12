import React from 'react';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import IconButton from '@mui/material/IconButton';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import theme from './Theme';
import { ThemeProvider } from '@mui/material/styles';

const InputField = ({ label, register, errors, type, readOnly, ...inputProps }) => {
    const isPassword = type === "password";
    const [showPassword, setShowPassword] = React.useState(false);
    const togglePasswordVisibility = () => setShowPassword(!showPassword);

    // Apply conditional styles based on readOnly state
    const inputStyle = readOnly ? {
        fontFamily: '"Rigot", sans-serif',
        backgroundColor: '#f7f7f7',
        caretColor: 'transparent', // Hide caret
    } : {
        fontFamily: '"Rigot", sans-serif',
        backgroundColor: '#f7f7f7',
    };

    return (
        <ThemeProvider theme={theme}>
            <TextField
                color='secondary'
                {...register}
                {...inputProps}
                type={isPassword && showPassword ? "text" : type}
                label={label}
                error={!!errors}
                helperText={errors ? errors.message : ''}
                variant="outlined"
                margin="dense"
                fullWidth
                InputProps={{
                    readOnly: readOnly,
                    style: inputStyle,
                    endAdornment: isPassword && !readOnly ? (
                        <InputAdornment position="end">
                            <IconButton
                                aria-label="toggle password visibility"
                                onClick={togglePasswordVisibility}
                                edge="end"
                            >
                                {showPassword ? <VisibilityOff /> : <Visibility />}
                            </IconButton>
                        </InputAdornment>
                    ) : null
                }}
                // Conditionally remove cursor pointer based on readOnly state
                onMouseDown={readOnly ? (event) => event.preventDefault() : undefined}
            />
        </ThemeProvider>
    );
};

export default InputField;
