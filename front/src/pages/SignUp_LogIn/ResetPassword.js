import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import './Reg.css';
import InputField from './InputField';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';




const ResetPassword = ({ toggleForm }) => {
    const { register, handleSubmit, formState: { errors } } = useForm();
    const [isValidEmail, setIsValidEmail] = useState(false);
    const navigate = useNavigate();

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
                        type="text"
                        placeholder="Email"
                        register={register("email", {
                            required: "Email is required.",
                            pattern: {
                                value: /^[^@ ]+@[^@ ]+\.[^@ .]{2,}$/,
                                message: "Email is not valid.",
                            },
                        })}
                        errors={errors.email}
                    />
                    
                    {errors.email && <p className="errorMsg">{errors.email.message}</p>}
                    
                    <div className='larger-text'>
                        {isValidEmail && (
                            <p href="#">If you have a user with us, a new password will be sent to your email.</p>
                        )}
                    </div>
                    
                    {!isValidEmail && (
                        <div className='small-text'>
                            <Link to="/login" className="forgot-password-link">Log In</Link>
                        </div>
                    )}
                    
                    <div className='purple'>
                        {isValidEmail ? (
                            <button type='button' onClick={() => navigate('/login')}>Log In</button>
                        ) : (
                            <button type="submit">Reset Password</button>
                        )}
                    </div>
                </form>
            </div> 
        </div>
    );
};

export default ResetPassword;
