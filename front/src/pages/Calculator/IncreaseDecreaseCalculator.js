import React, {useState} from "react";
import SwitchContainer from "../../Components/SwitchContainer";
import {IncreaseCalculator} from "./IncreaseCalculator"
import {DecreaseCalculator} from "./DecreaseCalculator";
import {YarnCalculator} from "./YarnCalculator";

const IncreaseDecreaseCalculator = () => {
    const[activeStatus, setActiveStatus] = useState('oke');

    // The components in the switch container
    const options = [
        { id: 'yarn', label: 'Yarn' },
        { id: 'increase', label: 'Increase' },
        { id: 'decrease', label: 'Decrease' }
    ];

    return (
        <div className="page-container">

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

export default IncreaseDecreaseCalculator;
