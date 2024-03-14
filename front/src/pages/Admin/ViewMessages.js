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
    if (!message) return <div>Select a message to view details.</div>;

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
        <div style={{ padding: '10px', border: '1px solid #ccc', borderRadius: '5px', backgroundColor: '#f0f0f0' }}>
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


const ViewMessages = () => {
    const [messages, setMessages] = useState([]);
    const [showActive, setShowActive] = useState(true);
    const [activeMessage, setActiveMessage] = useState(null);

    // Get all the messages from the database
    useEffect(()=> {
        const isActive = showActive ? 'true' : 'false';
        axios.get(`http://localhost:5002/api/Contact?isActive=${isActive}`)
        .then(response => {
            setMessages(response.data);
        })
        .catch(error => {
            console.log('An error occurred when fetching the messaged from the database',error);
        });
    }, [showActive]);


    return (
        <div className="page-container" style={{ display: 'flex', justifyContent: 'space-between' }}>
            <div style={{ width: '30%' }}>
                <h2>Incoming Messages</h2>
                <button className='light-button' onClick={() => setShowActive(!showActive)}>
                    Show {showActive ? 'active' : 'inactive'} messages
                </button>
                <div>
                    {messages.map(message => (
                        <MessageItem key={message.id} message={message} onSelect={setActiveMessage} isSelected={message === activeMessage} />
                        ))}
                </div>
            </div>
            <div style={{ width: '80%' }}>
                <MessageDetails message={activeMessage} />
            </div>
        </div>
    ); 

};

export default ViewMessages;