import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, Link } from 'react-router-dom';
import validator from 'validator';
import axios from 'axios';
import '../ProfilePage/Profilepage.css'

import "../../GlobalStyles/main.css";
import { CustomButton } from '../../Components/UI/Button';
import InputField from '../../Components/UI/InputField';
import ConfirmationVerification from './ConfirmationVerification';

/**
 * The LogIn component provides a user interface for authentication. 
 * It includes form validation, navigation upon successful login, and handling of login errors.
 */
const LogIn = () => {
    const navigate = useNavigate();
    const [error, setError] = useState(''); 
    const [isVerified, setIsVerified] = useState('verified'); // Anta at brukeren er verifisert til det motsatte er bevist
    const { register, handleSubmit, formState: { errors } } = useForm();


    /**
     * Handles the submission of the login form.
     * Posts the user's credentials to the server and processes the response.
     * @param {Object} data - The user's login data.
     */
    const onSubmit = (data) => {
        const postData = {
            userEmail: data.email,
            userPwd: data.password
        }

        axios.post('http://localhost:5002/login', postData)
        .then(function(response){
            sessionStorage.setItem('token', response.data.token);
            sessionStorage.setItem('isVerified', response.data.userStatus);
            setIsVerified(response.data.userStatus);  // Update the state based on the server response
            
            if (response.data.userStatus === 'verified') {
                window.location.href = '/';  // Redirect to homepage if verifiedt
            }
        })
        .catch(function(error){
            console.error("Error: ", error);
            handleLoginError(error);
        });
    };


    /**
     * Provides error handling for the login process.
     * Sets appropriate error messages based on different failure conditions.
     */
    const handleLoginError = (error) => {
        if (error.response.status === 401) {
            if (error.response.data === "User is banned") {
                setError("Your account has been banned. Please contact the administrator for more information.");
            } else {
                setError("Login failed. Check your username and password and try again.");
            }
        } else {
            setError("Login failed. Please try again later.");
        }
    };


    /** Close the verification modal and redirect to homepage even if the user is not verified */
    const closeHandler = () => {
        window.location.href = '/'; 
    };

    return (
        <div className='profile-page-container'>
            <div className="box-container" style={{flex: '1', maxWidth: '900px', minWidth: '300px', minHeight: '400px'}}>
                <div className="box light">
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <h2>Welcome back!</h2>
                        <InputField
                            label="Email"
                            type="email"
                            register={register("email", {
                                required: "Email is required",
                                validate: (input) => validator.isEmail(input) || "Invalid email address"
                            })}
                            errors={errors.email}
                            aria-label="Email"
                            data-testid="email-input"
                        />
                        <InputField
                            label="Password"
                            type="password"
                            register={register("password", { required: "Password is required" })}
                            errors={errors.password}
                            aria-label="Password"
                            data-testid="password-input"
                        />
                        <CustomButton themeMode="light" iconName="login" submit={true}>Log In</CustomButton>
                        {error && <div className="errorMsg">{error}</div>}
                    </form>
                </div>

                <div className="box dark">
                    <h2>Hello, Knitter!</h2>
                    <p>Enter your personal details and start journey with us</p>
                    <CustomButton themeMode="dark" onClick={() => navigate('/signup')}>Don't have an account? Sign Up</CustomButton>
                </div>
                {isVerified !== 'verified' && (
                    <ConfirmationVerification
                        isOpen={onSubmit}
                        onClose={closeHandler}
                        userToken={sessionStorage.getItem('token')}
                    />
                )}
            </div>
        </div>
    );
};

export default LogIn;
