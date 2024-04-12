import React from 'react';
import { TextField, MenuItem, InputAdornment, IconButton, ThemeProvider } from '@mui/material';

import Theme from './Theme';
import SendIcon from '@mui/icons-material/Send';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
const InputField = ({
    label, register, errors, type, readOnly, onSubmit, value, onChange, options = [], ...inputProps
    }) => {
    const isPassword = type === "password";
    const [showPassword, setShowPassword] = React.useState(false);
    const togglePasswordVisibility = () => setShowPassword(!showPassword);

    const handleSendClick = (event) => {
        if (onSubmit) {
            event.preventDefault();
            onSubmit();
        }
    };

    return (
        <ThemeProvider theme={Theme}>
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
                onChange={onChange}
                value={value}
                select={type === "select"}  // Aktiverer select hvis typen er 'select'
                InputProps={{
                readOnly: readOnly,
                endAdornment: (
                <InputAdornment position="end">
                    {isPassword ? (
                    <IconButton onClick={togglePasswordVisibility}>
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                    ) : type === "send" ? (
                    <IconButton onClick={handleSendClick}>
                        <SendIcon />
                    </IconButton>
                    ) : null}
                </InputAdornment>
                ),
                ...inputProps.InputProps,
            }}
            >
                {type === "select" && options.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                    {option.label}
                    </MenuItem>
                ))}
            </TextField>
        </ThemeProvider>
    );
};

export default InputField;