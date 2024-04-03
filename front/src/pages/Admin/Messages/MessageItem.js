import React from 'react';
import InputField from '../../../Components/InputField';

// MessageItem represents a single message in the list and allows selection
const MessageItem = ({ message, onSelect, isSelected }) => {
    // Styles for the message item, highlighting if selected
    const messageItemStyle = {
        cursor: 'pointer',
        margin: '5px',
        padding: '5px',
        border: '1px solid #ccc',
        borderRadius: '5px',
        backgroundColor: isSelected ? '#F6964B' : 'transparent',
    };

    // Render the message item with click handling for selection
    return (
        <div onClick={() => onSelect(message)} >
            <InputField
                    label='From'
                    type="text"
                    value={`${message.userName} `}
                    readOnly
                    className="input"
                />
        </div>
    );
};



export default MessageItem;
