import exampleImage from '../../../images/reading.png';
import React, { useState } from 'react';

const GeneralCard = ({ title, stats = [],  image = exampleImage, chartComponent, onClick, onDelete, onEdit, hovermessage }) => {
    const [isHovered, setIsHovered] = useState(false);

    return (
        <div className="card" onClick={onClick} onMouseEnter={() => setIsHovered(true)} onMouseLeave={() => setIsHovered(false)}>
            {/* Render chart if provided */}
            <div className="card-link" style={{ position: 'relative', cursor: 'pointer' }}>
                {chartComponent || <img src={image} alt="Default" className="card-image" />}
                
                {/* Conditionally render the hover message if hovermessage prop is provided */}
                {isHovered && hovermessage && (
                    <div className="hover-message" style={{ display: 'block', position: 'absolute', bottom: '10px', width: '100%', textAlign: 'center', color: 'white', backgroundColor: 'rgba(0, 0, 0, 0.5)', padding: '10px' }}>
                        {hovermessage}
                    </div>
                )}
            </div>
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
                    
                    {onEdit && (<button onClick={onEdit} variant="outlined" color="primary">
                        Edit
                    </button>)}

                    {onDelete && (<button onClick={onDelete} variant="outlined" color="secondary">
                        Delete
                    </button>)}
                </div>
            </div>
            <div className="card-footer">
                {!isHovered && stats.length > 0 && <h4>{stats[0].label}: {stats[0].value}</h4>}
            </div>
        </div>
    );
};

export default GeneralCard;