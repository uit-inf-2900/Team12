import React, { useState, useMemo } from "react";
import ProjectCard from "../../Components/ProjectCard";
import SwitchContainer from "../../Components/SwitchContainer";
import '../../GlobalStyles/main.css';
import { NeedleStash } from "./Needles";
import MultiSelect from '../../Components/MultiSelect';
import { Fab, Modal, Box } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import YarnStash from "./Yarn";
import ModalContent from "./ModualContent";

import TestModText from "./test"; 



export const Stash = () => {
    // State for the selected filters and projects, yarn is the default for the switch container
    // and all is the default for the needle type filter
    const [activeStatus, setActiveStatus] = useState('yarn');
    const [needleTypes, setNeedleTypes] = useState(['All']);


    const [openNeedleModal, setOpenNeedleModal] = useState(false); 
    const [openYarnModal, setOpenYarnModal] = useState(false); 

    // Hanlde opening and closing of modals
    const handleOpenNeedleModal = () => setOpenNeedleModal(true);
    const handleCloseNeedleModal = () => setOpenNeedleModal(false);
    const handleOpenYarnModal = () => setOpenYarnModal(true);
    const handleCloseYarnModal = () => setOpenYarnModal(false);

    const modalStyle = {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 400,
        bgcolor: 'background.paper',
        boxShadow: 24,
        p: 4,
    };



    return (
        <div className="page-container">
            <h1>Stash</h1>
            {/* Choose if you want to look at needles or yarn  */}
            <SwitchContainer
                options={[{ id: 'needles', label: 'Needles' }, { id: 'yarn', label: 'Yarn' }]}
                activeStatus={activeStatus}
                setActiveStatus={setActiveStatus}
            />

            {/* Show the chosen option (yarn or needles) */}
            {activeStatus === 'needles' && (
                <NeedleStash 
                    setNeedleTypes={setNeedleTypes} 
                    needleTypes={needleTypes} 
                />
            )}

            {activeStatus === 'yarn' && (
                <YarnStash  />
            )}

            {/* FAB to add yarn and needles */}
            {activeStatus === 'yarn' && (
                <Fab color="primary" aria-label="add-yarn" className="fab" onClick={handleOpenYarnModal}>
                    <AddIcon />
                </Fab>
            )}

            {activeStatus === 'needles' && (
                <Fab color="secondary" aria-label="add-needles" className="fab fab-needles" onClick={handleOpenNeedleModal}>
                    <AddIcon />
                </Fab>
            )}

            {/* Modal for yarn */}
            <ModalContent
                open={openYarnModal} // eller openNeedleModal basert på hva du ønsker
                handleClose={handleCloseYarnModal} // eller handleCloseNeedleModal
                infobox={<TestModText/>}
            >
            </ModalContent>

            <ModalContent
                open={openNeedleModal}
                handleClose={handleCloseNeedleModal}
                title="Legg til strikkepinner"
                infobox={<TestModText/>}
            >
            </ModalContent>

        </div>
    );
};

export default Stash;