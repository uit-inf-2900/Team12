import React, { useState} from "react";
import InputField from "../../Components/InputField";
import "./Calculator.css"
import Image from "../../images/knitting.png";
import { CustomButton } from "../../Components/Button";

export const YarnCalculator = () => {
    const [originalLength, setOriginalLength] = useState('');
    const [originalSkeins, setOriginalSkeins] = useState('');
    const [newLength, setNewLength] = useState('');
    const [requiredSkeins, setRequiredSkeins] = useState(null);
    const [error, setError] = useState('');

    
    const calculateSkeins = () => {
        setError('');
        setRequiredSkeins(null);
        if (originalLength > 0 && originalSkeins > 0 && newLength > 0) {
            const totalLength = originalLength * originalSkeins;
            const newSkeins = Math.ceil(totalLength / newLength);
            setRequiredSkeins(newSkeins);
        } else {
            setError('Please fill in all fields with positive numbers');
    }};

    return (
        <div className="custom-box">
            <h1 style={{color:"#F2E4E1"}}> Yarn Calculator </h1>
            <h4 style={{color:"#F2E4E1"}}>Calculate how many skeins your project requires</h4>
            <div className="calculator-container">
                    <label htmlFor="yarn length">In the recipe</label>
                    <InputField
                        label="yarn length" 
                        name="original-length"
                        type="number"
                        onChange={e => setOriginalLength(e.target.value)}
                        value={originalLength}
                    />
                    <InputField
                        label="number of skeins"
                        name="original-skeins"
                        type="number"
                        onChange={e => setOriginalSkeins(e.target.value)}
                        value={originalSkeins}
                    />
                    <label htmlFor="yarn lenght">Your yarn</label>
                        <InputField
                            label="yarn length"
                            name="new-length"
                            type="number"
                            onChange={e => setNewLength(e.target.value)}
                            value={newLength}
                        />
                        <CustomButton 
                        themeMode="dark" 
                        onClick={calculateSkeins}
                        style={{
                            minWidth: '190px',
                            height: '57px',
                        }}
                        >Calculate</CustomButton>
                    {requiredSkeins !== null && (
                        <div className="result">
                            <div className="calculator-image-container">
                                <img src={Image}/>
                            </div>
                            <p>You need {requiredSkeins} skeins with the yarn length {newLength}m.</p>
                        </div>
                    )}
                    {error && <p className="errorMsg">{error}</p>}
            </div>
        </div>
    );
};