import React, { useEffect, useState } from 'react';
import axios from 'axios';

import "../../GlobalStyles/main.css";
import MessageItem from './MessageItem';
import MessageDetails from './MessageDetails';



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
        <div className="page-container" style={{ display: 'flex', justifyContent: 'space-between' , 'max-height': '600px'}}>
            <div style={{ width: '30%' }}>
                <h2>Incoming Messages</h2>

                <div className='switch-container'>
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
                </div>

                <div className="messages-list-container"> 
                    {messages.map(message => (
                        <MessageItem key={message.id} message={message} onSelect={setActiveMessage} isSelected={message === activeMessage} />
                        ))}
                </div>
            </div>
            <div   style={{ width: '80%' }}>
                <MessageDetails message={activeMessage} />
            </div>
        </div>
    ); 

};

export default ViewMessages;