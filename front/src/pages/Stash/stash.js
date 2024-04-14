import React, { useState, useMemo } from "react";
import ProjectCard from "../../Components/ProjectCard";
import SwitchContainer from "../../Components/SwitchContainer";
import '../../GlobalStyles/main.css';
import NeedleStash from "./Needle/Needles";
import YarnStash from "./Yarn/Yarn";

import AddButton from "../../Components/AddButton";

const Stash = () => {
    const [activeStatus, setActiveStatus] = useState('yarn');
    const [needleTypes, setNeedleTypes] = useState(['All']);

    
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
                <YarnStash />
            )}

        </div>
    );
};


export default Stash;