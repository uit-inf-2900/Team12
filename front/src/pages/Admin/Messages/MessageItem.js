import React from 'react';

// MessageItem represents a single message in the list and allows selection
const MessageItem = ({ message, onSelect, isSelected }) => {
    // Styles for the message item, highlighting if selected
    const messageItemStyle = {
        cursor: 'pointer',
        margin: '10px',
        padding: '10px',
        border: '1px solid #ccc',
        borderRadius: '5px',
        backgroundColor: isSelected ? '#F6964B' : 'transparent',
    };

    // Render the message item with click handling for selection
    return (
        <div onClick={() => onSelect(message)} style={messageItemStyle}>
            <h3>From: {message.userName}</h3>
        </div>
    );
};

export default MessageItem;
