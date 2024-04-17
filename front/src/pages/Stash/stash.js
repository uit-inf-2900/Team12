import React, { useState, useMemo } from "react";
import ProjectCard from "../../Components/ProjectCard";
import SwitchContainer from "../../Components/SwitchContainer";
import '../../GlobalStyles/main.css';
import NeedleStash from "./Needle/Needles";
import ModalContent from "../../Components/ModualContent";
import YarnStash from "./Yarn/Yarn";

import AddButton from "../../Components/AddButton";

const Stash = () => {
    const [activeStatus, setActiveStatus] = useState('yarn');
    const [needleTypes, setNeedleTypes] = useState(['All']);
    const [yarnTypes, setYarnTypes] = useState(['All']);
    const [yarnEntries, setYarnEntries] = useState([]);
    const [editingIndex, setEditingIndex] = useState(null);


    const addYarnEntry = (entry) => {
        setYarnEntries(prevEntries => [...prevEntries, entry]);
    };

    const handleEditYarnEntry = (index) => {
        setEditingIndex(index); // Set the index of the entry to edit
        // Additionally, you would set up any state or actions needed to show the editing form here.
    };

    const handleUpdateYarnEntry = (index, updatedEntry) => {
        setYarnEntries(prevEntries => {
            const newEntries = [...prevEntries];
            newEntries[index] = updatedEntry;
            return newEntries;
        });
    };
    
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