// Sidebar.js
import React, { useState } from 'react';
import { HiChartPie, HiInbox, HiUser } from "react-icons/hi";
import "../../GlobalStyles/main.css";


const Sidebar = ({ onShowUsers, onShowMessages }) => {
    const [isHovering, setIsHovering] = useState(false);

    return (
        <div    className={`sidebar ${isHovering ? 'expanded' : 'collapsed'}`}
                onMouseEnter={() => setIsHovering(true)}
                onMouseLeave={() => setIsHovering(false)}>
            <div className="sidebar-item">
                <HiChartPie />
                <span>Dashboard</span>
            </div>
            <div className="sidebar-item" onClick={() => onShowUsers()}>
                <HiUser />
                <span>Users</span>
            </div>
            <div className="sidebar-item" onClick={() => onShowMessages()}>
                <HiInbox />
                <span>Messages</span>
            </div>
        </div>
    );
};

export default Sidebar;
