import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Grid from '@mui/material/Grid';
import "../../../GlobalStyles/main.css";
import MessageItem from './MessageItem';
import MessageDetails from './MessageDetails';

const ViewMessages = () => {
    const [messages, setMessages] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [showActive, setShowActive] = useState(true);
    const [activeMessage, setActiveMessage] = useState(null);
    const [messageError, setMessageError] = useState('');


    // Fetch messages from the server when the component mounts or when showActive is toggled
    const fetchMessages = async () => {
        setIsLoading(true);
        const isActive = showActive ? 'true' : 'false';
        try {
            const response = await axios.get(`http://localhost:5002/api/Contact?isActive=${isActive}`);
            // Since backend now returns an Ok response even for empty lists, check the content of the message
            if (response.data && response.data.length > 0) {
                setMessages(response.data);
                setMessageError('');
            } else if (response.data && response.data.Message) {
                // Handle the scenario where backend returns a custom message indicating no data
                setMessages([]);
                setMessageError(response.data.Message);
            } else {
                // Handle unlikely case where data is undefined or malformed
                setMessages([]);
                setMessageError('There are no contact requests available.');
            }
        } catch (error) {
            console.error('An error occurred when fetching the messages:', error);
            setMessageError('Failed to fetch messages due to a server error.');
        } finally {
            setIsLoading(false);
        }
    };
    

    useEffect(() => {
        fetchMessages();
    }, [showActive]); // Dependency array includes showActive to re-fetch when toggled

    return (
        <Grid  container spacing={2} style={{ overflow:'auto'}}>
            <Grid item xs={12} md={4}>
                <div className='switch-container'>
                    <h2>Incoming Messages</h2>
                    <div 
                        className={`switch-option ${showActive ? 'active' : 'inactive'}`}
                        onClick={() => setShowActive(true)}
                    >
                        {/* Show active or inactive messages based on the  */}
                        Show Active
                    </div>
                    <div 
                        className={`switch-option ${!showActive ? 'active' : 'inactive'}`}
                        onClick={() => setShowActive(false)}
                    >
                        Show Inactive
                    </div>
                    <div className="messages-list-container">
                        {isLoading ? (
                            <div>Loading messages...</div>
                        ) : messageError ? (
                            <div>{messageError}</div>
                        ) : (
                            messages.map(message => (
                                <MessageItem key={message.contactRequestId} message={message} onSelect={setActiveMessage} isSelected={message === activeMessage} />
                            ))
                        )}
                    </div>
                </div>
            </Grid>
            <Grid item xs={12} md={8}>
                {activeMessage ? (
                    <MessageDetails message={activeMessage} />
                ) : (
                    <div>Select a message to view details.</div>
                )}
            </Grid>
        </Grid>
    );
};

export default ViewMessages;
