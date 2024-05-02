import exampleImage from '../../../images/reading.png';
import React, { useState } from 'react';

const GeneralCard = ({ title, stats = [],  image = exampleImage, chartComponent, onClick, onDelete, onEdit }) => {
    const [isHovered, setIsHovered] = useState(false);

    return (
        <div className="card" onClick={onClick} onMouseEnter={() => setIsHovered(true)} onMouseLeave={() => setIsHovered(false)}>
            {/* Render chart if provided */}
            {chartComponent || <img src={image} alt="Default" className="card-image" />}
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
                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '10px' }}>
                    <button onClick={onEdit} variant="outlined" color="primary">
                        Edit
                    </button>
                    <button onClick={onDelete} variant="outlined" color="secondary">
                        Delete
                    </button>
                </div>
            </div>
            <div className="card-footer">
                {!isHovered && stats.length > 0 && <h4>{stats[0].label}: {stats[0].value}</h4>}
            </div>
        </div>
    );
};

export default GeneralCard;