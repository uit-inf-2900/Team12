import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Grid from '@mui/material/Grid'; // Ensure you import Grid from MUI

import "../../../GlobalStyles/main.css";
import MessageItem from './MessageItem';
import MessageDetails from './MessageDetails';

const ViewMessages = () => {
    const [messages, setMessages] = useState([]);
    const [showActive, setShowActive] = useState(true);
    const [activeMessage, setActiveMessage] = useState(null);

    useEffect(() => {
        const isActive = showActive ? 'true' : 'false';
        axios.get(`http://localhost:5002/api/Contact?isActive=${isActive}`)
            .then(response => {
                setMessages(response.data);
            })
            .catch(error => {
                console.log('An error occurred when fetching the messages from the database', error);
            });
    }, [showActive]);

    return (
        <Grid container spacing={2} style={{maxHeight: '600px'}}>
            <Grid item xs={12} md={4} className="page-container">
                <div className='switch-container'>
                <h2>Incoming Messages</h2>
                    <div 
                        className={`switch-option ${showActive ? 'active' : ''}`}
                        onClick={() => setShowActive(true)}
                    >
                        Active
                    </div>
                    <div 
                        className={`switch-option ${!showActive ? 'active' : 'inactive'}`}
                        onClick={() => setShowActive(false)}
                    >
                        Inactive
                    </div>
                <div className="messages-list-container"> 
                    {messages.map(message => (
                        <MessageItem key={message.id} message={message} onSelect={setActiveMessage} isSelected={message === activeMessage} />
                    ))}
                </div>
                </div>
            </Grid>
            <Grid item xs={12} md={8}>
                <MessageDetails message={activeMessage} />
            </Grid>
        </Grid>
    );
};

export default ViewMessages;
