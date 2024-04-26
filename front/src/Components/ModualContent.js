import React from "react";
import { Modal, Box } from "@mui/material";

const modalStyle = {
    position: 'absolute',
    top: '40%',
    left: '40%',
};


const contentStyle = {
    width: '100%', // Make the content take up full width
    height: '100%', // Make the content take up full height
    overflow: 'auto',
};

const ModalContent = ({ open, handleClose, infobox }) => (
    <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-title"
        aria-describedby="modal-description"
    >
        <Box sx={modalStyle}>
            <Box sx={contentStyle}>
                {infobox}
            </Box>
        </Box>
    </Modal>
);

export default ModalContent;
