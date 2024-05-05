import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, Link } from 'react-router-dom';

import "../../GlobalStyles/main.css";
import InputField from '../../Components/InputField';
import { CustomButton } from '../../Components/Button';



/**
 *  ResetPassword component to render the reset password form. 
 */
const ResetPassword = () => {
    const { register, handleSubmit, formState: { errors } } = useForm();
    const [isValidEmail, setIsValidEmail] = useState(false);
    const navigate = useNavigate();


    /**
     * Handle form submission
     */ 
    const onSubmit = (data) => {
        console.log('Forgot Password Data', data);
        const isEmailValid = /^[^@ ]+@[^@ ]+\.[^@ .]{2,}$/.test(data.email);
        setIsValidEmail(isEmailValid);
    };  

    return (
        <div className="box-container">
            <div className="box light">
                <form onSubmit={handleSubmit(onSubmit)}>
                    <h2>Reset password</h2>
                    
                    {/* Use the InputField component for email input */}
                    <InputField
                        type="email"
                        label="Email"
                        register={register("email", {
                            required: "Email is required.",
                            pattern: {
                                value: /^[^@ ]+@[^@ ]+\.[^@ .]{2,}$/,
                                message: "Email is not valid.",
                            },
                        })}
                        errors={errors.email}
                    />
                                        
                     {/* Display message if email is valid */}
                    <div className='infoText-small'>
                        {isValidEmail && (
                            <p href="#"> 
                                If you have a user with us, a new password will be sent to your email.
                                </p>
                        )}
                    </div>
                    
                     {/* Display link to login page if email is not valid */}
                    {!isValidEmail && (
                        <div className='infoText-small'>
                            <Link to="/login" className="forgot-password-link">Log In</Link>
                        </div>
                    )}
                    
                    {/* Render appropriate button based on email validity */}
                    <div>
                        {isValidEmail ? (
                            <CustomButton themeMode="light" onClick={() => navigate('/login')}>Log In</CustomButton>
                        ) : (
                            <CustomButton themeMode="light" submit={true} iconName="reset">Reset Password</CustomButton>
                        )}
                    </div>
                </form>
            </div> 
        </div>
    );
};

export default ResetPassword;
