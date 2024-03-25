import React, { useState } from 'react';
import axios from 'axios';
import InputField from "../../../Components/InputField";

// ReplyComponent allows users to write and send replies to messages
const ReplyComponent = ({ contactRequestId }) => {
    // State for managing the reply text input by the user
    const [reply, setReply] = useState('');
    // State for displaying any error messages during the reply process
    const [errorMessage, setErrorMessage] = useState('');

    // Updates the reply state as the user types their reply
    const handleReplyChanges = (e) => {
        setReply(e.target.value);
        // Clear any existing error messages when the user starts typing
        setErrorMessage('');
    };

    // Handles the reply submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        
        // Validate that a reply has been written
        if (!reply.trim()) {
            setErrorMessage('Please write a reply before sending.');
            return;
        }

        // Ensure the contactRequestId is provided
        if (!contactRequestId) {
            console.error('Missing ContactRequestId');
            setErrorMessage('Invalid message or message ID. Please select a valid message.');
            return;
        }
        
        try {
            // Send the reply to the server using the contactRequestId
            const response = await axios.post(`http://localhost:5002/api/Contact/${contactRequestId}/response`, reply, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            console.log('The response was sent successfully', response.data);
            // Reset the reply field after successful submission
            setReply('');
        } catch (error) {
            console.error(`Something went wrong when sending the reply for message ${contactRequestId}`, error);
            setErrorMessage(`Failed to send reply. Please try again.`);
        }
    };

    return (
        <form onSubmit={handleSubmit} style={{ textAlign: 'center', width: "100%" }}>
            <InputField 
                style={{ resize: 'vertical', height: '100px' }}
                type="text"
                placeholder='Write your reply here...'
                value={reply}
                onChange={handleReplyChanges}
                useTextareaStyle={true}
            />
            {errorMessage && <div style={{ color: 'red', marginTop: '10px' }}>{errorMessage}</div>}
            <button type='submit' className='dark-button'>Send Reply</button>
        </form>
    );
};

export default ReplyComponent;
