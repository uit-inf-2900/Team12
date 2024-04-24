// ModalCard.js

import React from "react";
import { Modal, Box, Container } from "@mui/material";
import { Link } from "react-router-dom";
import { styled, css } from '@mui/system';
import exampleImage from '../images/reading.png';
import Card from "./Card";

const ModalCard = ({ isOpen, onClose, project }) => {
    return (
        <div>
            
            <Modal
            open={isOpen}
            onClose={onClose}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
        >
            <Container
            maxWidth="sm"
            >
            
                <Box sx={{ 
                width: 400,
                height: 600,
                position: 'fixed',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                bgcolor: 'background.paper',
                border: '2px solid #000',
                boxShadow: 24,
                p: 5,
            
            }}>
                <h2 id="modal-modal-title">{project.title}</h2>
                <p id="modal-modal-description">Status: {project.status}</p>
                {/* Add more project details here */}
                <img src={exampleImage} className="card-image" />
                
            {/* Add more buttons for routing here*/}
                <Link to="/about">
                    <button>About Us</button>
                </Link>
                <Link to="/contactus">
                    <button>Contact Us</button>
                </Link>

                <button onClick={onClose}>Close</button>

            </Box>
            </Container>
            
        </Modal>

        </div>
        
    );
};

export default ModalCard;
