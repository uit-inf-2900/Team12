// https://legacy.reactjs.org/docs/lists-and-keys.html

import React, {useContext, useState} from "react";
import ProjectCard from "../../Components/ProjectCard";
import Card from "../../Components/Card";
import { useParams } from 'react-router-dom';
import SwitchContainer from "../../Components/SwitchContainer";
import { useLocation } from "react-router-dom";

import '../../GlobalStyles/main.css';
import { AddButton } from "../../Components/Button";
import ModalContent from "../../Components/ModualContent";


const Projects = () => {
    const location = useLocation(); 
    const queryParams = new URLSearchParams(location.search); 
    const defaultTab = queryParams.get('tab')
    const [activeStatus, setActiveStatus] = useState(defaultTab ? parseInt(defaultTab) : 1); // Convert defaultTab to an integer or default to 1
    const [isOpenModal, setIsOpenModal] = useState(false);

    // Simplify the modal toggle to a single state since there's only one modal shown in the snippet
    const toggleModal = (isOpen) => {
        setIsOpenModal(isOpen);
    };
     // Hardcoded projects to see if the filtering works
    const projects = [
        { id: 1, title: 'Honey clutch', status: 0, knittingGauge:'10/10' },
        { id: 2, title: 'Summer scarf', status: 1, knittingGauge:'10/10'  },
        { id: 3, title: 'Winter hat', status: 2, knittingGauge:'10/10'  },

        // ... flere prosjekter
    ];

    
    const options = [
        { id: 0, label: 'Planned' },
        { id: 1, label: 'In Progress' },
        { id: 2, label: 'Completed' }
    ];
    const filteredProjects = projects.filter(project => project.status === activeStatus);

    return (
        <div className="page-container">
            <SwitchContainer 
                options={options}
                activeStatus={activeStatus}
                setActiveStatus={setActiveStatus}
            />

            {/* Visning av filtrerte prosjekter */}
            <div>
                {filteredProjects.map(project => (
                    <Card
                        key={project.id}
                        title={project.title}
                        needleSize={project.needleSize}
                        knittingGauge={project.knittingGauge}
                        notes={project.notes}
                    />
                ))}
            </div>

            <AddButton iconName='add' onClick={() => toggleModal(true)} />

            <ModalContent
                open={isOpenModal}
                handleClose={() => toggleModal(false)}
                title="Legg til prosjekt"
                infobox="Hei, dette skal bli her du fyller inn info om prosjektet"
            />
        </div>
    );
};

 
export default Projects;
