import React from 'react';
import exampleImage from '../images/reading.png'; // Import the PNG image
<<<<<<< HEAD
import UploadedRecipes from '../pages/RecipeManagement/UploadedRecipes';
=======
import { CustomButton } from './Button';
>>>>>>> main

import "../GlobalStyles/Card.css";

const getCustomLabel = (propName) => {
    const labels = {
        author: "Author",
        knittingGauge: "Knitting Gauge",
        needleSize: "Needle size (mm)",
        notes: "Notes",
        yarntype: "Yarn type",
        skeinsYarn: "Skein of yarn",
        color: "Color",
        weight: "Weight",
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



  


const Card = ({ title, onClick, onDelete, ...descriptions }) => {
<<<<<<< HEAD



    return (
    <div className="card" onClick={onClick}>
      <img src={exampleImage} alt={title} className="card-image" /> {/* Use imported image */}
        <div className="card-overlay">
            <div className="card-header">
                <div className="card-header-text">
                    <h3 className="card-title">{title}</h3>
                </div>
                <button className="delete-button" onClick={onDelete}>
                    <i className="fa fa-trash" aria-hidden="true"></i> {/* Add your trash icon here */}
                </button>
=======
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
>>>>>>> main
            </div>
            
        </div>
        );
    };

export default Card;