// https://legacy.reactjs.org/docs/lists-and-keys.html

import React, {useContext, useEffect, useState} from "react";
import ProjectCard from "../../Components/ProjectCard";
import UploadProjects from "./addProject";
import Card from "../../Components/Card";
import { useParams } from 'react-router-dom';
import SwitchContainer from "../../Components/SwitchContainer";
import axios from 'axios';



import '../../GlobalStyles/main.css';
import "../../GlobalStyles/Card.css"

import AddButton from "../../Components/AddButton";

import { Fab, Modal, Box } from "@mui/material";




const Projects = () => {
    const [activeStatus, setActiveStatus] = useState(1);
    const [loading, setLoading] = useState(true);

    const [uploading, setUploading] = useState(false);
   
    const [showModal, setShowModal] = useState(false);
    const [selectedProject, setSelectedProject] = useState(null);

    const [allProjects, setAllProjects]=useState([]);


    //fetch all projects in DB
    // const fetchProjects = async () => {
    //     const token = sessionStorage.getItem('token');
    //     const url = `http://localhost:5002/api/projects?userToken=${token}`;
    //     try {
    //         const response = await fetch(url);
    //         if (response.ok) {
    //             const data = await response.json();
    //             setAllProjects(response.data || []);
    //         } else {
    //             console.error("Failed to fetch projects data.");
    //         }
    //     } catch (error) {
    //         console.error("Error fetching data:", error);
    //     }
    // };

    const fetchProjects = async () => {
        setLoading(true);
        try {
            const response = await axios.get('http://localhost:5002/api/projects' + '?userToken=' + sessionStorage.getItem('token'));
            setAllProjects(response.data || []); 
        } catch (error) {
            console.error('Error fetching recipes:', error);
        } finally {
            setLoading(false);
        }
    };
    useEffect(() => {
        fetchProjects();
    }, []);

    //delete selected project
    const deleteProjects = async () => {

    };


    



    const toggleUpload = () => {
        setUploading(!uploading);
    };


    
    


    const handleProjectClick = (project) => {
        setSelectedProject(project);
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
    };


    const options = [
        
        { id: 0, label: 'Planned' },
        { id: 1, label: 'In Progress' },
        { id: 2, label: 'Completed' }
    ];

    const filteredProjects = allProjects.filter(project => project.status === activeStatus);
    console.log(allProjects);
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
                            key={project.projectId}
                            title={project.projectName}
                            
                            yarns={project.yarns}
                            needles={project.needles}
                            
                            
                            onClick={() => handleProjectClick(project)} //pass project to openProject
                        />
                        
                        
                    
                    
                ))}
            </div>
            
            

            
            <div className="page-container">

            <AddButton onClick={toggleUpload} />
            
            <Modal open={uploading} onClose={toggleUpload}>
                <UploadProjects onClose={toggleUpload}/>
            </Modal>

            {selectedProject && ( // Render ModalCard only when selectedProject is not null
                <ProjectCard
                    show={showModal}
                    project={selectedProject}
                    handleClose={handleCloseModal}
                />
                    
            
                
            )}
            

            
            

            </div>
            
        </div>
    );
};

export default Projects;