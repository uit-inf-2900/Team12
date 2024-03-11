import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import './Reg.css';
import "../../Components/main.css";

import validator from 'validator';
import InputField from './InputField'; 
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';

const LogIn = ({ toggleForm, onForgotPasswordClick}) => {
    const navigate = useNavigate();
    const [error, setError] = useState(''); 
    const { register, handleSubmit, formState: { errors } } = useForm();
    
    // Function to handle the form submission
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
                window.location.href = '/';
                
            } else {
                console.log("No token received")
            }
        })
        .catch(function(error){
            console.error("Error: ", error); 
            setError("Login failed. Check your username and password and try again."); 
        })
    };

    return (
        <div className="box-container">
            <div className="box light">
                <form onSubmit={handleSubmit(onSubmit)}>
                    <h2>Welcome back!</h2>
                    <InputField
                        placeholder="Email"
                        type="email"
                        register={register("email", {
                        required: "Email is required",
                        validate: (input) => validator.isEmail(input) || "Invalid email address"
                        })}
                        errors={errors.email}
                        aria-label="Email"
                    />
                    <InputField
                        placeholder="Password"
                        type="password"
                        register={register("password", { required: "Password is required" })}
                        errors={errors.password}
                        aria-label="Password"
                    />
                    <div className='infoText-small'>
                        <Link to="/reset-password" className="forgot-password-link">Forgot password?</Link>
                    </div>

                    {/* Display an error message it something goes wrong  */}
                    <div>
                        {error && <div className="errorMsg">{error}</div>}
                        <button className="light-button"type="submit">Log In</button>
                    </div>
                </form>
            </div>

            <div className="box dark">
                <h2>Hello, Knitter!</h2>
                <p>Enter your personal details and start journey with us</p>
                <div>
                    <button className='dark-button' onClick={() => navigate('/signup')}>Don't have an account? Sign Up</button>
                </div>
            </div>
        </div>
    );
};


export default LogIn;

