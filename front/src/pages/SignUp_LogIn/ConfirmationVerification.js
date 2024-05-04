import React, { useState } from 'react';
import axios from 'axios';
import {CustomButton} from "../../Components/Button";
import '../../GlobalStyles/BoxAndContainers.css';
import { Modal, Box } from '@mui/material';
import InputField from "../../Components/InputField";

const ConfirmationVerification = ({ isOpen, onClose, userToken }) => {
    // State for verification code
    const [verificationCode, setVerificationCode] = useState('');

    // If the modal is not open, return null
    if (!isOpen) return null;


    // Function to handle verification of user
    const handleVerify = async () => {
        try {
            const response = await axios.patch(`http://localhost:5002/verifyuser?UserToken=${userToken}&VerificationCode=${verificationCode}`);
            if (response.status === 200) {
                alert('User has been verified');
                onClose(); //  close the modal
            }
        } catch (error) {
            alert('Verification failed: ' + error.message);
        }
    };

    return (
        <Modal open={isOpen} onClose={onClose}>
            <Box className="box-container">
                <Box className="box light" sx={{ minWidth: '35rem', height: '15rem' }}>
                    <label htmlFor="verificationCode">verification code</label>
                    <InputField
                        label="verification code"
                        type="number"
                        value={verificationCode}
                        onChange={e => setVerificationCode(e.target.value)}
                    />
                    <CustomButton 
                        thememode="dark" 
                        onClick={handleVerify} 
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
