import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import validator from 'validator'; 
import axios from 'axios';

import Image from "../../images/6.png";
import InputField from "../../Components/InputField";
import SetAlert from "../../Components/Alert";
import "../../GlobalStyles/main.css";
import "./ContactUs.css"
import CustomButton from "../../Components/Button";
import ContactInformation from '../../Components/ContactInformation';

const FAQItem = ({ question, answer }) => {
    const [isOpen, setIsOpen] = useState(false);


    return (
        <div className="faq-item">
            <button className="faq-question" onClick={() => setIsOpen(!isOpen)}>
                {question}
            </button>
            {isOpen && <div className="faq-answer">{answer}</div>}
        </div>
    );  
};

const ContactDetails = () => (
    <div className="infoText" style={{"textAlign":"left"}}>
        {/* The following details should be styled according to your ContactUs.css */}
        <ContactInformation />
        <img src={Image} alt="Contact us" className="contact-image" />  
    </div>
);

const ContactUs = () => {
    const { register, handleSubmit, formState: { errors }, reset } = useForm();
    const [alertInfo, setAlertInfo] = useState({open: false, severity: 'info', message: ''});
    

    const onSubmit = data => {
        const payload = {
            userEmail: data.email, 
            userMessage: data.message, 
            userName: data.Name
        };
        console.log("Payload: ", payload);

        axios.post('http://localhost:5002/api/Contact', payload)
            .then(response => {
                console.log("Response: ", response)
                setAlertInfo({open: true, severity: 'success', message: 'Message sent successfully!'});
                reset(); // Clear form after submission
            })
            .catch(error => {
                console.log(error);
                setAlertInfo({open: true, severity: 'error', message: 'Failed to send message. Please try again later.'});
            });
    };

    return (
        <div className="page-container">
            <h1>Contact Us</h1>
            <div className="section-container" style={{"max-width":"800px"}}>
                <div className="infoText" >
                    <h2>Contact Details</h2>
                    <ContactDetails />
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="box dark" style={{"width": "50%", "height":"100%"}}>
                    <h2>Send us a message</h2>
                    <InputField
                        label="Full Name"
                        register={register("Name", { required: "Full name is required." })}
                        errors={errors.Name}
                        type="text"
                        />
                    <InputField
                        label="Email"
                        register={register("email", {
                            required: "Email is required.",
                            // validate: input => validator.isEmail(input) || "Invalid email address"
                        })}
                        errors={errors.email}
                        type="email"
                        />
                    <InputField
                        label="Message"
                        multiline
                        rows={3}
                        register={register("message", { 
                            required: "Message is required." })}
                            errors={errors.message}
                            type="text"
                    />
                    <CustomButton themeMode="light" iconName="send" submit={true}>
                        Send Message
                    </CustomButton>
                </form>
                
                {/* SetAlert component for showing alerts */}
                <SetAlert open={alertInfo.open} setOpen={(isOpen) => setAlertInfo({...alertInfo, open: isOpen})} severity={alertInfo.severity} message={alertInfo.message} />
                
            </div>
            {/* Frequently Asked Questions (FAQ) Section */}
            <div className="faq-section">
                <h2>Frequently Asked Questions (FAQ)</h2>
                <FAQItem question="How do I start a new project?" answer="To start a new project, go to your project planner and click on 'Add new project'." />
                <FAQItem question="How can I save my favorite recipes?" answer="Recipes can be saved by clicking on 'Save as favorite' under each recipe." />
                <FAQItem question="What do I do if I forget my password?" answer="Click on 'Forgot password?' on the login page to reset your password." />
            </div>
        </div>
    );
};

export default ContactUs;
