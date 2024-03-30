import React, { useState } from 'react';
import "../../GlobalStyles/main.css";
import ViewMessages from './Messages/ViewMessages';
import ViewUsers from './ViewUsers';
import Sidebar from './Sidebar';
import Dashboard from './Dashboard';

const AdminPage = () => {
    const [activeView, setActiveView] = useState('');

    const toggleView = (view) => {
        setActiveView(prevView => prevView === view ? '' : view);
    };

    return (
        <div className="admin-page-layout">
            <Sidebar onToggleView={toggleView} activeView={activeView}/>
            <div className="Admin-page-content">
                <h1>Admin Page</h1>
                {activeView === 'users' && <ViewUsers />}
                {activeView === 'messages' && <ViewMessages />}
                {activeView === 'dashboard' && <Dashboard />}
            </div>
        </div>
    );
};

export default AdminPage;
