import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import SwitchContainer from "../../Components/SwitchContainer";
import '../../GlobalStyles/main.css';
import NeedleStash from "./Needle/Needles";
import YarnStash from "./Yarn/Yarn";

const Stash = () => {
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const defaultTab = queryParams.get('tab');

    const [activeStatus, setActiveStatus] = useState(defaultTab || 'yarn');
    const [needleTypes, setNeedleTypes] = useState(['All']);
    const [yarnTypes, setYarnTypes] = useState(['All']);

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