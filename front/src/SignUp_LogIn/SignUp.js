import React from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import './Reg.css';
import InputField from './InputField';
import axios from 'axios';


const SignUp = ({ toggleForm }) => {
  const navigate = useNavigate();
  const { register, handleSubmit, formState: { errors }, watch, setError } = useForm();

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
    })
    .catch(function(error){
      console.error("Error: ", error)
    })

    console.log('Signup Data', data);
  };

  return (
    <div className='box-container'>
      <div className="box dark">
        <h2>Hello, Friend!</h2>
        <p>Already have an account?</p>
        <div className='black'>
          <button onClick={() => navigate('/login')}>Log in</button>
        </div>
      </div>
      <div className="box light">
        <form onSubmit={handleSubmit(onSubmit)}>
          <h2>Sign Up!</h2>

          {/* Use InputField component for Full Name input */}
          <InputField
            placeholder="Full name"
            type="text"
            register={register("Name", { required: "Name is required." })}
            errors={errors.Name}
          />

          {/* Use InputField component for Email input */}
          <InputField
            placeholder="Email"
            type="text"
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
            placeholder="Birthday"
            type="text"
            register={register("birthday", {
              required: "Birthday is required.",
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
            placeholder="Password"
            type="password"
            register={register("password", {
              required: "Password is required.",
              minLength: {
                value: 6,
                message: "Password should be at least 6 characters.",
              },
              pattern: {
                value: /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/,
                message: "Password does not meet the requirements.",
              },
            })}
            errors={errors.password}
          />

          {/* Use InputField component for Confirm Password input */}
          <InputField
            placeholder="Confirm Password"
            type="password"
            register={register("confirmPassword", {
              required: "Please confirm your password.",
              validate: (value) => value === watch('password') || "Passwords do not match"
            })}
            errors={errors.confirmPassword}
          />

          <div className="purple">
            <button type="submit">Sign up</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SignUp;
