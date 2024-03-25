import React, { useEffect, useState } from 'react';
import axios from 'axios';

import InputField from "../../../Components/InputField";
import "../../../GlobalStyles/main.css";
import ReplyComponent from './ReplyComponent'; // Adjust the path as needed

const MessageDetails = ({ message }) => {
    const [reply, setReply] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [responseMessage, setResponseMessage] = useState('');

    // Reset reply state and response message when message changes
    useEffect(() => {
        setReply('');
        setResponseMessage(message?.response || ''); // Assuming your message object might contain a response field
        setErrorMessage('');
    }, [message]);

    // If no message is selected, display a message to the user
    if (!message) 
        return <div>Select a message to view details.</div>;

    const handleReplyChanges = (e) => {
        setReply(e.target.value);
        setErrorMessage(''); // Reset error message when user starts typing
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
    
        if (!reply.trim()) {
            setErrorMessage('Please write a reply before sending.');
            return;
        }

        if (!message || !message.ContactRequestId) {
            console.error('Invalid message object or missing ContactRequestId:', message);
            setErrorMessage('Invalid message or message ID. Please select a valid message.');
            return;
        }
    
        try {
            const response = await axios.post(`http://localhost:5002/api/Contact/${message.id}/response`, JSON.stringify(reply), {
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            console.log('The response was sent successfully', response.data);
            setReply(''); // Empty the reply field
            setResponseMessage(reply); // Update the response message to display it
        } catch (error) {
            console.error(`Something went wrong when sending the reply for message ${message.id}`, error);
            setErrorMessage(`Failed to send reply. Please try again.${message.id}`);
        }
    };
    
    return (
        <div className='message box'>
            <div style={{ textAlign: 'center', width: "100%" }}>
                <InputField
                    type="text"
                    value={`From: ${message.userName} (${message.userEmail})`}
                    readOnly
                    className="input"
                    style={{ cursor: 'default' }} // Optional: Changes cursor to indicate it's not editable
                />
            </div>
            <div style={{ textAlign: 'center', width: "100%" }}>
                <InputField 
                    type="text"
                    value={`Message: ${message.userMessage}`}
                    readOnly
                    className="input"
                    style={{ cursor: 'default', height: '100px ' }} // Optional: Changes cursor to indicate it's not editable
                    useTextareaStyle={true}
                />
            </div>

            {/* Display the response message if available */}
            {responseMessage && (
                <div style={{ marginTop: '20px', padding: '10px', backgroundColor: '#f0f0f0', borderRadius: '5px' }}>
                    <h3>Reply:</h3>
                    <p>{responseMessage}</p>
                </div>
            )}

                <ReplyComponent contactRequestId={message.id} />
        </div>
    );
}; 

export default MessageDetails;
