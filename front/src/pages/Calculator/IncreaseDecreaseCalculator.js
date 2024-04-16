import React, {useState} from "react";
import "./DecreaseIncrease.css";
// minus ../ maybe
import SwitchContainer from "../../Components/SwitchContainer";
import InputField from "../../Components/InputField"
import Image from "../../images/openBook.png";
import {IncreaseCalculator} from "./IncreaseCalculator"
import { DecreaseCalculator } from "./DecreaseCalculator";
import ModalContent from "../../Components/ModualContent";

const IncreaseDecreaseCalculator = () => {
    const[activeStatus, setActiveStatus] = useState('oke');

    // The components in the switch container
    const options = [
        { id: 'oke', label: 'Øke' },
        { id: 'felle', label: 'Felle' }
    ];

    return (
        <div className="page-container">
            <SwitchContainer
                options={options}
                activeStatus={activeStatus}
                setActiveStatus={setActiveStatus}
            />

            {/* DET ER DENNE SOM GJØR AT JEG IKKE KAN KLIKKE MEG VIDERE FRA SWITCH CONTAINEREN */}
            {activeStatus === 'oke' ? (
                <IncreaseCalculator />
            ) : (
                <DecreaseCalculator />
            )}

        </div>
    )
} 


export default IncreaseDecreaseCalculator;
