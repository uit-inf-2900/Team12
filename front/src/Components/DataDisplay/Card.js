import React from 'react';
import exampleImage from '../../images/reading.png';
import "../../GlobalStyles/main.css";

const getCustomLabel = (propName) => {
    const labels = {
        Type: "Yarn type",
        Manufacturer: "Yarn Brand",
        Color: "Color",
        Gauge: "Gauge",
        Weight: "Weight",
        Length: "Length",
        NeedleSize: "Needle Size",
        Yarns: "Yarns",
        Notes: "Notes",
        Needles: "Needles"
        // Add more labels here
    };

    // Return lable
    return labels[propName] || propName;
};

  


const Card = ({ title, onClick, onDelete, yarns, needles, ...descriptions }) => {
    return (
        <div className="card" onClick={onClick}>
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
                {needles && (
                    <div className="card-description">
                        <p>{getCustomLabel('Needles')}:</p>
                        <ul>
                            {needles.map((needle) => (
                                <li key={needle.itemId}>
                                    <strong> {needle.type}, size {needle.size} and {needle.length} cm long</strong>

                                </li>
                            ))}
                        </ul>
                    </div>
                )}
                {yarns && (
                    <div className="card-description">
                        <p>{getCustomLabel('Yarns')}:</p>
                        <ul>
                            {yarns.map((yarn) => (
                                <li key={yarn.itemId}>
                                    <strong> {yarn.type} by {yarn.manufacturer}</strong>

                                </li>
                            ))}
                        </ul>
                    </div>
                )}
                
            </div>
            
        </div>
        );
    };

export default Card;