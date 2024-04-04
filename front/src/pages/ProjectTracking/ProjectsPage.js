// https://legacy.reactjs.org/docs/lists-and-keys.html

import React, {useContext, useState} from "react";
import ProjectCard from "../../Components/ProjectCard";
import { useParams } from 'react-router-dom';
import SwitchContainer from "../../Components/SwitchContainer";

import '../../GlobalStyles/main.css';


const Projects = () => {
    const [activeStatus, setActiveStatus] = useState('in-progress');

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
        </div>
    );
};


export default Projects;
