import React from 'react';
import '../SignUp_LogIn/Reg.css';
import './ProfilePage.css'
// import axios from 'axios';
import { Link } from 'react-router-dom';
import Image from "../../images/6.png";

const profilePage = ({toggleForm}) => {
    // const { username, name, email} = userProfile
    

    return (
        <div className="profile-page-container">
            <div className="box dark">
                <div className="profile-image-container">
                    <img src={Image} alt="Profile" />
                </div>
                {/* <p className="profile-name">{`${name}`}</p> */}
                <div style={{flexGrow: 1}}></div>
                <p className="profile-options">My Profile</p>
                <p className="profile-options">Wishlist</p>
                <div style={{flexGrow: 2}}></div>
                <div className='infoText-small'>
                    <Link to="/contactus" style={{color: "black", borderBottom: '1px solid'}}>Contact Us</Link>
                </div>
                <div style={{flexGrow: 0.2}}></div>
                <div className='infoText-small' style={{color: "black", borderBottom: '1px solid'}}> Delete account</div>
            </div>
            <div className="box light">
                <p className="profile-info">Username: </p>
                <p className="profile-info">Name: </p>
                <p className="profile-info">Email: </p>
                <p className="profile-info">Password: </p>
            </div>
        </div>
    );
};

export default profilePage