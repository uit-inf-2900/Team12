import React, { useEffect, useState } from 'react';
import axios from 'axios';

import InputField from "../../Components/InputField";
import "../../GlobalStyles/main.css";
import MessageItem from './MessageItem';


const MessageDetails = ({ message }) => {
    const [reply, setReply] = useState('');


    // Reset reply state when message changes
    useEffect(() => {
        setReply('');
    }, [message]);

    // If no message is selected, display a message to the user
    if (!message) 
        return <div>Select a message to view details.</div>;

    const handleReplyChanges = (e) => {
        setReply(e.target.value);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Check if the reply is empty
        if (!reply.trim()) return;

        // Send the answer to the server and update the message
        try{
            const response = await axios.put(`http://localhost:5002/api/Contact/${message.id}`, {
                messageId: message.id, 
                reply: reply, 
            });
            console.log('Reply sendt successfully', response.data);
            setReply(''); // Clear the input field
        }catch (error){
            console.log('An error occurred when sending the reply', error);
        }
    };

    return (
        <div className='message box'>
            <h3>From: {message.userName}</h3>
            <p>Email: {message.userEmail}</p>
            <p>Message: {message.userMessage}</p>

            <form onSubmit={handleSubmit}>
                <InputField
                    type='text'
                    placeholder='Write your reply here'
                    value={reply}
                    onChange={handleReplyChanges}
                />
                <div>
                    <button type='submit' className='dark-button' style={{ padding: '10px 20px' }}>Send reply</button>
                </div>
                    
            </form>
        </div>
    );
}; 

export default MessageDetails;