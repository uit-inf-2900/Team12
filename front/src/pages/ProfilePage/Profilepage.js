import React, { useState } from 'react';
import "../../GlobalStyles/main.css";
import './Profilepage.css'
import { useNavigate } from 'react-router-dom';
// import axios from 'axios';
import { Link } from 'react-router-dom';
import Image from "../../images/6.png";
import InputField from '../SignUp_LogIn/InputField'; 

const profilePage = ({userProfile}) => {
    const navigate = useNavigate();
    const { name = '', email = '', password = ''} = userProfile || {};
    const [showModal, setShowModal] = useState(false);
    const[modalMessage, setModalMessage] = useState('');

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

    return (
        <div className="profile-page-container">
            <div className="box dark">
                <div className="profile-image-container">
                    <img src={Image} alt="Profile" />
                </div>
                <p className="profile-name">Eline De Vito</p>   {/* {name} */}
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
            {showModal && (
                <div className="deleteacc">
                    <div className="deleteacc-content">
                        <div className="deleteacc-body">{modalMessage}</div>
                        {!modalMessage.startsWith('Goodbye') && (
                            <div className="deleteacc-footer">
                                <button onClick={handleCloseModal} className="light-button">No</button>
                                <button onClick={handleConfirmDelete} className="light-button">Yes</button>
                            </div>
                        )}
                    </div>
                </div>
            )}
            <div className="box light">
                <div className='infoText-small' style={{color: "black"}}> Name </div>
                <InputField
                    type= "text"
                    inputProps={{
                        value: name,
                        readOnly: true
                    }}
                />
                <div className='infoText-small' style={{color: "black"}}> Email </div>
                <InputField
                    type= "email"
                    inputProps={{
                        value: email,
                        readOnly: true
                    }}
                />
                <div className='infoText-small' style={{color: "black"}}> Password </div>
                <InputField
                    type= "password"
                    inputProps={{
                        value: password,
                        readOnly: true
                    }}
                />
                <div style={{flexGrow: 0.4}}></div>
                <div>
                    <button className='light-button' onClick={() => navigate('/editprofile')}>Edit</button>
                </div>
            </div>
        </div>
    );
};

export default profilePage