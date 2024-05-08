import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Grid from '@mui/material/Grid';


import "../../../GlobalStyles/main.css";
import MessageItem from './MessageItem';
import MessageDetails from './MessageDetails';
import {  TablePagination } from '@mui/material';
import InputField from '../../../Components/InputField';


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
    const [searchQuery, setSearchQuery] = useState(''); 

    // Function to fetch messages from the server based on selected filter
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

    // Fetch messages when the selected filter changes
    useEffect(() => {
        fetchMessages();
    }, [selectedFilter]);

    // Handler for search input changes
    const handleSearchChange = (event) => {
        setSearchQuery(event.target.value.toLowerCase());
    };

    // Filter messages based on search query
    const filteredMessages = messages.filter(message =>
        message.userName.toLowerCase().includes(searchQuery) ||
        message.userEmail.toLowerCase().includes(searchQuery)
    );

    return (
        
        <Grid container spacing={2} style={{ overflow: 'auto' }}>
            {/* Message List */}
            <Grid item xs={12} md={4}>
                <div className='switch-container'>
                    <h2>Incoming Messages</h2>
                    <InputField
                        label="Search by Name or Email"
                        variant="outlined"
                        onChange={handleSearchChange}
                        style={{ marginBottom: '20px',}}
                    />
                    <div>
                        {/* Filter options */}
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
                    </div>

                    {/* Message list */}
                    <div className="messages-list-container">
                        {isLoading ? (
                            <div>Loading messages...</div>
                        ) : messageError ? (
                            <div>{messageError}</div>
                        ) : (
                            filteredMessages.map(message => (
                                <MessageItem key={message.contactRequestId} message={message} onSelect={setActiveMessage} />
                            ))
                        )}
                    </div>
                </div>
            </Grid>

            {/* Message Details */}
            <Grid item xs={12} md={8}>
                {activeMessage ? (
                    <MessageDetails message={activeMessage} refreshMessages={fetchMessages}/>
                    ) : (
                    <div> Select a message to view details.</div>
                )}
            </Grid>
        </Grid>
    
    );
};

export default ViewMessages;