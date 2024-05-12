import React, {useState} from "react";
import SwitchContainer from "../../../Components/Utilities/SwitchContainer";
import {IncreaseCalculator} from "./IncreaseCalculator"
import {DecreaseCalculator} from "./DecreaseCalculator";
import {YarnCalculator} from "./YarnCalculator";

const Calculators = () => {
    const[activeStatus, setActiveStatus] = useState('increase');

    // The components in the switch container
    const options = [
        { id: 'yarn', label: 'Yarn' },
        { id: 'increase', label: 'Increase' },
        { id: 'decrease', label: 'Decrease' }
    ];

    return (
        <div>

            {/* Creates a switch container for the three calculatores */}
            <SwitchContainer
                options={options}
                activeStatus={activeStatus}
                setActiveStatus={setActiveStatus}
            />

            {/* Yarn Calculator */}
            {activeStatus === 'yarn' && (
                <YarnCalculator />
            )}
            {/* Increase Calculator */}
            {activeStatus === 'increase' && (
                <IncreaseCalculator />
            )}
            {/* Decrease Calculator */}
            {activeStatus === 'decrease' && (
                <DecreaseCalculator />
            )} 
        </div>
    )
}

export default Calculators;
