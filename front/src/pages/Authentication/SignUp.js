import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

import "../../GlobalStyles/main.css";
import { CustomButton } from '../../Components/UI/Button';
import InputField from '../../Components/UI/InputField';
import ConfirmationVerification from './ConfirmationVerification';


/**
 * SignUp component for registering new users.
 * It handles user input validation, posts data to a server, and handles the response.
 * It also manages user verification status and displays a modal if further verification is needed.
 */
const SignUp = () => {
  const navigate = useNavigate();
  const { register, handleSubmit, formState: { errors }, watch } = useForm();
  const [error, setError] = useState(''); 
  const [isVerified, setIsVerified] = useState(false); // Start with assumption user is not verified
  const [showVerificationModal, setShowVerificationModal] = useState(false); // Controls the visibility of the modal


  /**
   * Handles form submission for new user registration.
   * Validates the form data, sends it to the server, and handles the server's response.
   * @param {Object} data - Contains user input data from the form.
   */
  const onSubmit = (data) => {
    if (data.password !== data.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    // Formats the date of birth by removing dashes
    const dob = data.birthday.replace(/-/g, '');

    const postData = {
      userEmail: data.email,
      userPwd: data.password,
      userFullName: data.Name,
      userDOB: dob
    };

    axios.post('http://localhost:5002/createuser', postData)
    .then(function(response) {
      sessionStorage.setItem('token', response.data.token);
      sessionStorage.setItem('isVerified', response.data.userStatus);
      setIsVerified(response.data.userStatus === 'verified');

      // Show verification modal if user is not verified, else navigate to home page if user is verified
      if (response.data.userStatus !== 'verified') {
        setShowVerificationModal(true);
      } else {
        window.location.href = '/';  // Redirect to homepage if verifiedt
      }
    })
    .catch(function(error) {
      console.error("Error: ", error);
      if (error.response && error.response.status === 409) {
        setError("A user with this email already exists");
      } else {
        setError("Something went wrong. Please try again later");
      }
    });
  };


  /**
   * Closes the verification modal and navigates to the homepage.
   */
  const closeHandler = () => {
    setShowVerificationModal(false);
    window.location.href = '/';  // Redirect to homepage if verifiedt
  };

  return (
    <div className='box-container' style={{paddingTop:'50px', paddingBottom:'50px'}}>
      <div className="box dark">
        <h2>Hello, Knitter!</h2>
        <p>Already have an account?</p>
        <CustomButton themeMode="dark" onClick={() => navigate('/login')}>Log in</CustomButton>
      </div>
      <div className="box light">
        <form onSubmit={handleSubmit(onSubmit)}>
          <h2>Sign Up!</h2>
          <InputField 
            label="Full name" 
            type="text" 
            register={register("Name", { required: "Name is required." })} 
            errors={errors.Name} 
          />
          <InputField 
            label="Email" 
            type="email" 
            data-testid="email-input" 
            register={register("email", {
              required: "Email is required.",
              pattern: { value: /^[^@ ]+@[^@ ]+\.[^@ .]{2,}$/, 
              message: "Email is not valid." }
            })} 
            errors={errors.email} />
          <InputField 
            label="Birthday" 
            type="date" 
            data-testid="Birthday-input" 
            register={register("birthday", {
              required: "Birthday is required (YYYY-MM-DD).",
              validate: value => /^\d{4}-\d{2}-\d{2}$/.test(value) || "Invalid date format (YYYY-MM-DD)"
            })} errors={errors.birthday} 
            InputLabelProps={{ shrink: true }} 
          />
          <InputField 
            label="Password" 
            type="password" 
            data-testid="password-input" 
            register={register("password", {
              required: "Password is required.",
              minLength: { value: 6, message: "Password should be at least 6 characters." },
              pattern: { value: /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/, 
              message: "Password must include uppercase, lowercase, digits, and special characters." }
            })} errors={errors.password} 
          />
          <InputField 
            label="Confirm Password" 
            type="password" 
            data-testid="confirm-password-input" 
            register={register("confirmPassword", {
              required: "Please confirm your password.",
              validate: value => value === watch('password') || "Passwords do not match"
            })} errors={errors.confirmPassword} 
          />
          {error && <div className="errorMsg">{error}</div>}
          <CustomButton themeMode="light" submit={true}>Sign up</CustomButton>
        </form>
      </div>
      {showVerificationModal && (
        <ConfirmationVerification
          isOpen={showVerificationModal}
          onClose={closeHandler}
          userToken={sessionStorage.getItem('token')}
        />
      )}
    </div>
  );
};

export default SignUp;
