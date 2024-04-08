import React, { useState} from "react";
import "./OkeFelleKalkulator.css";
import SwitchContainer from "../Components/SwitchContainer";
import InputField from "../Components/InputField";

import Image from "../images/openBook.png"

export const OkeFelleKalkulator = () => {
    {/*  */}
    const [numberOfStitches, setNumberOfStitches] = useState('');
    const [numberOfIncreases, setNumberOfIncreases] = useState('');
    const [newStitches, setNewStitches] = useState(null);
    const [error, setError] = useState('');
    const [pattern, setPattern] = useState('');
    const [activeStatus, setActiveStatus] = useState('in-progress');
    const [numberOfDecreases, setNumberOfDecreases] = useState('');
    

    const [originalLength, setOriginalLength] = useState('');
    const [originalSkeins, setOriginalSkeins] = useState('');
    const [newLength, setNewLength] = useState('');
    const [requiredSkeins, setRequiredSkeins] = useState(null);

    const options = [
        { id: 'øke', label: 'Øke' },
        { id: 'felle', label: 'Felle' }
    ];

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

    const calculateDecrease = () => {
        if (numberOfStitches > 0 && numberOfDecreases > 0) {
            const newStitchCount = parseInt(numberOfStitches) - parseInt(numberOfDecreases);
            setNewStitches(newStitchCount);

            // 
            const stitchesBetweenDecreases = Math.floor(numberOfStitches / numberOfDecreases);
            const remainder = numberOfStitches % numberOfDecreases;
            let patternString = `*Strikk ${stitchesBetweenDecreases - 1} masker, strikk 2 sammen*`;

            //
            if (remainder > 0) {
                patternString += ` gjenta ${numberOfDecreases - 1} ganger, strikk de siste ${remainder + stitchesBetweenDecreases - 1} masker, strikk 2 sammen`;
            } else {
                patternString += ` gjenta ${numberOfDecreases} ganger`;
            }
            setPattern(patternString);
        } else {
            setError('Vennligst fyll inn alle feltene med positive tall');
        }
    }

    }
        return (
            <div className="page-container">
                <SwitchContainer 
                    options={options}
                    activeStatus={activeStatus}
                    setActiveStatus={setActiveStatus}
                />
                {/* ØKE KALKULATOREN */}
                <div className="custom-box">
                    <h1 style={{color:"#F2E4E1"}}>Øke Kalkulator</h1>
                    <div className="calculator-container">
                        <div className="input-row">
                            <label htmlFor="stitches">Antall masker på pinnen</label>
                            <InputField
                                label="Antall masker på pinnen"
                                name="stitches"
                                type="number"
                                onChange={e => setNumberOfStitches(e.target.value)}
                                value={numberOfStitches}
                            />
                            <label htmlFor="increases">Antall økninger</label>
                            <InputField
                                label="Antall økninger"
                                name="increases"
                                type="number"
                                onChange={e => setNumberOfIncreases(e.target.value)}
                                value={numberOfIncreases}
                            />
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
                {/* FELLE KALKULATOREN */}
                <div className="custom-box">
                    <h1 style={{color:"#F2E4E1"}}>Felle Kalkulator</h1>
                    <div className="calculator-container">
                        <div className="input-row">
                                <label htmlFor="stitches">Antall masker på pinnen</label>
                                <InputField
                                label="Antall masker på pinnen"
                                name="stitches"
                                type="number"
                                onChange={e => setNumberOfStitches(e.target.value)}
                                value={numberOfStitches}
                            />
                            <label htmlFor="increases">Antall økninger</label>
                            <InputField
                                label="Antall økninger"
                                name="increases"
                                type="number"
                                onChange={e => setNumberOfIncreases(e.target.value)}
                                value={numberOfIncreases}
                            />
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