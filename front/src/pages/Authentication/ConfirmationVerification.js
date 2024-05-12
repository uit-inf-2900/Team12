import React, { useState } from 'react';
import axios from 'axios';
import { Modal, Box, Typography } from '@mui/material';
import Tooltip from '@mui/material/Tooltip';
import '../../GlobalStyles/BoxAndContainers.css';
import {CustomButton} from "../../Components/UI/Button";
import InputField from "../../Components/UI/InputField";
import { useNavigate } from 'react-router-dom'; 

/**
 * A modal component that handles user verification with a code.
 * @param {Object} props - Component props
 * @param {boolean} props.isOpen - If true, the modal is visible
 * @param {function} props.onClose - Function to call on closing the modal
 * @param {string} props.userToken - Token for user verification
 * @param {string} [props.navigation] - Path to navigate on successful verification
 */
const ConfirmationVerification = ({ isOpen, onClose, userToken, navigation }) => {
    const [verificationCode, setVerificationCode] = useState('');
    const [isHovering, setIsHovering] = useState(false); 
    const navigate = useNavigate(); 

    // Avoid rendering the modal if it should not be open
    if (!isOpen) return null;

    /**
     * Attempts to verify the user with a specified code.
     */
    const handleVerify = async () => {
        try {
            const response = await axios.patch(`http://localhost:5002/verifyuser?UserToken=${userToken}&VerificationCode=${verificationCode}`);
            console.log("Verification response:", response);

            if (response.status === 200 ) {
                console.log("Verification successful, updating session storage.");
                sessionStorage.setItem('isVerified', 'verified');
                sessionStorage.setItem('token', response.data);
                alert('User has been verified and token updated');
                onClose();
                console.log("Navigating to home page...");

                // If navigation is specified, navigate to the specified path by using the useNavigate hook
                // Otherwise, redirect to the home page using the window.location.href property to make sure the page is reloaded
                if (navigation)
                    {navigate(navigation);}
                else { window.location.href = '/'; }
            } else {
                console.log("Verification failed with status:", response.status);
                alert('Verification failed: Please try again or contact support.');
            }
        } catch (error) {
            alert('Verification failed: ' + error.message);
        }
    };
    const tooltipStyles = { 
        fontSize: '0.8rem', 
        font: '"Rigot", sans-serif'
    };

    return (
        <Modal open={isOpen} onClose={onClose}>
            <Box className="popup-box-container">
                <Box className="box light" sx={{ minWidth: '35rem', height: '15rem' }}>
                    <h2 htmlFor="verificationCode">Verification code</h2>
                    <Typography variant="body1">Please enter the verification code sent to your email.</Typography>
                    <Typography variant="body2">If you did not receive any message, please contact support.</Typography>
                    <br />
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
                    
                    {/* Custom Tooltip to show message */}
                    <Tooltip open={isHovering} title="You can verify your user the next time you log in, or on your profile"  componentsProps={{ tooltip: { sx: tooltipStyles } }}>
                        <div onMouseEnter={() => setIsHovering(true)} onMouseLeave={() => setIsHovering(false)}>
                            <CustomButton 
                                thememode="dark" 
                                onClick={onClose} 
                                style={{ minWidth: '15rem', height: '4rem' }}
                            >Close</CustomButton>
                        </div>
                    </Tooltip>
                </Box>
            </Box>
        </Modal>
    );
};

export default ConfirmationVerification;
