import React, {useState} from "react";
import "./DecreaseIncrease.css";
import SwitchContainer from "../../Components/SwitchContainer";
import InputField from "../../Components/InputField";

import Image from "../../images/openBook.png"

export const DecreaseCalculator = () => {
    {/* FELLE KALKULATOR */}
    const [numberOfStitches, setNumberOfStitches] = useState('');
    const [numberOfIncreases, setNumberOfIncreases] = useState('');
    const [newStitches, setNewStitches] = useState(null);
    const [pattern, setPattern] = useState('');
    const [error, setError] = useState('');
    const [numberOfDecreases, setNumberOfDecreases] = useState('');

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