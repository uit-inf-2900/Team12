import React from 'react';
import { TextField, MenuItem, InputAdornment, IconButton } from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';



/**
 * InputField component renders various types of input fields, including text, password, select, and send.
 */
const InputField = ({
    label, register, errors, type, readOnly, onSubmit, value, onChange, options = [], ...inputProps
}) => {
    // Components for the password field to show/hide the password 
    // and the send button to send the form
    const isPassword = type === "password";
    const [showPassword, setShowPassword] = React.useState(false);
    const togglePasswordVisibility = () => setShowPassword(!showPassword);


    /**
     * Handle click on send button
     * */ 
    const handleSendClick = (event) => {
        if (errors) {
            return;
        }
        else if (onSubmit) {
            event.preventDefault();
            onSubmit();
        }
    };

    return (
        <TextField
            color='secondary'
            {...register}
            {...inputProps}

            // Toggle password visibility if it's a password field and visibility icon is clicked
            type={isPassword && showPassword ? "text" : type}
            label={label}
            error={!!errors}
            helperText={errors ? errors.message : ''}
            variant="outlined"
            margin="dense"
            fullWidth
            onChange={onChange}
            value={value}

            // Render as select input if type is select
            select={type === "select"}
            InputProps={{
                readOnly: readOnly,
                // Add end adornment (icon at the end of input field)
                endAdornment: (
                <InputAdornment position="end">
                    {isPassword ? (
                         // Render visibility icon for password field
                        <IconButton aria-label="Toggle password visibility" onClick={togglePasswordVisibility}>
                            {showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                    ) : type === "send" ? (
                        // Render send button for send type input
                        <IconButton onClick={handleSendClick}>
                            <SendIcon />
                        </IconButton>
                    ) : null}
                </InputAdornment>
                ),
                ...inputProps.InputProps,
            }}
            >

            {/* Render menu items for select type input */}
            {type === "select" && options.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                {option.label}
                </MenuItem>
            ))}
        </TextField>
    );
};

export default InputField;
