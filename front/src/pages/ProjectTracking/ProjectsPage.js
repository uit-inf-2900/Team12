// https://legacy.reactjs.org/docs/lists-and-keys.html

import React, {useContext, useEffect, useState} from "react";
import ProjectCard from "../../Components/ProjectCard";
import UploadProjects from "./addProject";
import Card from "../../Components/Card";
import { useParams } from 'react-router-dom';
import SwitchContainer from "../../Components/SwitchContainer";

import axios from 'axios';
import { useLocation } from "react-router-dom";


import '../../GlobalStyles/main.css';
import "../../GlobalStyles/Card.css"

import AddButton from "../../Components/AddButton";

import { Fab, Modal, Box } from "@mui/material";




const Projects = () => {
    const location = useLocation(); 
    const queryParams = new URLSearchParams(location.search); 
    const defaultTab = queryParams.get('tab')


    const [loading, setLoading] = useState(true);

    const [activeStatus, setActiveStatus] = useState(defaultTab ? parseInt(defaultTab) : 1); // Convert defaultTab to an integer or default to 1
    const [isOpenModal, setIsOpenModal] = useState(false);
    
    const [uploading, setUploading] = useState(false);
   
    const [showModal, setShowModal] = useState(false);
    const [selectedProject, setSelectedProject] = useState(null);

    const [allProjects, setAllProjects]=useState([]);



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

    const deleteProject = async (ProjectId) => {

        try{
          const response = await axios.delete(`http://localhost:5002/api/projects?userToken=${sessionStorage.getItem('token')}&projectId=${ProjectId}`)
        } catch (error) {
          console.error('Error deleting Project:', error);
  
  
        }
  
        handleCloseModal();
        fetchProjects();
        
        
    };
    const handleCompleted = async (ProjectId) => {

        try{
            const response = await axios.post(`http://localhost:5002/api/projects/complete?userToken=${sessionStorage.getItem('token')}&projectId=${ProjectId}`)
        }
        catch (error) {
            console.error('Error setting Project to complete:', error);
    
    
          }

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
        fetchProjects();
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
                <UploadProjects onClose={toggleUpload} fetchProjects={()=>fetchProjects()} />
            </Modal>

            {selectedProject && ( // Render ModalCard only when selectedProject is not null
                <ProjectCard
                    show={showModal}
                    project={selectedProject}
                    handleClose={handleCloseModal}
                    onDelete={()=> deleteProject(selectedProject.projectId)}
                    onComplete={()=>handleCompleted(selectedProject.projectId)}
                    onUpdate={selectedProject.projectId}
                    
                    
                    
                />
                    
            
                
            )}
            

            
            

            </div>
            
        </div>
    );
};

export default Projects;