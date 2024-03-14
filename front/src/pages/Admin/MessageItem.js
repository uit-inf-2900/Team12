import React, { useEffect, useState } from 'react';
import axios from 'axios';


const MessageItem = ({ message, onSelect, isSelected }) => {
    const messageItemStyle = {
        cursor: 'pointer',
        margin: '10px',
        padding: '10px',
        border: '1px solid #ccc',
        borderRadius: '5px',
        backgroundColor: isSelected ? '#F6964B' : 'transparent',
    };

    
    return (
        <div onClick={() => onSelect(message)}
        style={messageItemStyle}>
            <h3>From: {message.userName}</h3>
        </div>
    );
};
export default MessageItem;