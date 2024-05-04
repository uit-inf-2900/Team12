import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, Link } from 'react-router-dom';
import validator from 'validator';
import axios from 'axios';

import "../../GlobalStyles/main.css";
import { CustomButton } from '../../Components/Button';
import InputField from '../../Components/InputField';
import ConfirmationVerification from './ConfirmationVerification'; // Pass på riktig sti til denne komponenten

/**
 * LogIn component renders the login form.
 */
const LogIn = () => {
    const navigate = useNavigate();
    const [error, setError] = useState(''); 
    const [isVerified, setIsVerified] = useState('verified'); // Anta at brukeren er verifisert til det motsatte er bevist
    const { register, handleSubmit, formState: { errors } } = useForm();

    const onSubmit = (data) => {
        const postData = {
            userEmail: data.email,
            userPwd: data.password
        }

        axios.post('http://localhost:5002/login', postData)
        .then(function(response){
            sessionStorage.setItem('token', response.data.token);
            sessionStorage.setItem('isVerified', response.data.userStatus);
            setIsVerified(response.data.userStatus);  // Oppdater tilstanden basert på svaret fra serveren
            
            if (response.data.userStatus === 'verified') {
                window.location.href = '/';  // Naviger til hjemmesiden hvis verifisert
            }
        })
        .catch(function(error){
            console.error("Error: ", error);
            if (error.response) {
                setError(`Login failed: ${error.response.data.message || 'Please try again later.'}`);
            }
        })
    };

    const closeHandler = () => {
        window.location.href = '/'; // Tillater navigering til hjemmesiden selv om ikke verifisert
    };

    return (
        <div className="box-container">
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
    );
};

export default LogIn;
