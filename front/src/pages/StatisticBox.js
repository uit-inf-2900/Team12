import React from 'react';
import './StatisticBox.css';


{/* legge inn en funksjon for å hente ut info fra databasen */}
{/* Hente antall nøster brukt */}
{/* Hente antall meter garn brukt */}
{/* Hente antall fullførte prosjekter */}
{/* Hente antall .... */}

const StatisticBox = ({ icon, label, value }) => {
    return (
    <div className="statistic-box">
        {icon && <img src={icon} alt={label} className="icon" />}
        <div className="label">{label}</div>
        <div className="value">{value}</div>
    </div>    
    );
};

export default StatisticBox;
