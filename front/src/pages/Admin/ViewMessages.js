import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import validator from 'validator'; 
import axios from 'axios';

import InputField from "../../Components/InputField";
import "../../GlobalStyles/main.css";


const ViewMessages = () => {
    const [messages, setMessages] = useState([]);

    // Get all the messages from the database
    useEffect(()=> {
        axios.get('http://localhost:5002/api/Contact?isActive=false')
        .then(response => {
            setMessages(response.data);
        })
        .catch(error => {
            console.log('An error occurred when fetching the messaged from the database',error);
        });
    }, []);

    return(
        <div className="page-container">
            <h2> Inncomming messages </h2>
            <ul>
                {messages.map(message => {
                    return(
                        <li key={message.id}>
                            <h3>From: {message.userName}</h3>
                            <p>Email: {message.userEmail}</p>
                            <p>Message: {message.userMessage}</p>
                        </li>
                    );
                })}
            </ul>
        </div>
    );

};

export default ViewMessages;