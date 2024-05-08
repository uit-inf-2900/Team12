import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';
import "../../../GlobalStyles/main.css";
import MessageItem from './MessageItem';
import MessageDetails from './MessageDetails';
import {  TablePagination } from '@mui/material';


/**
 * Component for viewing incoming messages and their details.
 */
const ViewMessages = () => {
    // state varibles
    const [messages, setMessages] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [selectedFilter, setSelectedFilter] = useState('active');
    const [activeMessage, setActiveMessage] = useState(null);
    const [messageError, setMessageError] = useState('');

    // Function to fetch messages from the server based on selected filter
    const fetchMessages = async () => {
        setIsLoading(true);
        let queryParams = '';
        switch(selectedFilter) {
            case 'active': queryParams = 'isActive=true&isHandled=false'; break;
            case 'handled': queryParams = 'isActive=false&isHandled=true'; break;
            case 'inactive': queryParams = 'isActive=false&isHandled=false'; break;
        }
        try {
            const response = await axios.get(`http://localhost:5002/api/Contact?${queryParams}`);
            setMessages(response.data);
            setMessageError('');
        } catch (error) {
            console.error('An error occurred when fetching the messages:', error);
            setMessageError('Failed to fetch messages due to a server error.');
        } finally {
            setIsLoading(false);
        }
    };

    // Fetch messages when the selected filter changes
    useEffect(() => {
        fetchMessages();
    }, [selectedFilter]);

    const refreshMessages = (newFilter) => {
        if (newFilter) {
            setSelectedFilter(newFilter);
        } else {
            fetchMessages();
        }
    };

    return (
        
        <Grid container spacing={2} style={{ overflow: 'auto' }}>
            {/* Message List */}
            <Grid item xs={12} md={4}>
                <div className='switch-container'>
                    <h2>Incoming Messages</h2>
                    <div>
                        {/* Filter options */}
                        <div className={`switch-option ${selectedFilter === 'active' ? 'active' : 'inactive'}`} onClick={() => setSelectedFilter('active')}>
                            Active
                        </div>
                        <div className={`switch-option ${selectedFilter === 'inactive' ? 'active' : 'inactive'}`}  onClick={() => setSelectedFilter('inactive')}>
                            Inactive
                        </div>
                        <div className={`switch-option ${selectedFilter === 'handled' ? 'active' : 'inactive'}`} onClick={() => setSelectedFilter('handled')}>
                            Handled
                        </div>
                    </div>

                    {/* Message list */}
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

            {/* Message Details */}
            <Grid item xs={12} md={8}>
                {activeMessage ? (
                    <MessageDetails message={activeMessage} refreshMessages={refreshMessages}/>
                    ) : (
                    <div> Select a message to view details.</div>
                )}
            </Grid>
        </Grid>
    
    );
};

export default ViewMessages;
