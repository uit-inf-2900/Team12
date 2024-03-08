import React from 'react';
import './Reg.css';
import "../../Components/main.css";


const InputField = ({ label, register, errors, ...inputProps }) => (
    <div className="input">
        <label>{label}</label>
        <input {...register} {...inputProps} />
        {errors && <p className="errorMsg">{errors.message}</p>}
    </div>
);

export default InputField;