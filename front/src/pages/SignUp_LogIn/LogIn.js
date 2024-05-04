import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, Link } from 'react-router-dom';
import validator from 'validator';
import axios from 'axios';

import "../../GlobalStyles/main.css";
import { CustomButton } from '../../Components/Button';
import InputField from '../../Components/InputField';
import ConfirmationVerification from './ConfirmationVerification'; // Importer riktig sti til denne komponenten



/**
 * LogIn component renders the login form.
 */
const LogIn = () => {
    const navigate = useNavigate();
    const [error, setError] = useState(''); 
    const [isVerified, setIsVerified] = useState(true);
    const { register, handleSubmit, formState: { errors } } = useForm();
    
    /** Function to handle the form submission */ 
    const onSubmit = (data) => {
        const postData = {
            userEmail: data.email,
            userPwd: data.password
        }

        
        axios.post('http://localhost:5002/login', postData)
        .then(function(response){
            console.log("Response: ", response)
            
            if (response.data.token){
                // Store the token in sessionStorage and redirect the user to the home page
                sessionStorage.setItem('token', response.data.token)
                sessionStorage.setItem('isVerified', response.data.userStatus);
                setIsVerified(response.data.userStatus);  // Oppdater tilstanden basert på svaret fra serveren
                console.log("Token and isVerified stored in sessionStorage:", response.data.token, response.data.userStatus);
                
                if (response.data.userStatus) {
                    window.location.href = '/';
                }
            } else {
                console.log("No token received")
            }
        })
        .catch(function(error){
            console.error("Error: ", error); 
            // Handle login errors and display appropriate error message
            if (error.response.status === 401 && error.response.data === "User is banned" ){
                setError("Your account has been banned. Please contact the administrator for more information.");
            }
            else if (error.response.status === 401 ){
                setError("Login failed. Check your username and password and try again."); 
            } 
            else {
                setError("Login failed. Please try again later."); 
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

                    {/* InputField for Email */}
                    <InputField
                        label="Email"
                        type="email"
                        register={register("email", {
                        required: "Email is required",
                        validate: (input) => validator.isEmail(input) || "Invalid email address"
                        })}
                        errors={errors.email}
                        aria-label="Email"
                        data-testid = "email-input"
                    />

                    {/* InputField for Password */}
                    <InputField
                        label="Password"
                        type="password"
                        register={register("password", { required: "Password is required" })}
                        errors={errors.password}
                        aria-label="Password"
                        data-testid = "password-input"
                    />

                    {/* Link to forgot password page */}
                    <div className='infoText-small'>
                        <Link to="/reset-password" className="forgot-password-link">Forgot password?</Link>
                    </div>

                    {/* Display an error message it something goes wrong  */}
                    <div>
                        {error && <div className="errorMsg">{error}</div>}
                        <CustomButton themeMode="light" iconName="login" submit={true}>Log In</CustomButton>
                    </div>
                </form>
            </div>

            <div className="box dark">
                <h2>Hello, Knitter!</h2>
                <p>Enter your personal details and start journey with us</p>
                <div>
                    <CustomButton themeMode="dark" onClick={() => navigate('/signup')}>Don't have an account? Sign Up</CustomButton>
                </div>
            </div>
            {!isVerified && (
                <ConfirmationVerification
                    isOpen={!isVerified}
                    onClose={closeHandler}
                    userToken={sessionStorage.getItem('token')}
                />
            )}
        </div>
    );
};


export default LogIn;

