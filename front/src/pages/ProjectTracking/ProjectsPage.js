// https://legacy.reactjs.org/docs/lists-and-keys.html

import React, {useContext, useState} from "react";
import ProjectCard from "../../Components/ProjectCard";
import { useParams } from 'react-router-dom';

import '../../GlobalStyles/main.css';


const Projects = () => {
    const status = ['Planned', 'In Progress', 'Completed'];
    const [activeStatus, setActiveStatus] = useState();

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

    const filteredProjects = projects.filter(project => project.status === activeStatus);


    return(
        <div className="page-container"> 
            <h1> All projects </h1>
            <div className="section-container">
                <button onClick={() => setActiveStatus('planned')} className={activeStatus === 'planned' ? 'active' : ''}>Planned</button>
                <button onClick={() => setActiveStatus('in-progress') } className={activeStatus === 'in-progress' ? 'active' : ''}>In Progress</button>
                <button onClick={() => setActiveStatus('completed')} className={activeStatus === 'completed' ? 'active' : ''}>Completed</button>
            </div>

            <div className="box dark">
                {filteredProjects.map(project => (
                    <ProjectCard key={project.id} title={project.title} status={project.status} />
                ))}
            </div>
        </div>
    )
};

export default Projects;
