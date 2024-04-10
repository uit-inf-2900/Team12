import React from 'react';
import exampleImage from '../images/reading.png'; // Import the PNG image

import "../GlobalStyles/main.css";

const Card = ({ title, description }) => {
    
  return (
    <div className="card">
      <img src={exampleImage} alt={title} className="card-image" /> {/* Use imported image */}
      <div className="card-overlay">
            <div className="card-header">
              <div className="card-header-text">
                <h3 className="card-title">{title}</h3>
              </div>
            </div>
            <p className="card-description">Needle size</p>
            <p className='card-description'>Knitting Gauge</p>
            <p className='card-description'>Notes</p>
          </div>
        
    </div>
  );
};

export default Card;