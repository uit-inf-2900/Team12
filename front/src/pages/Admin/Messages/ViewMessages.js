import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Grid from '@mui/material/Grid';
import "../../../GlobalStyles/main.css";
import MessageItem from './MessageItem';
import MessageDetails from './MessageDetails';

const ViewMessages = () => {
    const [messages, setMessages] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [selectedFilter, setSelectedFilter] = useState('active');
    const [activeMessage, setActiveMessage] = useState(null);
    const [messageError, setMessageError] = useState('');

    const fetchMessages = async () => {
        setIsLoading(true);
        let queryParams = '';
        if (selectedFilter === 'active') {
            queryParams = 'isActive=true&isHandled=false';
        } else if (selectedFilter === 'handled') {
            queryParams = 'isActive=false&isHandled=true';
        } else if (selectedFilter === 'inactive') {
            queryParams = 'isActive=false&isHandled=false';
        }
        try {
            const response = await axios.get(`http://localhost:5002/api/Contact?${queryParams}`);
            if (response.data && response.data.length > 0) {
                setMessages(response.data);
                setMessageError('');
            } else if (response.data && response.data.Message) {
                setMessages([]);
                setMessageError(response.data.Message);
            } else {
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
    }, [selectedFilter]);

    return (
        <Grid container spacing={2} style={{ overflow: 'auto' }}>
            <Grid item xs={12} md={4}>
                <div className='switch-container'>
                    <h2>Incoming Messages</h2>
                    <div 
                        className={`switch-option ${selectedFilter === 'active' ? 'active' : 'inactive'}`}
                        onClick={() => setSelectedFilter('active')}
                    >
                        Active
                    </div>
                    <div 
                        className={`switch-option ${selectedFilter === 'inactive' ? 'active' : 'inactive'}`}
                        onClick={() => setSelectedFilter('inactive')}
                    >
                        Inactive
                    </div>
                    <div 
                        className={`switch-option ${selectedFilter === 'handled' ? 'active' : 'inactive'}`}
                        onClick={() => setSelectedFilter('handled')}
                    >
                        Handled
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
                    <MessageDetails message={activeMessage} refreshMessages={fetchMessages}/>
                    ) : (
                    <div>Select a message to view details.</div>
                )}
            </Grid>
        </Grid>
    );
};

export default ViewMessages;
