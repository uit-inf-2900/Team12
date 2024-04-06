import React, { useEffect, useState } from 'react';
import axios from 'axios';
import InputField from "../../../Components/InputField";
import "../../../GlobalStyles/main.css";
import CustomButton from '../../../Components/Button';

// MessageDetails displays details of a selected message and allows for responding
const MessageDetails = ({ message, contactRequestId }) => {
    const [reply, setReply] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [responseMessage, setResponseMessage] = useState('');

    // Resets reply and responseMessage states when a new message is selected
    useEffect(() => {
        setReply('');
        setResponseMessage(message?.response || '');
        setErrorMessage('');
    }, [message]);

    // Handle changes in the reply input field
    const handleReplyChanges = (e) => {
        setReply(e.target.value);
        setErrorMessage('');
    };

    // Handles reply submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!reply.trim()) {
            setErrorMessage('Please write a reply before sending.');
            return;
        }

        if (!message || !contactRequestId) {
            console.error('Invalid message object or missing ContactRequestId');
            setErrorMessage('Invalid message or message ID. Please select a valid message.');
            return;
        }

        try {
            // Sends the reply to the server using the contactRequestId
            const response = await axios.post(`http://localhost:5002/api/Contact/${contactRequestId}/response`, reply, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            console.log('The response was sent successfully', response.data);
            setReply(''); // Clears the reply field
            setResponseMessage(reply); // Updates the displayed response message
        } catch (error) {
            console.error(`Failed to send reply for message ${contactRequestId}`, error);
            setErrorMessage('Failed to send reply. Please try again.');
        }
    };

    if (!message) return <div>Select a message to view details.</div>;

    return (
        <div className='message-box'>
            {/* Display message sender and message content */}
            <div style={{ textAlign: 'center', width: "100%" }}>
                <InputField
                    label='From'
                    type="text"
                    value={`${message.userName} (${message.userEmail})`}
                    readOnly
                    className="input"
                    style={{ cursor: 'default' }}
                />
                <InputField 
                    label='Message'
                    type="text"
                    multiline
                    rows={5}
                    value={`${message.userMessage}`}
                    readOnly
                    className="input"
                    style={{ cursor: 'default', height: 'auto' }} // 'height' adjusted for multiline                
                />
            </div>
            
            {/* Display the response message if available */}
            {responseMessage && (
                <div style={{ marginTop: '20px', padding: '10px', backgroundColor: '#f0f0f0', borderRadius: '5px' }}>
                    <h3>Reply:</h3>
                    <p>{responseMessage}</p>
                </div>
            )}

            {/* Reply form */}
            <form onSubmit={handleSubmit} style={{ textAlign: 'center', width: "100%" }}>
                <InputField 
                    style={{ resize: 'vertical', height: '100px' }}
                    type="text"
                    label='Write your reply here...'
                    value={reply}
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
