import React, { useState} from "react";
import "./DecreaseIncrease.css";
import SwitchContainer from "../../Components/SwitchContainer";
import InputField from "../../Components/InputField";

import Image from "../../images/openBook.png"

export const IncreaseCalculator = () => {
    {/* ØKE KALKULATOR */}
    const [numberOfStitches, setNumberOfStitches] = useState('');
    const [numberOfIncreases, setNumberOfIncreases] = useState('');
    const [newStitches, setNewStitches] = useState(null);
    const [pattern, setPattern] = useState('');
    const [error, setError] = useState('');

    const calculateIncrease = () => {
        if (numberOfStitches > 0 && numberOfIncreases > 0) {
            const newStitchCount = parseInt(numberOfStitches) + parseInt(numberOfIncreases);
            setNewStitches(newStitchCount);

            // beregner mønsteret for økning
            const stitchesBetweenIncreases = Math.floor(numberOfStitches / numberOfIncreases);
            setPattern(`*Strikk ${stitchesBetweenIncreases} masker, øk 1 maske* ${numberOfIncreases} ganger`);            
        } else {
            setError('Vennligst fyll inn alle feltene med positive tall');
    }}
}