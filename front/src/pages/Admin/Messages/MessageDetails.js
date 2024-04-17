import React, { useEffect, useState } from 'react';
import axios from 'axios';
import InputField from "../../../Components/InputField";
import "../../../GlobalStyles/main.css";
import CustomButton from '../../../Components/Button';

// Function to update the isActive status 
const updateIsActiveStatus = async (contactRequestId, isActive) => {
    try {
        await axios.patch(`http://localhost:5002/api/Contact/${contactRequestId}/isActive`, JSON.stringify(isActive), {
            headers: {
                'Content-Type': 'application/json'
            }
        });
        console.log('The isActive status was updated successfully');
    } catch (err) {
        console.error('Error updating isActive status:', err);
    }
};


const MessageDetails = ({ message }) => {
    const [reply, setReply] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [messages, setMessages] = useState([]);


    // function to split messages and replies 
    const splitMessages = (messageText) => {
        if (!messageText) return [];
        return messageText.split('\n new message \n').map((msg) => ({
            text: msg,
            isResponse: msg.startsWith(' Response:')
        }));
    };

    useEffect(() => {
        if (message) {
            setMessages(splitMessages(message.userMessage));
        }
        setReply('');
        // setResponseMessage(message?.responseMessage || '');
        setErrorMessage('');
    }, [message]);

    const handleReplyChanges = (e) => {
        setReply(e.target.value);
        setErrorMessage('');
    };


    // Function to handle the form submission
    const handleSubmit = async (e) => {
        e.preventDefault();

        // Avoid sending empty replies to the server, so we check if the reply is empty or not
        if (!reply.trim()) {
            setErrorMessage('Please write a reply before sending.');
            return;
        }

        // See if the message object is valid and contains the contactRequestId property
        if (!message) {
            console.error('Invalid message object or missing ContactRequestId');
            setErrorMessage('Invalid message, pleace select a valid message.');
            return;
        }

        // Bruker contactRequestId fra message-objektet for API-kallet
        try {
            const response = await axios.post(`http://localhost:5002/api/Contact/${message.contactRequestId}/response`, JSON.stringify(reply), {
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            // Log the response to the console and add the response to the messages list if the response was sent successfully
            console.log('The response was sent successfully', response.data);
            setReply('');                                                                   // Emty the reply field after sending the response
            setErrorMessage('');                                                            // Remove any error messages
            setMessages([...messages, { text: `Response: ${reply}`, isResponse: true }]);   // Add the response to the messages list

            updateIsActiveStatus(message.contactRequestId, true);
        } 

        // Catch any errors that occur during the API call and log them to the console and set an error message
        catch (error) {
            console.error(`Failed to send reply for message ${message.contactRequestId}`, error);
            console.log(error.response.data); 
            setErrorMessage('Failed to send reply. Please check the data you are sending.');
        }
    };


    // If there is no message selected, we return a message to select a message to view details
    if (!message) return <div>Select a message to view details.</div>;

    return (
        <div className='page-container'>
            {/* Display who the message is from */}
            <div style={{ textAlign: 'center', width: "100%" }}>
                <InputField
                    label='From'
                    type="text"
                    value={`${message.userName} (${message.userEmail})`}
                    readOnly
                    className="input"
                    style={{ cursor: 'default' }}
                />

                {messages.map((msg, index) => (
                    // Display the message and response in the message box with the correct label
                    // If the message is from you (the admin) it will be a response, otherwise it will be a message. 
                    // NOTE: everyone with admin privilegs can see the messages and responses in the message box, and will have response satus on the messages
                    <InputField
                        key={index}
                        label={msg.isResponse ? 'Response' : 'Message'}
                        type="text"
                        multiline
                        value={msg.text.replace(/^ Response:\s*/, '')}       // Remove the 'Response:' prefix from the response messages
                        readOnly
                        className="input"
                        style={{ cursor: 'default', height: 'auto' }}
                    /> 
                ))}
            </div>

            {/* Write the reply and send it */}
            <form onSubmit={handleSubmit} style={{ textAlign: 'center', width: "100%" }}>
                <InputField 
                    style={{ resize: 'vertical', height: '100px' }}
                    type="text"
                    label='Write your reply here...'
                    value={reply}
                    multiline
                    onChange={handleReplyChanges}
                    useTextareaStyle={true}
                />
                {errorMessage && <div style={{ color: 'red', marginTop: '10px' }}>{errorMessage}</div>}
                <CustomButton 
                    themeMode="light" submit={true} iconName='send'>
                        Send Reply
                </CustomButton>            
            </form>
        </div>
    );
};

export default MessageDetails;
