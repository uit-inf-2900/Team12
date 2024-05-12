import React, { useState, useEffect } from 'react';
import "../../GlobalStyles/main.css";
import './Profilepage.css'
import { Link } from 'react-router-dom';
import axios from 'axios';
import Image from "../../images/6.png";
import InputField from '../../Components/UI/InputField';
import ModalContent from '../../Components/Forms/ModualContent';
import { CustomButton } from '../../Components/UI/Button';
import SetAlert from '../../Components/UI/Alert';
import { Modal, Box } from '@mui/material';
import '../../GlobalStyles/BoxAndContainers.css';
import ConfirmationVerification from '../Authentication/ConfirmationVerification';



const ProfilePage = () => {
    // State to toggle between edit and view mode
    const [isEditing, setIsEditing] = useState(false);
    const [showVerificationModal, setShowVerificationModal] = useState(false);  // State to control visibility of the verification modal

    // State to store user profile data
    const [userProfileState, setUserProfileState] = useState({
        userFullName: '',
        userEmail: '',
    });

    // State to store edit form data. 
    // This is separate from userProfileState to avoid updating the state on every keystroke
    const [editState, setEditState] = useState({
        userFullName: '',
        userEmail: '',
        oldPassword: '',
        newPassword: '',
        confirmNewPassword: ''
    });

    // State to store error message, show modal and modal message
    const [profileFetchError, setProfileFetchError] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [showConfirmationModal, setShowConfirmationModal] = useState(true);

    const handleCloseConfirmationModal = () => {
        setShowConfirmationModal(false);
    };

    // For the user to see alert messages 
    const [alertInfo, setAlertInfo] = useState({
        open: false,
        severity: 'error',
        message: ''
    });
    

    // Fetch user profile data on page load
    const isVerified = sessionStorage.getItem('isVerified');
    const token = sessionStorage.getItem('token');
    useEffect(() => {
        if (token) {
            const fetchData = async () => {
                try {
                    const response = await axios.get(`http://localhost:5002/getprofileinfo?userToken=${token}`);
                    setUserProfileState({
                        userFullName: response.data.userFullName,
                        userEmail: response.data.userEmail
                    });
                    setEditState({
                        userFullName: response.data.userFullName,
                        userEmail: response.data.userEmail,
                        oldPassword: '',
                        newPassword: '',
                        confirmNewPassword: ''
                    });
                } catch (error) {
                    console.error("Error fetching profile data: ", error);
                    setProfileFetchError("Failed to fetch profile data.");
                }
            };
            fetchData();
        }
    }, []);


    // Toggle between edit and view mode
    const handleEditToggle = () => {
        setIsEditing(!isEditing);
    };

    // Save the updated profile data
    const handleSave = async () => {
        // Check if full name, email, or old password is empty
        if (!editState.userFullName || !editState.userEmail || !editState.oldPassword) {
            setAlertInfo({
                open: true,
                severity: 'error',
                message: 'Full name, email, and current password must all be provided.'
            });
            return;
        }
    
        // Handle password update logic
        let newPasswordToSend = editState.newPassword;
        if (editState.newPassword === '') {
            if (editState.confirmNewPassword === '') {
                newPasswordToSend = editState.oldPassword;
            } else {
                setAlertInfo({
                    open: true,
                    severity: 'error',
                    message: 'New password is empty but confirm password is not.'
                });
                return;
            }
        } else if (editState.newPassword !== editState.confirmNewPassword) {
            setAlertInfo({
                open: true,
                severity: 'error',
                message: 'Passwords do not match.'
            });
            return;
        }
    
        const payload = {
            token: token,
            userFullName: editState.userFullName,
            userEmail: editState.userEmail,
            oldPassword: editState.oldPassword,
            newPassword: newPasswordToSend
        };
    
        try {
            const response = await axios.patch('http://localhost:5002/updateprofileinfo', payload);
            if (response.status === 200) {
                setUserProfileState({
                    userFullName: editState.userFullName,
                    userEmail: editState.userEmail
                });
                setProfileFetchError(""); // Clear any existing errors
                setIsEditing(false);
                setAlertInfo({
                    open: true,
                    severity: 'success',
                    message: 'Profile updated successfully.'
                });
            } else {
                throw new Error('Failed to update profile');
            }
        } catch (error) {
            console.error("Error updating profile data: ", error);
            setProfileFetchError("Failed to update profile data.");
            setAlertInfo({
                open: true,
                severity: 'error',
                message: 'Failed to update profile data.'
            });
        }
    };
    
    


    // Handle input field changes and update the state
    const handleChange = (e) => {
        const { name, value } = e.target;
        setEditState(prev => ({
            ...prev,
            [name]: value
        }));
    };

    // Handle delete account click
    const handleDeleteClick = () => {
        if (token) {
            try {
                axios.delete(`http://localhost:5002/Users/deleteuser?userToken=${token}`);
                sessionStorage.removeItem('token');  // Assuming you're using session storage for token management
                setAlertInfo({
                    open: true,
                    severity: 'success',
                    message: 'Your account has been successfully deleted.'
                });
                setTimeout(() => {
                // Redirect to login or home
                window.location.href = '/login';
                }, 500);
            } catch (error) {
                console.error("Error fetching profile data: ", error);
                setProfileFetchError("Failed to fetch profile data.");
                setAlertInfo({
                    open: true,
                    severity: 'error',
                    message: 'Failed to delete account.'
                });
            }
        }
        setShowModal(false);
    };


    // Modal content for delete account 
    const deleteAccountContent = () => (
        <Modal open={showModal} onClose={() => setShowModal(false)}>
            <Box className="box-container">
                <Box className="box light" sx={{ minWidth: '35rem', height: '15rem' }}>
                    <h4>Are you sure you want to delete your account? Everything will be lost and it cannot be undone.</h4>
                    <CustomButton
                        thememode="dark"
                        onClick={handleDeleteClick}
                        style={{ marginTop: '2rem', minWidth: '15rem', height: '4rem' }}
                    >Yes</CustomButton>
                    <CustomButton 
                        thememode="dark" 
                        onClick={() => setShowModal(false)}
                        style={{ minWidth: '15rem', height: '4rem' }}
                    >No</CustomButton>
                </Box>
            </Box>
        </Modal>
    );

    const handleDelete = () => {
        setShowModal(true);
    }


    return (
        <div className="profile-page-container">
            {/* The left side of the profile page */}
            <div className='box-container' style={{height:'50%', width:'90%'}}>

                <div className="box dark">
                    <div className="profile-image-container">
                        <img src={Image} alt="Profile" />
                    </div>
                    <p className="profile-name" style={{fontSize: '24px'}}>
                        {profileFetchError || userProfileState.userFullName || 'Loading...'}
                    </p>
                    <div style={{flexGrow: 1}}></div>
                    <p className="profile-options" style={{fontWeight: 'bold'}}>My Profile</p>

                    {/* If the user are not verified, show a button with the option to verify */}
                    {isVerified !== 'verified' && (
                        <>
                        <CustomButton onClick={() => setShowVerificationModal(true)} themeMode="dark">
                            Verify User
                        </CustomButton>
                        <ConfirmationVerification
                            navigation={"/profile"}
                            isOpen={showVerificationModal}
                            onClose={() => setShowVerificationModal(false)}
                            userToken={token}
                            />
                    </>
                    )}

                    <div style={{flexGrow: 2}}></div>
                    <div className='infoText-small'>
                        <Link to="/contactus" style={{color: "black", borderBottom: '1px solid'}}>Contact Us</Link>
                    </div>
                    <div style={{flexGrow: 0.2}}></div>
                    <div onClick={handleDelete} className='infoText-small' style={{color: "black", borderBottom: '1px solid', cursor: 'pointer'}}>
                        Delete account
                    </div>
                </div>
                <ModalContent
                    open={showModal}
                    handleClose={() => setShowModal(false)}
                    infobox={deleteAccountContent()}
                    />
                {/* The right side of the profile page. Can be either view mode or edit mode*/}
                <div className="box light" >
                    {profileFetchError ? (
                        <p className="error-message">{profileFetchError}</p>
                        ) : isEditing ? (
                            <>
                            <h2>Edit your information</h2>
                            <InputField label="Full Name" type="text" name="userFullName" value={editState.userFullName} onChange={handleChange} />
                            <InputField label="Email" type="email" name="userEmail" value={editState.userEmail} onChange={handleChange} />
                            <InputField label="Current Password" type="password" name="oldPassword" value={editState.oldPassword} onChange={handleChange} />
                            <InputField label="New Password" type="password" name="newPassword" value={editState.newPassword} onChange={handleChange} />
                            <InputField label="Confirm New Password" type="password" name="confirmNewPassword" value={editState.confirmNewPassword} onChange={handleChange} />
                            <CustomButton themeMode="light" iconName='save' onClick={handleSave}>Save Changes</CustomButton>
                            <CustomButton themeMode="light" onClick={handleEditToggle}>Cancel</CustomButton>
                        </>
                    ) : (
                        <>
                            <h2> My Account </h2>
                            <InputField label="Full Name" readOnly={true} type="text" value={userProfileState.userFullName} />
                            <InputField label="Email" readOnly={true} type="email" value={userProfileState.userEmail} />
                            <CustomButton themeMode="light" onClick={handleEditToggle} iconName="edit">Edit Profile</CustomButton>
                        </>
                    )}
                    <SetAlert
                        open={alertInfo.open}
                        setOpen={(isOpen) => setAlertInfo({ ...alertInfo, open: isOpen })}
                        severity={alertInfo.severity}
                        message={alertInfo.message}
                        />
                </div>
            </div>
        </div>
    );
};

export default ProfilePage;
