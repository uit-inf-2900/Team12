import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import validator from 'validator'; 
import axios from 'axios';

import InputField from "../../Components/InputField";
import "../../GlobalStyles/main.css";

const MessageItem = ({ message, onSelect }) => {
    return (
        <div onClick={() => onSelect(message)}
        style={{ cursor: 'pointer', margin: '10px', padding: '10px', border: '1px solid #ccc', borderRadius: '5px', backgroundColor: message.isHandled === 1 ? '#90ee90' : 'transparent' }}>
            <h3>From: {message.userName}</h3>
        </div>
    );
};


const MessageDetails = ({ message }) => {
    if (!message) return <div>Select a message to view details.</div>;

    return (
        <div style={{ padding: '10px', border: '1px solid #ccc', borderRadius: '5px', backgroundColor: '#f0f0f0' }}>
            <h3>From: {message.userName}</h3>
            <p>Email: {message.userEmail}</p>
            <p>Message: {message.userMessage}</p>
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
            <div>
                <h2>Incoming Messages</h2>
                <button className='light-button' onClick={() => setShowActive(!showActive)}>
                    Show {showActive ? 'active' : 'inactive'} messages
                </button>
                <div>
                    {messages.map(message => (
                        <MessageItem key={message.id} message={message} onSelect={setActiveMessage} />
                        ))}
                </div>
            </div>
            <div style={{ width: '50%' }}>
                <MessageDetails message={activeMessage} />
            </div>
        </div>
    ); 

};

export default ViewMessages;