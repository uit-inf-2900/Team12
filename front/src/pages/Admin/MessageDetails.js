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
        if (!reply.trim()) 
            return;

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
            <div style={{'textAlign': 'center', "width":"100%"}}>
                <InputField
                    type="text"
                    value={`From: ${message.userName} (${message.userEmail})`}
                    readOnly
                    className="input"
                    style={{cursor: 'default'}} // Optional: Changes cursor to indicate it's not editable
                />
            </div>
            <div  style={{'textAlign': 'center', "width":"100%"}}>
                <InputField 
                    type="text"
                    value={`Message: ${message.userMessage}`}
                    readOnly
                    className="input"
                    style={{cursor: 'default', 'height': '100px '}} // Optional: Changes cursor to indicate it's not editable
                    useTextareaStyle={true}
                />
            </div>

            <form onSubmit={handleSubmit}  style={{'textAlign': 'center', "width":"100%"}}>
                <InputField 
                    style={{'resize': 'vertical', 'height': '100px ' }}
                    type="text"
                    placeholder='Write your reply here...'
                    value={reply}
                    onChange={handleReplyChanges}
                    useTextareaStyle={true}
                />
                <button type='submit' className='dark-button'>Send Reply</button>
            </form>
        </div>
    );
}; 

export default MessageDetails;