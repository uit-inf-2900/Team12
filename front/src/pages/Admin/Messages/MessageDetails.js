import React, { useEffect, useState } from 'react';
import axios from 'axios';
import InputField from "../../../Components/InputField";
import "../../../GlobalStyles/main.css";
import CustomButton from '../../../Components/Button';
import SetAlert from '../../../Components/Alert';



const MessageDetails = ({ message }) => {
    const [reply, setReply] = useState('');
    // const [errorMessage, setErrorMessage] = useState('');
    const [messages, setMessages] = useState([]);
    const [isActive, setIsActive] = useState(message?.isActive);
    const [isHandled, setIsHandled] = useState(message?.isHandled);
    const [alertOpen, setAlertOpen] = useState(false);
    const [alertSeverity, setAlertSeverity] = useState('info');
    const [alertMessage, setAlertMessage] = useState('');

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
            setAlertMessage('Conversation status updated successfully');
            setAlertSeverity('success');
            setAlertOpen(true);
        } catch (err) {
            console.error('Error updating conversation status:', err);
            setAlertMessage('Failed to update conversation status');
            setAlertSeverity('error');
            setAlertOpen(true);
        }
    };
    // Function to split the message text into individual messages
    const splitMessages = (messageText) => {
        if (!messageText) return [];
        return messageText.split('\n new message \n').map((msg) => ({
            text: msg,
            isResponse: msg.startsWith(' Response:')
        }));
    };


    // Update the component state when the message prop changes or is set
    useEffect(() => {
        // If the message is set, update the component state with the message details
        if (message) {
            setMessages(splitMessages(message.userMessage));
            setIsActive(message.isActive);
            setIsHandled(message.isHandled);
        }
        setReply('');
        // setErrorMessage('');
    }, [message]);

    // Function to handle changes to the reply input field and clear the error message
    const handleReplyChanges = (e) => {
        setReply(e.target.value);
        // setErrorMessage('');
    };

    // Function to handle the form submission and send the reply to the server
    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validate the reply and message before sending 
        if (!reply.trim()) {
            // setErrorMessage('Please write a reply before sending.');
            setAlertMessage('Please write a reply before sending.');
            setAlertSeverity('error');
            setAlertOpen(true);
            return;
        }

        // Check that it is a valid message object and has a ContactRequestId property
        if (!message) {
            console.error('Invalid message object or missing ContactRequestId');
            // setErrorMessage('Invalid message, please select a valid message.');
            setAlertMessage('Invalid message, please select a valid message.');
            setAlertSeverity('error');
            setAlertOpen(true);
            return;
        }

        // Try to send the reply to the server and update the conversation status
        try {
            const response = await axios.post(`http://localhost:5002/api/Contact/${message.contactRequestId}/response`, JSON.stringify(reply), {
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            console.log('The response was sent successfully', response.data);
            setReply('');
            // setErrorMessage('');
            setMessages([...messages, { text: `Response: ${reply}`, isResponse: true }]);
            updateConversationStatus(message.contactRequestId, true, false);
            setAlertMessage('Reply sent successfully');
            setAlertSeverity('success');
            setAlertOpen(true);
        } catch (error) {
            console.error(`Failed to send reply for message ${message.contactRequestId}`, error);
            // setErrorMessage('Failed to send reply. Please check the data you are sending.');
            setAlertMessage('Failed to send reply. Please check the data you are sending.');
            setAlertSeverity('error');
            setAlertOpen(true);
        }
    };

    const handleFinishConversation = () => {
        updateConversationStatus(message.contactRequestId, false, true);
        setIsActive(false);
        setIsHandled(true);
    };


    // If no message is selected, display a message to select a message 
    if (!message) return <div>Select a message to view details.</div>;

    return (
        <div className='message-box'>
            <div style={{ textAlign: 'center', width: "100%" }}>

                {/* Who is the message from */}
                <InputField
                    label='From'
                    type="text"
                    value={`${message.userName} (${message.userEmail})`}
                    readOnly
                    className="input"
                    style={{ cursor: 'default' }}
                />

                {/* Display the message (is it user or admin that has sent the message) */}
                {messages.map((msg, index) => (
                    <InputField
                        key={index}
                        label={msg.isResponse ? 'Response' : 'Message'}
                        type="text"
                        multiline
                        value={msg.text.replace(/^ Response:\s*/, '')}
                        readOnly
                        className="input"
                        style={{ cursor: 'default', height: 'auto' }}
                    />
                ))}
            </div>
            <form onSubmit={handleSubmit} style={{ textAlign: 'center', width: "100%" }}>
                {/* Replyform to reply to the message */}
                <InputField
                    style={{ resize: 'vertical', height: '100px' }}
                    type="text"
                    label='Write your reply here...'
                    value={reply}
                    multiline
                    onChange={handleReplyChanges}
                    useTextareaStyle={true}
                />

                {/* Send a message */}
                <CustomButton themeMode="light" submit={true} iconName='send'>
                    Send Reply
                </CustomButton>
                {/* Mark the conversation as finished, this can only be done if the conversation is active and not handled yet */}
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
