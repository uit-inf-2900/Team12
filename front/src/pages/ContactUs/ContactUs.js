import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import validator from 'validator'; 
import axios from 'axios';
import { Link } from "react-router-dom"; 


import Image from "../../images/6.png";
import InputField from "../../Components/UI/InputField";
import SetAlert from "../../Components/UI/Alert";
import "../../GlobalStyles/main.css";
import { CustomButton } from "../../Components/UI/Button";
import ContactInformation from '../../Components/Forms/ContactInformation';

/**
 *  Represents one idividual FAQ item with a question and its corresponding answer.
 */
const FAQItem = ({ question, answer, isOpen, setIsOpen }) => (
    <div className="faq-item">
        <button className={`faq-question ${isOpen ? 'open' : ''}`} onClick={setIsOpen}>
            <span>{question}</span>
            <span className="icon">{isOpen ? '−' : '+'}</span> {/* Using Unicode characters for icons */}
        </button>
        {isOpen && <div className="faq-answer">{answer}</div>}
    </div>
);


/**
 * Represents a section containing FAQs.
 */
const FAQSection = () => {
    const [openFAQ, setOpenFAQ] = useState(null);

    const handleFAQClick = (index) => {
        // Toggle openFAQ state or switch to a new index
        setOpenFAQ(openFAQ === index ? null : index);
    };

    return (
        <div className="faq-section">
            <h2>Frequently Asked Questions (FAQ)</h2>
            <FAQItem 
                question="How do I change my password if I have forgotten it?" 
                answer = "If you have forgotten your password, please contact us at post@knithub.no."
                isOpen={openFAQ === 0}
                setIsOpen={() => handleFAQClick(0)}
            />
            <FAQItem 
                question="How do I start a new project?" 
                answer="To start a new project, go to your project planner, click on the + button, and fill out the information." 
                isOpen={openFAQ === 1}
                setIsOpen={() => handleFAQClick(1)}
            />
            <FAQItem 
                question="What do I do if I forget my password?" 
                answer="Click on 'Forgot password?' on the login page to reset your password." 
                isOpen={openFAQ === 2}
                setIsOpen={() => handleFAQClick(2)}
            />
            <FAQItem 
                question="How do i add needles to my stash?" 
                answer="To add needles, go to your stash page and choose needle. Then click on the + button, and fill out the information."
                isOpen={openFAQ === 3}
                setIsOpen={() => handleFAQClick(3)}
            />
            <FAQItem 
                question="How do i add Yarn to my stash?" 
                answer="To add yarn, go to your stash page and choose yarn. Then click on the + button, and fill out the information."
                isOpen={openFAQ === 4}
                setIsOpen={() => handleFAQClick(4)}
            />
            <FAQItem 
                question="How do i add a pattern to my stash?" 
                answer="To add a pattern, go to your stash page and choose pattern. Then click on the + button, and fill out the information."
                isOpen={openFAQ === 5}
                setIsOpen={() => handleFAQClick(5)}
            /> 
            <FAQItem 
                question="How do I update my inventory on Knithub?"
                answer="To update your inventory, go to the 'Inventory' section on your dashboard. Here, you can add new items, update, or delete items you no longer have. Keeping your inventory updated helps in planning new projects without overbuying materials."
                isOpen={openFAQ === 6}
                setIsOpen={() => handleFAQClick(6)}
            />
            <FAQItem 
                question="Is there a way to track the time spent on each knitting project?"
                answer="While Knithub currently does not automatically track the time spent on projects, you can manually add time logs in the project details section. This helps in understanding the effort involved and planning future projects more effectively."
                isOpen={openFAQ === 7}
                setIsOpen={() => handleFAQClick(7)}
            />
            <FAQItem 
                question="How can I find knitting inspiration on Knithub?"
                answer="Check out the 'Resource Page' on Knithub for a variety of knitting abbreviations, tips, and links to inspirational Instagram images. This page is continuously updated to provide you with fresh ideas and innovative techniques to enhance your knitting projects."
                isOpen={openFAQ === 8}
                setIsOpen={() => handleFAQClick(8)}
            />
            <FAQItem 
                question="How can I use the yarn calculators on Knithub?"
                answer="Knithub offers various yarn calculators, including decrease and increase calculators, as well as a calculator to estimate how much yarn you need if you're substituting the original yarn in a pattern. You can find these tools under the 'Projects' section of your dashboard. They help you adjust your knitting projects according to your yarn choices effectively."
                isOpen={openFAQ === 9}
                setIsOpen={() => handleFAQClick(9)}
            />
            <FAQItem 
                question="What are counters, and how can I use them in my projects?"
                answer="Counters on Knithub are customizable tools that help you keep track of specific elements in your knitting projects, such as rounds on a sleeve or decreases on a sweater. You can name each counter to match its purpose and easily delete them once the project or the specific task is complete. To use a counter, simply add one from the project detail page and start tracking your progress immediately."
                isOpen={openFAQ === 10}
                setIsOpen={() => handleFAQClick(10)}
            />
            <FAQItem 
                question="How do I contact you for support or inquiries?"
                answer="For any support or inquiries, please visit our Contact Us page. You can send us a message directly through our website, and our team will respond as quickly as possible."
                isOpen={openFAQ === 11}
                setIsOpen={() => handleFAQClick(11)}
            />
        </div>
    );
};


/**
 *  Represents the contact details section where info about us can be found 
 */
const ContactDetails = () => (
    <div className="infoText" style={{"textAlign":"left"}}>
        {/* The following details should be styled according to your ContactUs.css */}
        <ContactInformation />
        <img src={Image} alt="Contact us" className="contact-image" />  
    </div>
);


/**
 * Represents the Contact Us page, allowing users to send messages that can be responded to by admins.
 */
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
            <div className="section-container" style={{'max-width':'100%'}}>
                <div className="infoText" >
                    <h2>Contact Details</h2>
                    <ContactDetails />
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="box dark" style={{"max-width": "50%", "height":"100%"}}>
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
            <FAQSection /> 
        </div>
    );
};

export default ContactUs;
