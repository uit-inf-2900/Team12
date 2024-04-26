import React from 'react';
import exampleImage from '../images/reading.png'; // Import the PNG image
import CustomButton from './Button';

import "../GlobalStyles/main.css";

const getCustomLabel = (propName) => {
    const labels = {
        Type: "Yarn type",
        Manufacturer: "Yarn Brand",
        Color: "Color",
        Gauge: "Gauge",
        Weight: "Weight",
        Length: "Length",
        // Add more labels here
    };

    // Return lable
    return labels[propName] || propName;
};

  


const Card = ({ ItemID, Type, Manufacturer, Color, Weight, Length, onDelete }) => {
    // console.log({ Type, Manufacturer, Color, Weight, Length });
    const handleDeleteClick = () => {
        console.log(`Attempting to delete yarn with ID: ${ItemID}`);
        onDelete(ItemID);
    };
    return (
        <div className="card" >
        <img src={exampleImage} alt={Manufacturer} className="card-image" /> {/* Use imported image */}
            <div className="card-overlay">
                <div className="card-header">
                    <div className="card-header-text">
                        <h3 className="card-title">{Manufacturer}</h3>
                    </div>
                </div>
                    <p className="card-description" style={{marginBottom: '-25px'}}>Yarn type: {Type}</p>
                    <p className="card-description" style={{marginBottom: '-25px'}}>Yarn Brand: {Manufacturer}</p>
                    <p className="card-description" style={{marginBottom: '-25px'}}>Color: {Color}</p>
                    <p className="card-description" style={{marginBottom: '-25px'}}>Weight: {Weight}</p>
                    <p className="card-description" style={{marginBottom: '-25px'}}>Length: {Length}</p>
                    <CustomButton onClick={handleDeleteClick} className="delete-button" style={{marginBottom: '15px'}}>Delete</CustomButton>
            </div>
        </div>
    );
};

export default Card;