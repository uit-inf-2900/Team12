// https://legacy.reactjs.org/docs/lists-and-keys.html

import React, {useContext, useState} from "react";
import ModalCard from "../../Components/ProjectCard";
import Card from "../../Components/Card";
import { useParams } from 'react-router-dom';
import SwitchContainer from "../../Components/SwitchContainer";

import '../../GlobalStyles/main.css';
import AddButton from "../../Components/AddButton";
import ModalContent from "../../Components/ModualContent";


const Projects = () => {
    const [activeStatus, setActiveStatus] = useState('in-progress');
    const [isOpenModal, setIsOpenModal] = useState(false);
    const [selectedCard, setSelectedCard] = useState(null);
    const [selectedProject, setSelectedProject] = useState(null);

    const toggleModal = (isOpen) => {
        setIsOpenModal(isOpen);
    };

    

    const openProject = (project) => {
        setSelectedCard(project);
        toggleModal(true);

    };
    const handleProjectClick = (project) => {
        setSelectedProject(project);
        toggleModal(true);
    };


    const projects = [
        { id: 1, title: 'Honey clutch', status: 'planned', knittingGauge: '10/10' },
        { id: 2, title: 'Summer scarf', status: 'in-progress', knittingGauge: '10/10' },
        { id: 3, title: 'Winter hat', status: 'completed', knittingGauge: '10/10' },
        { id: 4, title: 'Skappel luft', status: 'planned' },
        { id: 5, title: 'Oslo lue', status: 'in-progress' },
        { id: 6, title: 'Votter', status: 'completed' },
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

            <div className="card-container">
                {filteredProjects.map(project => (
                    
                        <Card
                            key={project.id}
                            title={project.title}
                            needleSize={project.needleSize}
                            knittingGauge={project.knittingGauge}
                            notes={project.notes}
                            onClick={() => handleProjectClick(project)} //pass project to openProject
                        />
                    
                    
                ))}
            </div>
            
            

            <AddButton onClick={() => toggleModal(true)} />

            {selectedProject && ( // Render ModalCard only when selectedProject is not null
                <ModalCard
                    isOpen={isOpenModal}
                    onClose={() => toggleModal(false)}
                    project={selectedProject}
                />
            )}
        </div>
    );
};

export default Projects;