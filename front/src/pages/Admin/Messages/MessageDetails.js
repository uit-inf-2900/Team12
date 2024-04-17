import React, { useEffect, useState } from 'react';
import axios from 'axios';
import InputField from "../../../Components/InputField";
import "../../../GlobalStyles/main.css";
import CustomButton from '../../../Components/Button';

const MessageDetails = ({ message }) => {
    const [reply, setReply] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [messages, setMessages] = useState([]);


    // function to split messages and replies 
    const splitMessages = (messageText) => {
        if (!messageText) return [];
        return messageText.split('\n\n').map((msg) => ({
            text: msg,
            isResponse: msg.startsWith('Response:')
        }));
    };

    useEffect(() => {
        if (message) {
            setMessages(splitMessages(message.userMessage));
        }
        setReply('');
        // setResponseMessage(message?.responseMessage || '');
        setErrorMessage('');
    }, [message]);

    const handleReplyChanges = (e) => {
        setReply(e.target.value);
        setErrorMessage('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!reply.trim()) {
            setErrorMessage('Please write a reply before sending.');
            return;
        }

        if (!message) {
            console.error('Invalid message object or missing ContactRequestId');
            setErrorMessage('Invalid message or message ID. Please select a valid message.');
            return;
        }

        // Bruker contactRequestId fra message-objektet for API-kallet
        try {
            const response = await axios.post(`http://localhost:5002/api/Contact/${message.contactRequestId}/response`, JSON.stringify(reply), {
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            console.log('The response was sent successfully', response.data);
            setReply(''); // Tømmer svartekstfeltet
            // setResponseMessage(reply); // Oppdaterer visningen av svaret
            setErrorMessage(''); // Fjerner eventuelle feilmeldinger
            setMessages([...messages, { text: `Response: ${reply}`, isResponse: true }]);
        } 
        catch (error) {
            console.error(`Failed to send reply for message ${message.contactRequestId}`, error);
            console.log(error.response.data); // Dette vil vise detaljert informasjon om feilen fra serveren
            setErrorMessage('Failed to send reply. Please check the data you are sending.');
        }
    };

    if (!message) return <div>Select a message to view details.</div>;

    return (
        <div className='message-box'>
            <div style={{ textAlign: 'center', width: "100%" }}>
                <InputField
                    label='From'
                    type="text"
                    value={`${message.userName} (${message.userEmail})`}
                    readOnly
                    className="input"
                    style={{ cursor: 'default' }}
                />

                {messages.map((msg, index) => (
                    <InputField
                        key={index}
                        label={msg.isResponse ? 'Response' : 'Message'}
                        type="text"
                        multiline
                        value={msg.text.replace(/^Response:\s*/, '')}
                        readOnly
                        className="input"
                        style={{ cursor: 'default', height: 'auto' }}
                    /> 
                ))}
            </div>
            <form onSubmit={handleSubmit} style={{ textAlign: 'center', width: "100%" }}>
                <InputField 
                    style={{ resize: 'vertical', height: '100px' }}
                    type="text"
                    label='Write your reply here...'
                    value={reply}
                    onChange={handleReplyChanges}
                    useTextareaStyle={true}
                />
                {errorMessage && <div style={{ color: 'red', marginTop: '10px' }}>{errorMessage}</div>}
                <CustomButton 
                    themeMode="light" submit={true} iconName='send'>
                        Send Reply
                </CustomButton>            
            </form>
        </div>
    );
};

export default MessageDetails;
