import React from 'react';
import { useForm } from 'react-hook-form';
import './Reg.css';
import validator from 'validator';
import InputField from './InputField'; 
import axios from 'axios';

const LogIn = ({ toggleForm, onForgotPasswordClick}) => {
    const { register, handleSubmit, formState: { errors } } = useForm();
    // const [isLoading, setIsLoading] = useState(false);
    // const [apiError, setApiError] = useState('');

    const onSubmit = (data) => {
        // console.log('Log In Data', data);
        //setApiError('');
        //setIsLoading(true);

        const postData = {
            userEmail: data.email,
            userPwd: data.password
        }

        axios.post('http://localhost:5002/login', postData)
        .then(function(response){
            console.log("Response: ", response)
        })
        .catch(function(error){
            console.error("Error: ", error)
        })

        /*
        //  Simulate API call
        try{
            console.log('Log In Data', data);
        }
        catch(error){
            setApiError('Log In failed. Please try again later.');
        }
        finally{
            setIsLoading(false);
        }
        */
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
                    <div className='small-text'>
                        <a href="#" onClick={onForgotPasswordClick}>Forgot password?</a>
                    </div>

                    <div className="purple">
                        <button type="submit">Log In</button>
                    </div>
                </form>
            </div>

            <div className="box dark">
                <h2>Hello, Friend!</h2>
                <p>Enter your personal details and start journey with us</p>
                <div className='black'>
                    <button onClick={toggleForm}>Don't have an account? Sign Up</button>
                </div>
            </div>
        </div>
    );
};


export default LogIn;

