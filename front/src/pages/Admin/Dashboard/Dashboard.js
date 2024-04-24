import React, { useState, useEffect } from 'react';
import CardDashbord from './CardDashbord'; // Pass på at importstien stemmer
import "../../../GlobalStyles/main.css";

const Dashboard = ({ toggleView }) => {
    const [usersData, setUsersData] = useState([]);
    const [messagesData, setMessagesData] = useState([]);

    useEffect(() => {
        // Get userinfo
        fetch('http://localhost:5002/getUsers', { headers: { 'Accept': 'application/json' }})
            .then(response => response.json())
            .then(data => setUsersData(data))
            .catch(error => console.error('Error fetching users:', error));

        // Get messages 
        fetch('http://localhost:5002/api/Contact?isActive=false&isHandled=false', { headers: { 'Accept': 'application/json' }})
            .then(response => response.json())
            .then(data => setMessagesData(data))
            .catch(error => console.error('Error fetching messages:', error));
    }, []);

    return (
        <div>
            <h1>Dashboard</h1>
            <CardDashbord title="Total Users" value={usersData.length} onClick={() => toggleView('users')} />
            <CardDashbord title="Unread Messages" value={messagesData.length} onClick={() => toggleView('messages')} />
        </div>
    );
};

export default Dashboard;
