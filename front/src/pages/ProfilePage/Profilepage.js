import React, { useState, useEffect } from 'react';
import "../../GlobalStyles/main.css";
import './Profilepage.css'
import { Link } from 'react-router-dom';
import axios from 'axios';
import Image from "../../images/6.png";
import InputField from '../../Components/InputField';
import ModalContent from '../../Components/ModualContent';
import CustomButton from '../../Components/Button';
import SetAlert from '../../Components/Alert';

const ProfilePage = () => {
    // State to toggle between edit and view mode
    const [isEditing, setIsEditing] = useState(false);

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
    const [modalMessage, setModalMessage] = useState('');

    // For the user to see alert messages 
    const [alertInfo, setAlertInfo] = useState({
        open: false,
        severity: 'error',
        message: ''
    });
    

    // Fetch user profile data on page load
    useEffect(() => {
        const token = sessionStorage.getItem('token');
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
        if (!editState.userFullName || !editState.userEmail) {
            setAlertInfo({
                open: true,
                severity: 'error',
                message: 'Full name and email cannot be empty.'
            });
            return;
        }

        if (editState.newPassword !== editState.confirmNewPassword) {
            setAlertInfo({
                open: true,
                severity: 'error',
                message: 'Passwords do not match.'
            });
            return;
        }
    
        const token = sessionStorage.getItem('token');
        const payload = {
            token: token,
            userFullName: editState.userFullName,
            userEmail: editState.userEmail,
            oldPassword: editState.oldPassword,
            newPassword: editState.newPassword
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
                setAlertInfo({
                    open: true,
                    severity: 'error',
                    message: 'Failed to update profile.'
                })
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
        setShowModal(true);
        // TODO: Implement real account deletion here
        setModalMessage('Are you sure you want to delete your account? Everything will be lost.');
    };

    // Handle close modal
    const handleCloseModal = () => {
        setShowModal(false);
    };

    // Handle confirm delete
    const handleConfirmDelete = () => {
        setShowModal(false);
        // Implement real account deletion here
    };

    // Modal content for delete account 
    const deleteAccountContent = (
        <div className='box light'>
            <div className="deleteacc-body">{modalMessage}</div>
            {!modalMessage.startsWith('Goodbye') && (
                <div className="deleteacc-footer">
                    <CustomButton themeMode="light" onClick={handleConfirmDelete}>Yes</CustomButton>
                    <CustomButton themeMode="light" onClick={handleCloseModal}>No</CustomButton>
                </div>
            )}
        </div>
    );


    return (
        <div className="profile-page-container">
            {/* The left side of the profile page */}
            <div className="box dark">
                <div className="profile-image-container">
                    <img src={Image} alt="Profile" />
                </div>
                <p className="profile-name" style={{fontSize: '24px'}}>
                    {profileFetchError || userProfileState.userFullName || 'Loading...'}
                </p>
                <div style={{flexGrow: 1}}></div>
                <p className="profile-options" style={{fontWeight: 'bold'}}>My Profile</p>
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
            <ModalContent
                open={showModal}
                handleClose={handleCloseModal}
                infobox={deleteAccountContent}
            />
            {/* The right side of the profile page. Can be either view mode or edit mode*/}
            <div className="box light">
                {profileFetchError ? (
                    <p className="error-message">{profileFetchError}</p>
                ) : isEditing ? (
                    <>
                        <h2>Edit your information</h2>
                        <InputField label="Full Name" type="text" name="userFullName" value={editState.userFullName} onChange={handleChange} />
                        <InputField label="Email" type="email" name="userEmail" value={editState.userEmail} onChange={handleChange} />
                        <InputField label="Old Password" type="password" name="oldPassword" value={editState.oldPassword} onChange={handleChange} />
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
    );
};

export default ProfilePage;
