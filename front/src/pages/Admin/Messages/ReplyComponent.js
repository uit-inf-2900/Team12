import React, { useState } from 'react';
import axios from 'axios';
import InputField from "../../../Components/InputField";

const ReplyComponent = ({ contactRequestId }) => {
    const [reply, setReply] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    const handleReplyChange = (e) => {
        setReply(e.target.value);
        setErrorMessage(''); // Reset error message when user starts typing
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
    
        if (!reply.trim()) {
            setErrorMessage('Please write a reply before sending.');
            return;
        }

        try {
            await axios.post(`http://localhost:5002/api/Contact/${contactRequestId}/response`, JSON.stringify(reply), {
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            console.log('The response was sent successfully');
            setReply(''); // Empty the reply field
        } catch (error) {
            console.error('Something went wrong when sending the reply', error);
            setErrorMessage('Failed to send reply. Please try again.');
        }
    };

    return (
        <form onSubmit={handleSubmit} style={{ textAlign: 'center', width: "100%" }}>
            <InputField 
                style={{ resize: 'vertical', height: '100px ' }}
                type="text"
                placeholder='Write your reply here...'
                value={reply}
                onChange={handleReplyChange}
                useTextareaStyle={true}
            />
            {errorMessage && <div style={{ color: 'red', marginTop: '10px' }}>{errorMessage}</div>}
            <button type='submit' className='dark-button'>Send Reply</button>
        </form>
    );
};

export default ReplyComponent;
