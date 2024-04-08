import React, { useState} from "react";
import "./OkeFelleKalkulator.css";

import Image from "../images/openBook.png"

export const OkeFelleKalkulator = () => {
    {/*  */}
    const [numberOfStitches, setNumberOfStitches] = useState('');
    const [numberOfIncreases, setNumberOfIncreases] = useState('');
    const [newStitches, setNewStitches] = useState(null);
    const [error, setError] = useState('');
    const [pattern, setPattern] = useState('');

    const [originalLength, setOriginalLength] = useState('');
    const [originalSkeins, setOriginalSkeins] = useState('');
    const [newLength, setNewLength] = useState('');
    const [requiredSkeins, setRequiredSkeins] = useState(null);

    const calculateFelle = () => {
        if (numberOfStitches > 0 && numberOfIncreases > 0) {
            const newStitchCount = parseInt(numberOfStitches) + parseInt(numberOfIncreases);
            setNewStitches(newStitchCount);

            // beregner mønsteret for økning
            const stitchesBetweenIncreases = Math.floor(numberOfStitches / numberOfIncreases);
            setPattern(`*Strikk ${stitchesBetweenIncreases} masker, øk 1 maske* ${numberOfIncreases} ganger`);            
        } else {
            setError('Vennligst fyll inn alle feltene med positive tall');
        }

    }
        return (
            <div className="page-container">
                <div className="custom-box">
                    <h1 style={{color:"#F2E4E1"}}>Øke Kalkulator</h1>
                    <div className="calculator-container">
                        <div className="input-row">
                            <div className="input-group">
                                <label htmlFor="stitches">Antall masker på pinnen</label>
                                <input
                                    type="number"
                                    id="stitches"
                                    value={numberOfStitches}
                                    onChange={e => setNumberOfStitches(e.target.value)}
                                    placeholder="Antall masker"
                                />
                            </div>
                            <div className="input-group">
                            <label htmlFor="increases">Antall økninger</label>
                            <input
                                type="number"
                                id="increases"
                                value={numberOfIncreases}
                                onChange={e => setNumberOfIncreases(e.target.value)}
                                placeholder="Antall økninger"
                            />
                            </div>
                            <div className="input-group">
                                <button className='dark-button' onClick={calculateFelle}>Beregn</button>
                            </div>
                        </div>
                        {newStitches !== null && pattern && (
                            <div className="result">
                                <div className="calculator-image-container">
                                    <img src={Image}/>
                                </div>
                                <p>{pattern}</p>
                                <p>Du har nå {newStitches} masker på pinnen</p>
                            </div>
                        )}
                        {error && <p className="error-message">{error}</p>}
                    </div>
                </div>
            </div>
    ); 
}

export default OkeFelleKalkulator; 