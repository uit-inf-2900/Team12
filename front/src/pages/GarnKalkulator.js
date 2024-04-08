import React, { useState} from "react";
import "./Garnkalkulator.css"; // Pass på at dette er den korrekte stien til din Home.css-fil

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
                        <h4> I oppskriften: </h4>
                        <div className="input-group">
                            <label htmlFor="original-length">Løpelengde</label>
                            <input
                                type="number"
                                id="original-length"
                                value={originalLength}
                                onChange={e => setOriginalLength(e.target.value)}
                                placeholder="Løpelengde"
                            />
                        </div>
                        <div className="input-group">
                            <label htmlFor="original-skeins">Antall nøster</label>
                            <input
                                type="number"
                                id="original-skeins"
                                value={originalSkeins}
                                onChange={e => setOriginalSkeins(e.target.value)}
                                placeholder="Antall nøster"
                            />
                        </div>
                    </div>
                    <div className="inputs-row">
                        <h4> Ditt garn: ....... </h4>
                        <div className="input-group">
                            <label htmlFor="new-length">Løpelengde</label>
                            <input
                                type="number"
                                id="new-length"
                                value={newLength}
                                onChange={e => setNewLength(e.target.value)}
                                placeholder="Løpelengde"
                            />
                        </div>
                        <div className="input-group">
                            <button className='dark-button' onClick={calculateSkeins}>Beregn</button>
                        </div>
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