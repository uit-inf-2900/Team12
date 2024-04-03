import React from 'react';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import IconButton from '@mui/material/IconButton';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import theme from './Theme';
import { createTheme, ThemeProvider } from '@mui/material/styles';

const InputField = ({ label, register, errors, type, ...inputProps }) => {
    // Determine if the input type is password to setup the password visibility toggle
    const isPassword = type === "password";
    const [showPassword, setShowPassword] = React.useState(false);
    const [focused, setFocused] = React.useState(false);
    const togglePasswordVisibility = () => setShowPassword(!showPassword);

    return (
        <div>
            <ThemeProvider theme={theme}>

            <TextField color='secondary'
                {...register}
                {...inputProps}
                type={isPassword && showPassword ? "text" : type}
                label={label}
                error={!!errors}
                helperText={errors ? errors.message : ''}
                variant="outlined"
                margin="dense"
                fullWidth
                onFocus={() => setFocused(true)}
                onBlur={() => setFocused(false)}
                InputProps={{
                    style: {
                        fontFamily: '"Rigot", sans-serif',
                        backgroundColor: '#f7f7f7',
                        },
                    endAdornment: isPassword ? (
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
                />
                </ThemeProvider>
        </div>
    );
};

export default InputField;
