import React, { useState} from "react";
import "./Garnkalkulator.css"; // Pass på at dette er den korrekte stien til din Home.css-fil
import InputField from "../Components/InputField";

// import { Link } from 'react-router-dom';
import Image from "../images/knitting.png";

export const GarnKalkulator = () => {
    const [originalLength, setOriginalLength] = useState('');
    const [originalSkeins, setOriginalSkeins] = useState('');
    const [newLength, setNewLength] = useState('');
    const [requiredSkeins, setRequiredSkeins] = useState(null);
    const [error, setError] = useState('');

    
    const calculateSkeins = () => {
        if (originalLength > 0 && originalSkeins > 0 && newLength > 0) {
            const totalLength = originalLength * originalSkeins;
            const newSkeins = Math.ceil(totalLength / newLength);
            setRequiredSkeins(newSkeins);
        } else {
            alert('Vennligst fyll inn alle feltene med positive tall.');
        }
    };
    return (
        <div className="page-container">
            <div className="custom-box">
                <h1 style={{color:"#F2E4E1"}}> Garnkalkulator </h1>
                <h4 style={{color:"#F2E4E1"}}> Beregn hvor mange nøster du trenger av et garn med ulik løpelengde enn garnet i oppskriften.</h4>
                <h4 style={{color:"#F2E4E1"}}> Strikkefastheten må være den samme. </h4>
                <div className="calculator-container">
                    <div className="inputs-row">
                        <h5> I oppskriften: </h5>
                        <InputField
                            label="Løpelengde"
                            name="original-length"
                            type="number"
                            onChange={e => setOriginalLength(e.target.value)}
                            value={originalLength}
                        />
                        <InputField
                            label="Antall nøster"
                            name="original-skeins"
                            type="number"
                            onChange={e => setOriginalSkeins(e.target.value)}
                            value={originalSkeins}
                        />
                    </div>
                    <div className="inputs-row">
                        <h5> Ditt garn: ........................ </h5>
                            <InputField
                                label="Løpelengde"
                                name="new-length"
                                type="number"
                                onChange={e => setNewLength(e.target.value)}
                                value={newLength}
                            />
                        <button className='dark-button' onClick={calculateSkeins}>Beregn</button>
                    </div>
                        {requiredSkeins !== null && (
                            <div className="result">
                                <div className="calculator-image-container">
                                    <img src={Image}/>
                                </div>
                                <p>Du trenger {requiredSkeins} nøster med løpelengde {newLength}m.</p>
                            </div>
                        )}
                </div>
            </div>
        </div>
    );
};