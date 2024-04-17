import React, { useEffect, useState } from 'react';
import axios from 'axios';
import InputField from "../../../Components/InputField";
import "../../../GlobalStyles/main.css";
import CustomButton from '../../../Components/Button';

// Function to update the conversation status
const updateConversationStatus = async (contactRequestId, isActive, isHandled) => {
    try {
        await axios.patch(`http://localhost:5002/api/Contact/${contactRequestId}/IsActive`, JSON.stringify(isActive), {
            headers: {
                'Content-Type': 'application/json'
            }
        });
        await axios.patch(`http://localhost:5002/api/Contact/${contactRequestId}/IsHandled`, JSON.stringify(isHandled), {
            headers: {
                'Content-Type': 'application/json'
            }
        });
        console.log('Conversation status updated successfully');
    } catch (err) {
        console.error('Error updating conversation status:', err);
    }
};

const MessageDetails = ({ message }) => {
    const [reply, setReply] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [messages, setMessages] = useState([]);
    const [isActive, setIsActive] = useState(message?.isActive);
    const [isHandled, setIsHandled] = useState(message?.isHandled);

    const splitMessages = (messageText) => {
        if (!messageText) return [];
        return messageText.split('\n new message \n').map((msg) => ({
            text: msg,
            isResponse: msg.startsWith('Response:')
        }));
    };

    useEffect(() => {
        if (message) {
            setMessages(splitMessages(message.userMessage));
            setIsActive(message.isActive);
            setIsHandled(message.isHandled);
        }
        setReply('');
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
            setErrorMessage('Invalid message, please select a valid message.');
            return;
        }
        try {
            const response = await axios.post(`http://localhost:5002/api/Contact/${message.contactRequestId}/response`, JSON.stringify(reply), {
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            console.log('The response was sent successfully', response.data);
            setReply('');
            setErrorMessage('');
            setMessages([...messages, { text: `Response: ${reply}`, isResponse: true }]);
            updateConversationStatus(message.contactRequestId, true, false);
        } catch (error) {
            console.error(`Failed to send reply for message ${message.contactRequestId}`, error);
            setErrorMessage('Failed to send reply. Please check the data you are sending.');
        }
    };

    const handleFinishConversation = () => {
        updateConversationStatus(message.contactRequestId, false, true);
        setIsActive(false);
        setIsHandled(true);
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
                    multiline
                    onChange={handleReplyChanges}
                    useTextareaStyle={true}
                />
                {errorMessage && <div style={{ color: 'red', marginTop: '10px' }}>{errorMessage}</div>}
                <CustomButton themeMode="light" submit={true} iconName='send'>
                    Send Reply
                </CustomButton>
                {isActive && !isHandled && (
                    <CustomButton themeMode="light" onClick={handleFinishConversation}>
                        Mark Conversation as Finished
                    </CustomButton>
                )}
            </form>
        </div>
    );
};

export default MessageDetails;
