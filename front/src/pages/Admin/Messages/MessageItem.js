import React from 'react';
import InputField from '../../../Components/InputField';

// MessageItem represents a single message in the list and allows selection
const MessageItem = ({ message, onSelect, isSelected }) => {
    // Render the message item with click handling for selection
    return (
        <div onClick={() => onSelect(message)}>
            <InputField
                    label='From'
                    type="text"
                    value={`${message.userName}`}
                    readOnly
                    className="input"
                />
        </div>
    );
};



export default MessageItem;
