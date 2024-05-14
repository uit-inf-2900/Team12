import React, {useState} from "react";
import "./Calculator.css";
import InputField from "../../../Components/UI/InputField";
import { CustomButton } from "../../../Components/UI/Button";
import Image from "../../../images/openBook.png"

/**
 *  Calculates number of decreases and set new knitting-pattern.
 */
export const DecreaseCalculator = () => {
    const [numberOfStitches, setNumberOfStitches] = useState('');
    const [newStitches, setNewStitches] = useState(null);
    const [pattern, setPattern] = useState('');
    const [error, setError] = useState('');
    const [numberOfDecreases, setNumberOfDecreases] = useState('');

    // Calculate decreases
    const calculateDecrease = () => {
        setError('');
        setNewStitches(null);
        // Check if the input is only positive numbers
        if (numberOfStitches > 0 && numberOfDecreases > 0) {
            // Check if there are enough stitches to make the decreases
            if (parseInt(numberOfStitches) < parseInt(numberOfDecreases)) {
                setError("You do not have enough stitches to make that many decreases.");
                return;
            }

            // Find new stitch count
            const newStitchCount = parseInt(numberOfStitches) - parseInt(numberOfDecreases);
            setNewStitches(newStitchCount);

            // Find stitches between each decrease
            const stitchesBetweenDecreases = Math.floor(numberOfStitches / numberOfDecreases);
            // Find any remainding stitches
            const remainder = numberOfStitches % numberOfDecreases;
            // Set new pattern for the knitting
            let patternString = `*Knit ${stitchesBetweenDecreases - 1} stitches, knit 2 together*`;

            // Add the remainding stitches to the new pattern, if any
            if (remainder > 0) {
                patternString += ` Repeat ${numberOfDecreases - 1} times, knit the last ${remainder + stitchesBetweenDecreases - 1} stitches, knit 2 together`;
            } else {
                patternString += ` Repeat ${numberOfDecreases} times`;
            }
            setPattern(patternString);
        } else {
            setError('Please fill in all fields with positive numbers');
        }
    }

    // The decrease calculator
    return (
        <div className="custom-box">
            {/* Header */}
            <h1 style={{color:"#F2E4E1"}}>Decrease calculator</h1>
            <h4 style={{color:"#F2E4E1"}}>Calculate how many decreases you need to make</h4>

            {/* Calculator decrease */}
            <div className="calculator-container">
                <div className="input-row">
                        <label htmlFor="stitches">Number of stitches on the needle</label>
                        <InputField
                        label="stitches"
                        name="stitches"
                        type="number"
                        onChange={e => setNumberOfStitches(e.target.value)}
                        value={numberOfStitches}
                    />
                    <label htmlFor="decreases">Number of decreases</label>
                    <InputField
                        label="decreases"
                        name="decreases"
                        type="number"
                        onChange={e => setNumberOfDecreases(e.target.value)}
                        value={numberOfDecreases}
                    />
                    <CustomButton
                    themeMode="dark"
                    onClick={calculateDecrease}
                    style={{
                        minWidth: '190px',
                        height: '57px',
                    }}
                    >Calculate</CustomButton>
                </div>
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

export default DecreaseCalculator;