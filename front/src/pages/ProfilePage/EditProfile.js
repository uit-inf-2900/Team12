import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import InputField from '../SignUp_LogIn/InputField';
import './Profilepage.css';

const EditProfile = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        NewPassword: '',
        OldPassword: '',
        UserEmail: '',
        UserFullName: ''
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevFormData => ({
            ...prevFormData,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const token = sessionStorage.getItem('token');
        const address = 'http://localhost:5002/updateprofileinfo';
        console.log(address);
    
        if (token) {
            const payload = {
                NewPassword: formData.NewPassword,
                OldPassword: formData.OldPassword,
                UserEmail: formData.UserEmail,
                UserFullName: formData.UserFullName,
                jwtToken: token
            };
            console.log("Payload: ", payload);
            
            axios.patch('http://localhost:5002/updateprofileinfo', payload)
            .then(response => {
                console.log("Profile Updated:", response.data);
                navigate('/profile');
            })
            .catch(error => {
                console.error("Error updating profile data: ", error);
            });
        } else {
            console.error("No token found. Please log in.");
        }
        console.log("Token:", token);
    };

    return (
        <div className="profile-page-container">
            <div className='box light'>
                <form onSubmit={handleSubmit}>
                    <div className='infoText-small' style={{color: "black"}}> Name </div>
                    <InputField
                        type="text"
                        name='UserFullName'
                        inputprops={{
                            value: formData.UserFullName,
                            onChange: handleChange
                        }}
                    />
                    <div className='infoText-small' style={{color: "black"}}> Email </div>
                    <InputField
                        type="email"
                        name='UserEmail'
                        inputprops={{
                            value: formData.UserEmail,
                            onChange: handleChange
                        }}
                    />
                    <div className='infoText-small' style={{color: "black"}}> Old Password </div>
                    <InputField
                        type="password"
                        name='OldPassword'
                        inputprops={{
                            value: formData.OldPassword,
                            onChange: handleChange
                        }}
                    />
                    <div className='infoText-small' style={{color: "black"}}> New Password </div>
                    <InputField
                        type="password"
                        name='NewPassword'
                        inputprops={{
                            value: formData.NewPassword,
                            onChange: handleChange
                        }}
                    />
                    <button type='submit' className='light-button'>Save changes</button>
                </form>
            </div>
        </div>
    );
};

export default EditProfile;