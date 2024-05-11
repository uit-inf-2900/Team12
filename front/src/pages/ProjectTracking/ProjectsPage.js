// https://legacy.reactjs.org/docs/lists-and-keys.html

import React, {useContext, useEffect, useState} from "react";
import ProjectCard from "../../Components/ProjectCard";
import UploadProjects from "./addProject";
import Card from "../../Components/Card";
import { useParams } from 'react-router-dom';
import SwitchContainer from "../../Components/SwitchContainer";
<<<<<<< HEAD
import axios from 'axios';
import { useLocation } from "react-router-dom";

=======
import { useLocation } from "react-router-dom";
>>>>>>> 3389269f89c6469e3ce54f7b1864c4d75b953c56

import '../../GlobalStyles/main.css';
import "../../GlobalStyles/Card.css"

import AddButton from "../../Components/AddButton";

import { Fab, Modal, Box } from "@mui/material";




const Projects = () => {
    const location = useLocation(); 
    const queryParams = new URLSearchParams(location.search); 
    const defaultTab = queryParams.get('tab')
<<<<<<< HEAD
    const [activeStatus, setActiveStatus] = useState(defaultTab || 1);
    const [loading, setLoading] = useState(true);
=======
    const [activeStatus, setActiveStatus] = useState(defaultTab ? parseInt(defaultTab) : 1); // Convert defaultTab to an integer or default to 1
    const [isOpenModal, setIsOpenModal] = useState(false);
>>>>>>> 3389269f89c6469e3ce54f7b1864c4d75b953c56

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
<<<<<<< HEAD
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

=======
     // Hardcoded projects to see if the filtering works
    const projects = [
        { id: 1, title: 'Honey clutch', status: 0, knittingGauge:'10/10' },
        { id: 2, title: 'Summer scarf', status: 1, knittingGauge:'10/10'  },
        { id: 3, title: 'Winter hat', status: 2, knittingGauge:'10/10'  },

        // ... flere prosjekter
    ];
>>>>>>> 3389269f89c6469e3ce54f7b1864c4d75b953c56

    



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
<<<<<<< HEAD
        
=======
>>>>>>> 3389269f89c6469e3ce54f7b1864c4d75b953c56
        { id: 0, label: 'Planned' },
        { id: 1, label: 'In Progress' },
        { id: 2, label: 'Completed' }
    ];
<<<<<<< HEAD
=======
    const filteredProjects = projects.filter(project => project.status === activeStatus);
>>>>>>> 3389269f89c6469e3ce54f7b1864c4d75b953c56

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
                    
                />
                    
            
                
            )}
            

            
            

            </div>
            
        </div>
    );
};

export default Projects;