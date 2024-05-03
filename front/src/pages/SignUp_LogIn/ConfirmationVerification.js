import React from 'react';
import CustomButton from "../../Components/Button";
import '../../GlobalStyles/BoxAndContainers.css';
import { Modal, Box } from '@mui/material';
import InputField from "../../Components/InputField";


const ConfirmationVerification = ({ isOpen, onClose}) => {
    if (!isOpen) return null;

    return (
        <Modal open={isOpen} onClose={onClose}>
            <Box className="box-container">
                <Box className="box light" sx={{ minWidth: '35rem', height: '15rem' }}>
                <label htmlFor="yarn lenght">verification code</label>
                    <InputField
                        label="verification code"
                        type="number"
                    />
                    <CustomButton 
                        thememode="dark" 
                        onClick={onClose} 
                        style={{ minWidth: '15rem', height: '4rem' }}
                    >verify</CustomButton>
                    <CustomButton 
                        thememode="dark" 
                        onClick={onClose} 
                        style={{ minWidth: '15rem', height: '4rem' }}
                    >Close</CustomButton>
                </Box>
            </Box>
        </Modal>
    );
};

export default ConfirmationVerification;