import React from 'react';
import "../GlobalStyles/main.css";

const InputField = ({ label, register, errors, useTextareaStyle, ...inputProps }) => {
    return (
        <div className={useTextareaStyle ? "textarea" : "input"}>
            <label>{label}</label>
            {useTextareaStyle ? (
                <textarea {...register} {...inputProps} className="textarea" />
            ) : (
                <input {...register} {...inputProps} />
            )}
            {errors && <p className="errorMsg">{errors.message}</p>}
        </div>
    );
};

export default InputField;
