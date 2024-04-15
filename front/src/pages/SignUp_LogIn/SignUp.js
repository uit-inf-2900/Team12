import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import InputField from '../../Components/InputField';
import axios from 'axios';

import "../../GlobalStyles/main.css";
import CustomButton from '../../Components/Button';



const SignUp = ({ toggleForm }) => {
  const navigate = useNavigate();
  const { register, handleSubmit, formState: { errors }, watch } = useForm();
  const [error, setError] = useState(''); 
  

  const onSubmit = (data) => {
    if (data.password !== data.confirmPassword) {
      setError('confirmPassword', {
        type: 'manual',
        message: 'Passwords do not match',
      });
      return;
    }

    const dob = data.birthday.replace(/-/g, '')

    const postData = {
      userEmail: data.email,
      userPwd: data.password,
      userFullName: data.Name,
      userDOB: dob
    };
    console.log("User DOB: ", dob)

    axios.post('http://localhost:5002/createuser', postData)
    .then(function(response){
      console.log("Response: ", response)
      if (response.data.token){
        // Store the token in sessionStorage and redirect the user to the home page
        sessionStorage.setItem('token', response.data.token)
        window.location.href = '/';
        } 
      else {
        console.log("No token received")
      }
    })
    .catch(function(error){
      console.error("Error: ", error);
      if (error.response && error.response.status === 409) {
        setError("A user with this email already exists");
      } else {
        setError("Something went wrong. Please try again later");
      }
    })
    
  };


  return (
    <div className='box-container'>
      <div className="box dark">
        <h2>Hello, Knitter!</h2>
        <p>Already have an account?</p>
        <div >
          <CustomButton themeMode="dark" onClick={() => navigate('/login')}>Log in</CustomButton>
        </div>
      </div>
      <div className="box light">
        <form onSubmit={handleSubmit(onSubmit)}>
          <h2>Sign Up!</h2>

          {/* Use InputField component for Full Name input */}
          <InputField
            label="Full name"
            type="text"
            register={register("Name", { required: "Name is required." })}
            errors={errors.Name}
          />

          {/* Use InputField component for Email input */}
          <InputField
            label="Email"
            type="email"
            data-testid = "email-input"
            register={register("email", {
              required: "Email is required.",
              pattern: {
                value: /^[^@ ]+@[^@ ]+\.[^@ .]{2,}$/,
                message: "Email is not valid.",
              },
            })}
            errors={errors.email}
          />

          {/* Use InputField component for Birthday input */}
          <InputField
            label="Birthday"
            type="text"
            data-testid = "Birthday-input"
            register={register("birthday", {
              required: "Birthday is required  (YYYY-MM-DD).",
              validate: (value) => {
                const regex = /^\d{4}-\d{2}-\d{2}$/;
                if (!regex.test(value)) {
                  return "Invalid date format (YYYY-MM-DD)";
                }
                return true;
              },
            })}
            errors={errors.birthday}
          />

          {/* Use InputField component for Password input */}
          <InputField
            label="Password"
            type="password"
            data-testid = "password-input"
            register={register("password", {
              required: "Password is required.",
              minLength: {
                value: 6,
                message: "Password should be at least 6 characters.",
              },
              pattern: {
                value: /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/,
                message: "Password must include uppercase and lowercase letters, digits, and special characters (@$!%*?&).",
              },
            })}
            errors={errors.password}
          />

          {/* Use InputField component for Confirm Password input */}
          <InputField
            label="Confirm Password"
            type="password"
            data-testid = "confirm-password-input"
            register={register("confirmPassword", {
              required: "Please confirm your password.",
              validate: (value) => value === watch('password') || "Passwords do not match"
            })}
            errors={errors.confirmPassword}
          />

          <div>
            {/* Generell feilmeldingsviser */}
            {error && <div className="errorMsg">{error}</div>}
            <CustomButton themeMode="light" submit={true}>Sign up</CustomButton>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SignUp;
