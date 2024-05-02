
import React, { useState } from 'react';
import { HiChartPie, HiInbox, HiUser } from "react-icons/hi";
import { IoMailOpenOutline } from "react-icons/io5";

import "../../GlobalStyles/main.css";


/**
 * Sidebar component for navigation within the admin panel.
 * @param {Function} onToggleView  Function to toggle between different views.
 * @param {string} activeView Currently active view.
 * @returns {JSX.Element} Sidebar UI.
 */
const Sidebar = ({ onToggleView, activeView }) => {
    // Menu items for the sidebar 
    const menuItems = [
        { name: 'dashboard', icon: <HiChartPie />, label: 'Dashboard' },
        { name: 'users', icon: <HiUser />, label: 'Users' },
        { name: 'messages', icon: <HiInbox />, label: 'Messages' },
        { name: 'newsletter', icon: <IoMailOpenOutline />, label: 'Newsletter'}
    ];

    // State for the sidebar hover effect. If hoverd over, the sidebar will expand to show the full label and icon.
    const [isHovering, setIsHovering] = useState(false);


    return (
        <div  className={`sidebar ${isHovering ? 'expanded' : 'collapsed'}`}
            // Track the mouse to determine if the sidebar should be expanded or collapsed
            onMouseEnter={() => setIsHovering(true)}
            onMouseLeave={() => setIsHovering(false)}>
                {/* Render each menu item */}
                {menuItems.map(item => (
                    <div 
                        key={item.name} 
                        className={`sidebar-item ${activeView === item.name ? 'active' : ''}`} 
                        onClick={() => onToggleView(item.name)}
                    >
                        {item.icon}
                        <span>{item.label}</span>
                    </div>
                ))}
        </div>
    );
};





export default Sidebar;



