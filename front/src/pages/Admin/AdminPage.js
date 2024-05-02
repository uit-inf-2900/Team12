import React, { useState } from 'react';
import "../../GlobalStyles/main.css";
import ViewMessages from './Messages/ViewMessages';
import ViewUsers from './Users/ViewUsers';
import Dashboard from './Dashboard/Dashboard';
import ViewSubscribers from './NewsLetter';
import { FaArrowLeft } from 'react-icons/fa';


/**
 * Component for the admin page, displaying different views based on user interaction.
 * @returns {JSX.Element} - AdminPage UI.
 */
const AdminPage = () => {
    // State to manage active view
    const [activeView, setActiveView] = useState('dashboard');

    /**
     * Toggles the active view based on user interaction.
     * @param {string} view - The view to be toggled.
     */
    const toggleView = (view) => {
        setActiveView(prevView => prevView === view ? 'dashboard' : view);
    };

    return (
        <div  className='Admin-page-content' style={{ display: 'flex', margin: 'auto', paddingTop: '20px', overflow: 'auto', position: 'relative' }}>
            {/* Back button to navigate to the dashboard */}
            {activeView !== 'dashboard' && (
                <button style={{ position: 'absolute', right: 20, top: 20 }} onClick={() => toggleView('dashboard')}>
                    <FaArrowLeft /> Back to Dashboard
                </button>
            )}
            <div>
                <h1>Admin Page</h1>
                {/* Rendering different views based on activeView state */}
                {activeView === 'users' && <ViewUsers />}
                {activeView === 'messages' && <ViewMessages />}
                {activeView === 'newsletter' && <ViewSubscribers />}
                {activeView === 'dashboard' && <Dashboard toggleView={toggleView}/>}
            </div>
        </div>
    );
};

export default AdminPage;
