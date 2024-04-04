import React from "react";

const SwitchContainer = ({ options, activeStatus, setActiveStatus }) => {
    const switchStyle = {
        fontSize: '1.2em',
        borderRadius: '8px',
        transition: 'all 0.3s ease',
        padding: '20px 30px',
        margin: '0 2px',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
    };

    const handleSwitchClick = (id) => {
        if (activeStatus !== id) { // Sjekk om bryteren allerede er aktiv
            setActiveStatus(id);
        }
    };

    return (
        <div className="switch-container" style={{ marginBottom: '20px', display: 'flex', flexDirection: 'row', justifyContent: 'center' }}>
            {options.map(option => (
                <div
                    key={option.id}
                    className={`switch-option ${activeStatus === option.id ? 'active' : 'inactive'}`}
                    onClick={() => handleSwitchClick(option.id)} // Endret til å kalle handleSwitchClick
                    style={switchStyle}
                >
                    {option.label}
                </div>
            ))}
        </div>
    );
}

export default SwitchContainer;
