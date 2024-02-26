import React, { useState } from 'react';
import "../SignUp_LogIn/Reg.css";
import InputField from "../SignUp_LogIn/InputField";
import { useForm } from 'react-hook-form';
import validator from 'validator'; // Sørg for å ha installert 'validator'


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
  


const ContactUs = () => {
    const { register, handleSubmit, formState: { errors }, reset } = useForm();

    const onSubmit = data => {
        console.log(data);
        reset(); // Tømmer skjemaet etter innsending
    };

    return (
        <div className="contact-form-container">
            <h1>Contact Us</h1>
            <form onSubmit={handleSubmit(onSubmit)}>
                <h2>Send us a message</h2>
                <InputField
                    placeholder="Name:"
                    register={register("name", { 
                        required: "Name is required." })}
                    errors={errors.name}
                    type="text"
                />
                <InputField
                    placeholder="Email:"
                    register={register("email", {
                        required: "Email is required.",
                        validate: input => validator.isEmail(input) || "Invalid email address"
                    })}
                    errors={errors.email}
                    type="email"
                />
                <InputField
                    placeholder="Message:"
                    register={register("Message", { 
                        required: "Message is required." })}
                    errors={errors.message}
                    type="text"
                />                
                <button type="submit" className="submit-button">Send Melding</button>
            </form>

            {/* Frequently Asked Questions (FAQ) Section */}
            <section className="faq-section">
                <h2>Frequently Asked Questions (FAQ)</h2>
                <FAQItem question="How do I start a new project?" answer="To start a new project, go to your project planner and click on 'Add new project'." />
                <FAQItem question="How can I save my favorite recipes?" answer="Recipes can be saved by clicking on 'Save as favorite' under each recipe." />
                <FAQItem question="What do I do if I forget my password?" answer="Click on 'Forgot password?' on the login page to reset your password." />
            </section>
        </div>
    );
};

export default ContactUs;

