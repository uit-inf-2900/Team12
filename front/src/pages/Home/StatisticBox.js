import React from 'react';
import './StatisticBox.css';

/**
 * Represents a statistic box with icon, lable, value and opportunity to go to the 
 * relevant page by click.
 */
const StatisticBox = ({ icon, label, value, onClick }) => {
    return (
    <div className="statistic-box" onClick={onClick}>
        {icon && <img src={icon} alt={label} className="icon" />}
        <h1 className="label">{label}</h1>
        <p className="value">{value}</p>
    </div>    
    );
};

export default StatisticBox;
