
import React, { useState } from 'react';
import { HiChartPie, HiInbox, HiUser } from "react-icons/hi";
import "../../GlobalStyles/main.css";

const Sidebar = ({ onToggleView, activeView }) => {
    const menuItems = [
        { name: 'dashboard', icon: <HiChartPie />, label: 'Dashboard' },
        { name: 'users', icon: <HiUser />, label: 'Users' },
        { name: 'messages', icon: <HiInbox />, label: 'Messages' },
    ];

    const [isHovering, setIsHovering] = useState(false);


    return (
        <div    className={`sidebar ${isHovering ? 'expanded' : 'collapsed'}`}
        onMouseEnter={() => setIsHovering(true)}
        onMouseLeave={() => setIsHovering(false)}>
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



