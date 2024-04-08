import React, { useState, useMemo } from "react";
import ProjectCard from "../../Components/ProjectCard";
import SwitchContainer from "../../Components/SwitchContainer";
import '../../GlobalStyles/main.css';
import { NeedleStash } from "./Needle/Needles";
import MultiSelect from '../../Components/MultiSelect';
import { Fab, Modal, Box } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import YarnStash from "./Yarn/Yarn";
import ModalContent from "../../Components/ModualContent";

import TextYarn from "./Yarn/yarntext"; 
import TextNeedle from "./Needle/needletext"; 
import AddButton from "../../Components/AddButton";

const Stash = () => {
    const [activeStatus, setActiveStatus] = useState('yarn');
    const [needleTypes, setNeedleTypes] = useState(['All']);
    const [openModal, setOpenModal] = useState({ needle: false, yarn: false });

    // Adjust the function to correctly reference the needle modal
    const toggleModal = (type, isOpen) => {
        // Map 'needles' to 'needle' to match the state key
        const modalType = type === 'needles' ? 'needle' : type;
        setOpenModal({ ...openModal, [modalType]: isOpen });
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
                <YarnStash />
            )}

            <AddButton onClick={() => toggleModal(activeStatus, true)} />

            <ModalContent
                open={openModal.yarn}
                handleClose={() => toggleModal('yarn', false)}
                infobox={<TextYarn />}
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