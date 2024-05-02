import React, { useState} from "react";
import "./Calculator.css";
import InputField from "../../Components/InputField";
import { CustomButton } from "../../Components/Button";
import Image from "../../images/openBook.png"

export const IncreaseCalculator = () => {
    const [numberOfStitches, setNumberOfStitches] = useState('');
    const [numberOfIncreases, setNumberOfIncreases] = useState('');
    const [newStitches, setNewStitches] = useState(null);
    const [pattern, setPattern] = useState('');
    const [error, setError] = useState('');

    // Calculate increases
    const calculateIncrease = () => {
        setError('');
        setNewStitches(null);
        if (numberOfStitches > 0 && numberOfIncreases > 0) {
            const newStitchCount = parseInt(numberOfStitches) + parseInt(numberOfIncreases);
            setNewStitches(newStitchCount);

            // beregner mønsteret for økning
            const stitchesBetweenIncreases = Math.floor(numberOfStitches / numberOfIncreases);
            setPattern(`*Knit ${stitchesBetweenIncreases} stitches, increase 1 stitch* ${numberOfIncreases} times`);            
        } else {
            setError('Please fill in all fields with positive numbers');
    }}
    return (
        <div className="custom-box">
            <h1 style={{color:"#F2E4E1"}}>Increase calculator</h1>
            <h4 style={{color:"#F2E4E1"}}>Calculate how many times you need to increase</h4>
            <div className="calculator-container">
                    <label htmlFor="stitches">Number of stitches on the needle</label>
                    <InputField
                        label="stitches"
                        name="stitches"
                        type="number"
                        onChange={e => setNumberOfStitches(e.target.value)}
                        value={numberOfStitches}
                    />
                    <label htmlFor="increases">Number of increases</label>
                    <InputField
                        label="increases"
                        name="increases"
                        type="number"
                        onChange={e => setNumberOfIncreases(e.target.value)}
                        value={numberOfIncreases}
                    />
                    <CustomButton
                    themeMode="dark"
                    onClick={calculateIncrease}
                    style={{
                        minWidth: '190px',
                        height: '57px',
                    }}
                    >Calculate</CustomButton>
                {newStitches !== null && pattern && (
                    <div className="result">
                        <div className="calculator-image-container">
                            <img src={Image}/>
                        </div>
                        <p>{pattern}</p>
                        <p>You now have {newStitches} stitches on the needle</p>
                    </div>
                )}
                {error && <p className="errorMsg">{error}</p>}
            </div>
        </div>
        )
}

export default IncreaseCalculator;