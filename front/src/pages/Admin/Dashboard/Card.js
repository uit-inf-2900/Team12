import React, { useState } from 'react';
import "../../../GlobalStyles/main.css";
import exampleImage from '../../../images/reading.png';
const GeneralCard = ({ title, stats = [], image = exampleImage, onClick }) => {
    const [isHovered, setIsHovered] = useState(false);

    return (
        <div className="card" onClick={onClick} onMouseEnter={() => setIsHovered(true)} onMouseLeave={() => setIsHovered(false)}>
            <img src={image} alt="Users" className="card-image" />
            <div className={`card-overlay ${isHovered ? 'show' : ''}`}>
                {isHovered && (
                    <div>
                        <div className="card-header">
                            <div className="card-header-text">
                                <h3 className="card-title">{title}</h3>
                            </div>
                        </div>
                        {stats.map((stat, index) => (
                            <p key={index}>{stat.label}: {stat.value}</p>
                        ))}
                    </div>
                )}
            </div>
            <div className="card-footer">
                {!isHovered && stats.length > 0 && <h4>{stats[0].label}: {stats[0].value}</h4>}
            </div>
        </div>
    );
};

export default GeneralCard;
