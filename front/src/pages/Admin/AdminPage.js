// AdminPage.js
import React, { useState } from 'react';
import "../../GlobalStyles/main.css";
import ViewMessages from './Messages/ViewMessages';
import ViewUsers from './ViewUsers';
import Sidebar from './Sidebar'; // Adjust the path according to where you save the Sidebar component

const AdminPage = () => {
    const [showMessages, setShowMessages] = useState(false);
    const [showUsers, setShowUsers] = useState(false);

    const toggleShowUsers = () => {
        if (!showUsers) {
            setShowUsers(true);
        }
        if (showMessages) {
            setShowMessages(false);
        }
    };

    const toggleShowMessages = () => {
        if (!showMessages) {
            setShowMessages(true);
        }
        if (showUsers) {
            setShowUsers(false);
        }
    };

    return (
        <div className="admin-page-layout">
            <Sidebar onShowUsers={toggleShowUsers} onShowMessages={toggleShowMessages} />
            <div className="Admin-page-content">
            <h1>Admin Page</h1>
                {showUsers && <ViewUsers />}
                {showMessages && <ViewMessages />}
            </div>
        </div>
    );
};

export default AdminPage;
