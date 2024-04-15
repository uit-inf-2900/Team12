import React, { useState, useMemo } from "react";
import ProjectCard from "../../Components/ProjectCard";
import SwitchContainer from "../../Components/SwitchContainer";
import '../../GlobalStyles/main.css';
import { NeedleStash } from "./Needles";
import MultiSelect from '../../Components/MultiSelect';
import { Fab, Modal, Box } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import YarnStash from "./Yarn";
import ModalContent from "../../Components/ModualContent";

import TextYarn from "./yarntext"; 
import TextNeedle from "./needletext"; 
import AddButton from "../../Components/AddButton";

const Stash = () => {
    const [activeStatus, setActiveStatus] = useState('yarn');
    const [needleTypes, setNeedleTypes] = useState(['All']);
    const [yarnEntries, setYarnEntries] = useState([]);
    const [editingIndex, setEditingIndex] = useState(null);
    const [openModal, setOpenModal] = useState({ needle: false, yarn: false });

    // Adjust the function to correctly reference the needle modal
    const toggleModal = (type, isOpen) => {
        // Map 'needles' to 'needle' to match the state key
        const modalType = type === 'needles' ? 'needle' : type;
        setOpenModal({ ...openModal, [modalType]: isOpen });
    };

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
                <YarnStash yarnEntries={yarnEntries} onEdit={handleEditYarnEntry} onUpdate={handleUpdateYarnEntry} />
            )}

            <AddButton onClick={() => toggleModal(activeStatus, true)} />

            <ModalContent
                open={openModal.yarn}
                handleClose={() => toggleModal('yarn', false)}
                infobox={<TextYarn open={openModal.yarn} handleClose={() => toggleModal('yarn', false)} addYarnEntry={addYarnEntry} />}
            />

            <ModalContent
                open={openModal.needle}
                handleClose={() => toggleModal('needle', false)}
                title="Legg til strikkepinner"
                infobox={<TextNeedle />}
            />
        </div>
    );
};


export default Stash;