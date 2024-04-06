// https://legacy.reactjs.org/docs/lists-and-keys.html

import React, {useContext, useState} from "react";
import ProjectCard from "../../Components/ProjectCard";
import { useParams } from 'react-router-dom';
import SwitchContainer from "../../Components/SwitchContainer";

import '../../GlobalStyles/main.css';
import AddButton from "../../Components/AddButton";
import ModalContent from "../../Components/ModualContent";


const Projects = () => {
    const [activeStatus, setActiveStatus] = useState('in-progress');
    const [isOpenModal, setIsOpenModal] = useState(false);

    // Simplify the modal toggle to a single state since there's only one modal shown in the snippet
    const toggleModal = (isOpen) => {
        setIsOpenModal(isOpen);
    };
     // Hardcoded projects to see if the filtering works
    const projects = [
        { id: 1, title: 'Honey clutch', status: 'planned' },
        { id: 2, title: 'Summer scarf', status: 'in-progress' },
        { id: 3, title: 'Winter hat', status: 'completed' },
        { id: 4, title: 'Honey clutch', status: 'planned' },
        { id: 5, title: 'Summer scarf', status: 'in-progress' },
        { id: 6, title: 'Winter hat', status: 'completed' },
        { id: 7, title: 'Honey clutch', status: 'planned' },
        { id: 8, title: 'Summer scarf', status: 'in-progress' },
        { id: 9, title: 'Winter hat', status: 'completed' },
        // ... flere prosjekter
    ];

    
    const options = [
        { id: 'planned', label: 'Planned' },
        { id: 'in-progress', label: 'In Progress' },
        { id: 'completed', label: 'Completed' }
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
            <div className="box dark">
                {filteredProjects.map(project => (
                    <ProjectCard key={project.id} title={project.title} status={project.status}/>
                ))}
            </div>

            <AddButton onClick={() => toggleModal(true)} />

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
