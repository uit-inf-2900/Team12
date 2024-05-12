import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import SwitchContainer from "../../Components/Utilities/SwitchContainer";
import '../../GlobalStyles/main.css';
import NeedleStash from "./Needle/Needles";
import YarnStash from "./Yarn/Yarn";


/**
 * Stash Component
 * Displays and manages the stash inventory, either needles or yarn.
 * Users can switch between 'Needles' and 'Yarn' views via a tab switcher.
 */
const Stash = () => {
    const location = useLocation();                             // Accessing URL location
    const queryParams = new URLSearchParams(location.search);   // Parsing query parameters from URL
    const defaultTab = queryParams.get('tab');                  // Extract 'tab' query parameter to set the default view

    // State to track the active tab status, defaulting to 'yarn' or a URL query parameter
    const [activeStatus, setActiveStatus] = useState(defaultTab || 'yarn');

    // State to track the needle and yarn types for filtering the stash inventory
    const [needleTypes, setNeedleTypes] = useState(['All']);
    const [yarnTypes, setYarnTypes] = useState(['All']);

    // Effect hook to update activeStatus based on the defaultTab query parameter
    useEffect(() => {
        if (defaultTab) {
            setActiveStatus(defaultTab);
        }
    }, [defaultTab]);

    
    return (
        <div className="page-container">
            <h1>Stash</h1>
            <SwitchContainer
                options={[{ id: 'needles', label: 'Needles' }, { id: 'yarn', label: 'Yarn' }]}
                activeStatus={activeStatus}
                setActiveStatus={setActiveStatus}
            />

            {activeStatus === 'needles' ? (
                <NeedleStash setNeedleTypes={setNeedleTypes} needleTypes={needleTypes} />
            ) : (
                <YarnStash setYarnTypes={setYarnTypes} yarnTypes={yarnTypes} />
            )}

        </div>
    );
};

export default Stash;