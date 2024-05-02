import React from 'react';
import '../GlobalStyles/Modal.css';
import CustomButton from "../Components/Button";
import '../GlobalStyles/BoxAndContainers.css';

const ConfirmationModal = ({ isOpen, onClose, onConfirm, message }) => {
    if (!isOpen) return null;

    return (
        <div className="modal-overlay">
            <div className="box-container">
                <div className="box light" style={{minWidth: '35rem', height: '15rem',
                        }}>
                    <h4> Are you sure you want to log out? </h4>
                    <CustomButton
                    thememode="dark"
                    onClick={onConfirm}
                    style={{
                        marginTop: '2rem',
                        minWidth: '15rem',
                        height: '15rem',
                    }}
                    >Yes</CustomButton>
                    <CustomButton
                    thememode="dark"
                    onClick={onClose}
                    style={{
                        minWidth: '15rem',
                        height: '15rem',
                    }}
                    >No</CustomButton>
                </div>
            </div>
        </div>
    );
};

export default ConfirmationModal;
