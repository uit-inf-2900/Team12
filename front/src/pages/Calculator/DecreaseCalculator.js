import React, {useState} from "react";
import "./Calculator.css";
import InputField from "../../Components/InputField";
import CustomButton from "../../Components/Button";
import Image from "../../images/openBook.png"

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
        if (numberOfStitches > 0 && numberOfDecreases > 0) {
            const newStitchCount = parseInt(numberOfStitches) - parseInt(numberOfDecreases);
            setNewStitches(newStitchCount);

            // 
            const stitchesBetweenDecreases = Math.floor(numberOfStitches / numberOfDecreases);
            const remainder = numberOfStitches % numberOfDecreases;
            let patternString = `*Knit ${stitchesBetweenDecreases - 1} stitches, knit 2 together*`;

            //
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
    return (
        <div className="custom-box">
            <h1 style={{color:"#F2E4E1"}}>Decrease calculator</h1>
            <h4 style={{color:"#F2E4E1"}}>Calculate how many decreases you need to make</h4>
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