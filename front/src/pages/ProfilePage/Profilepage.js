import React, { useState, useEffect } from 'react';
import "../../GlobalStyles/main.css";
import './Profilepage.css'
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Link } from 'react-router-dom';
import Image from "../../images/6.png";
import InputField from '../../Components/InputField';
import EditIcon from '@mui/icons-material/Edit';
import Button from '@mui/material/Button';
import ModalContent from '../../Components/ModualContent';
import CustomButton from '../../Components/Button';


const profilePage = ({userProfile}) => {
    const navigate = useNavigate();
    const [userProfileState, setUserProfileState] = useState({ userFullName: '', userEmail: '' });
    const [profileFetchError, setProfileFetchError] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [modalMessage, setModalMessage] = useState('');

    const handleDeleteClick = () => {
        setShowModal(true);
        setModalMessage('Are you sure you want to delete your account? Everything will be lost.');
    };

    const handleCloseModal = () => {
        setShowModal(false);
    };

    const handleConfirmDelete = () => {
        setModalMessage('Goodbye');
        //insert backend to delete account


        setTimeout(() => {
            setShowModal(false)
            //redirect user or perform another state update
        }, 2000); //2 seconds delay
    };

    useEffect(() => {
        
        const token = sessionStorage.getItem('token');
        const address = 'http://localhost:5002/getprofileinfo?userToken=' + token;
        console.log(address);

        if (token) {
            axios.get(address, {
                params: {
                    userToken: token
                }
            })
            .then(response => {
                setUserProfileState(response.data);
            })
            .catch(error => {
                console.error("Error fetching profile data: ", error);
                if (error.response) {
                    // The request was made and the server responded with a status code
                    console.error("Backend responded with status code: ", error.response.status);
                    console.error("Backend responded with data: ", error.response.data);
                } else if (error.request) {
                    // The request was made but no response was received
                    console.error("No response received: ", error.request);
                } else {
                    // Something else happened in making the request that triggered an error
                    console.error('Error message: ', error.message);
                }
                setProfileFetchError("Failed to fetch profile data.");
            });
        }
    }, []);

    const deleteAccountContent = (
        <div className='box light'>
            <div className="deleteacc-body">{modalMessage}</div>
            {!modalMessage.startsWith('Goodbye') && (
                <div className="deleteacc-footer">
                    <CustomButton themeMode="light" onClick={handleConfirmDelete}>Yes</CustomButton>                            &nbsp;&nbsp;&nbsp;
                    <CustomButton themeMode="light" onClick={handleCloseModal}>No</CustomButton>                </div>
            )}
        </div>
    );
    
    return (
        <div className="profile-page-container">
            <div className="box dark">
                <div className="profile-image-container">
                    <img src={Image} alt="Profile" />
                </div>
                <p className="profile-name" style={{fontSize: '24px'}}>
                    {profileFetchError || userProfileState.userFullName || 'Loading...'}
                </p>
                <div style={{flexGrow: 1}}></div>
                <p className="profile-options" style = {{fontWeight: 'bold'}}>My Profile</p>
                <div className="profile-options">
                    <Link to="/wishlist" style={{color: "black"}}>Wishlist</Link>
                </div>
                <div style={{flexGrow: 2}}></div>
                <div className='infoText-small'>
                    <Link to="/contactus" style={{color: "black", borderBottom: '1px solid'}}>Contact Us</Link>
                </div>
                <div style={{flexGrow: 0.2}}></div>
                <div onClick={handleDeleteClick} className='infoText-small' style={{color: "black", borderBottom: '1px solid', cursor: 'pointer'}}>
                    Delete account
                </div>
            </div>
            {/* Using ModalContent to show the delete account confirmation */}
            <ModalContent
                open={showModal}
                handleClose={handleCloseModal}
                infobox={deleteAccountContent}
            />
            <div className="box light">
                {profileFetchError ? (
                    <p className="error-message">{profileFetchError}</p>
                ) : (
                    <>
                    <h2> Min konto </h2>
                        <InputField // Bruker InputField for navn
                            label="Full Name"
                            readOnly={true} // Sett til true siden dette er for visning
                            type="text"
                            value={userProfileState.userFullName || 'Loading...'} // Passer verdien til InputField
                        />
                        <div style={{ flexGrow: 0.1 }}></div>
                        <InputField // Bruker InputField for e-post
                            label="Email"
                            readOnly={true} // Sett til true siden dette er for visning
                            type="email"
                            value={userProfileState.userEmail || 'Loading...'} // Passer verdien til InputField
                        />
                        <div style={{ flexGrow: 0.2 }}></div>
                        <div>
                        <CustomButton themeMode="light" onClick={() => navigate('/editprofile')} iconName="edit">Edit Profile</CustomButton>                      
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default profilePage