import React from 'react';
import exampleImage from '../images/reading.png'; // Import the PNG image

import "../GlobalStyles/main.css";

const getCustomLabel = (propName) => {
    const labels = {
        knittingGauge: "Knitting Gauge",
        needleSize: "Needle size (mm)",
        notes: "Notes",
        yarntype: "Yarn type",
        skeinsYarn: "Skein of yarn",
        color: "Color",
        weight: "Weight",
        // Add more labels here
    };

    // Return lable
    return labels[propName] || propName;
};

  


const Card = ({ title, ...descriptions }) => {
    
    return (
    <div className="card">
      <img src={exampleImage} alt={title} className="card-image" /> {/* Use imported image */}
        <div className="card-overlay">
            <div className="card-header">
                <div className="card-header-text">
                    <h3 className="card-title">{title}</h3>
                </div>
            </div>
            {Object.keys(descriptions).map(key => (
                <p className="card-description" key={key}> {getCustomLabel(key)}: {descriptions[key]}</p>
            ))}
        </div>
        
    </div>
    );
};

export default Card;