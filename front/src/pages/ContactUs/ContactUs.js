import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import validator from 'validator'; 
import axios from 'axios';

import Image from "../../images/6.png";
import InputField from "../../Components/InputField";
import "../../GlobalStyles/main.css";
import "./ContactUs.css"

// 
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
        <p>Send us a mail: <a href="mailto:contact@knithub.com">contact@knithub.com </a></p>
        <p>Call us: <a href="tel:+4712345678"> 12345678</a></p>
        <p>Location: <a href="https://maps.google.com?q=Hansine+Hansens+veg+56,+9019+Tromsø">Hansine Hansens veg 56, 9019 Tromsø</a> </p>
        <img src={Image} alt="Contact us" className="contact-image" />  
    </div>
);

const ContactUs = () => {
    const { register, handleSubmit, formState: { errors }, reset } = useForm();
    

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
                reset(); // Clear form after submission
            })
            .catch(error => {
                console.log(error);
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
                        placeholder="Full Name"
                        register={register("Name", { required: "Full name is required." })}
                        errors={errors.Name}
                        type="text"
                        />
                    <InputField
                        placeholder="Email"
                        register={register("email", {
                            required: "Email is required.",
                            validate: input => validator.isEmail(input) || "Invalid email address"
                        })}
                        errors={errors.email}
                        type="email"
                        />
                    <InputField
                        placeholder="Message"
                        register={register("message", { 
                            required: "Message is required." })}
                            errors={errors.message}
                            type="text"
                            />
                    <button type="submit" className="light-button">Send Message</button>
                </form>
                
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
