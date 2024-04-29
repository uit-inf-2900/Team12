import React, { useState } from 'react';
import "../../GlobalStyles/main.css";
import ViewMessages from './Messages/ViewMessages';
import ViewUsers from './Users/ViewUsers';
import Sidebar from './Sidebar';
import Dashboard from './Dashboard/Dashboard';

const AdminPage = () => {
    const [activeView, setActiveView] = useState('dashboard');

    const toggleView = (view) => {
        setActiveView(prevView => prevView === view ? '' : view);
    };

    return (
        <div style={{ display: 'flex', margin: 'auto', 'padding-top':'20px', overflow:'auto'}}>
            <Sidebar onToggleView={toggleView} activeView={activeView}/>
            <div className="Admin-page-content">
                <h1>Admin Page</h1>
                {activeView === 'users' && <ViewUsers />}
                {activeView === 'messages' && <ViewMessages />}
                {activeView === 'dashboard' && <Dashboard toggleView={toggleView}/>}
            </div>
        </div>
    );
};

export default AdminPage;
