import React, { useState } from 'react';
import axios from 'axios';
import {CustomButton} from "../../Components/Button";
import '../../GlobalStyles/BoxAndContainers.css';
import { Modal, Box } from '@mui/material';
import InputField from "../../Components/InputField";
import { useNavigate } from 'react-router-dom'; 

const ConfirmationVerification = ({ isOpen, onClose, userToken, navigation }) => {
    // State for verification code
    const [verificationCode, setVerificationCode] = useState('');
    const navigate = useNavigate(); // Bruke useNavigate for navigasjon

    if (!isOpen) return null;

    const handleVerify = async () => {
        try {
            const response = await axios.patch(`http://localhost:5002/verifyuser?UserToken=${userToken}&VerificationCode=${verificationCode}`);
            console.log("Verification response:", response);
            if (response.status === 200 ) {
                console.log("Verification successful, updating session storage.");
                sessionStorage.setItem('isVerified', 'verified');
                alert('User has been verified and token updated');
                onClose(); // Ensure this function does not perform navigation.
                console.log("Navigating to home page...");
                if (navigation)
                { navigate(navigation);}
                else { window.location.href = '/'; }
            } else {
                console.log("Verification failed with status:", response.status);
                alert('Verification failed: Please try again or contact support.');
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
                        onClose={onClose}
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
