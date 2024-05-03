import React from 'react';
import CustomButton from "../../Components/Button";
import '../../GlobalStyles/BoxAndContainers.css';
import { Modal, Box } from '@mui/material';

const ConfirmationLogout = ({ isOpen, onClose, onConfirm, message }) => {
    if (!isOpen) return null;

    return (
        <Modal open={isOpen} onClose={onClose}>
            <Box className="box-container">
                <Box className="box light" sx={{ minWidth: '35rem', height: '15rem' }}>
                    <h4>{message}</h4>
                    <CustomButton
                        thememode="dark"
                        onClick={onConfirm}
                        style={{ marginTop: '2rem', minWidth: '15rem', height: '4rem' }}
                    >Yes</CustomButton>
                    <CustomButton 
                        thememode="dark" 
                        onClick={onClose} 
                        style={{ minWidth: '15rem', height: '4rem' }}
                    >No</CustomButton>
                </Box>
            </Box>
        </Modal>
    );
};

export default ConfirmationLogout;