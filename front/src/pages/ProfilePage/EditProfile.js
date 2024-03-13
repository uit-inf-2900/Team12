import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import InputField from '../SignUp_LogIn/InputField';
import './Profilepage.css';

const EditProfile = ({ userProfile, onUpdateProfile }) => {
    const [formData, setFormData] = useState({
        ...userProfile,
        oldPassword: '', // Add oldPassword to your formData state
        newPassword: '', // Add newPassword to replace the direct usage of password
    });

    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevFormData => ({
            ...prevFormData,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        // Ideally, verify the old password with your backend before updating to the new one
        // For demonstration, this just logs and calls the onUpdateProfile prop (which you'll implement)
        console.log("Submitting new profile data:", formData);
        // Here you would actually call onUpdateProfile or similar function
        // For now, just navigate back to profile for demonstration
        navigate('/profile');
    };

    return (
        <div className="profile-page-container">
            <div className='box light'>
                <form onSubmit={handleSubmit}>
                    <div className='infoText-small' style={{color: "black"}}> Name </div>
                    <InputField
                        type="text"
                        register={{ name: 'name' }}
                        inputProps={{
                            
                            value: formData.name,
                            onChange: handleChange
                        }}
                    />
                    <div className='infoText-small' style={{color: "black"}}> Email </div>
                    <InputField
                        type="email"
                        register={{ name: 'email' }}
                        inputProps={{
                            
                            
                            value: formData.email,
                            onChange: handleChange
                        }}
                    />
                    <div className='infoText-small' style={{color: "black"}}> Old Password </div>
                    <InputField
                        type="password"
                        register={{ name: 'oldPassword' }} // Update to match the new state field
                        inputProps={{
                            name: 'oldPassword',
                            value: formData.oldPassword,
                            onChange: handleChange,
                        }}
                    />
                    <div className='infoText-small' style={{color: "black"}}> New Password </div>
                    <InputField
                        type="password"
                        register={{ name: 'newPassword' }} // Use the new state field for the new password
                        inputProps={{
                            name: 'newPassword',
                            value: formData.newPassword,
                            onChange: handleChange,
                        }}
                    />
                    <button className='light-button' onClick={() => navigate('/profile')}>Save changes</button>
                </form>
            </div>
        </div>
    );
};

export default EditProfile;