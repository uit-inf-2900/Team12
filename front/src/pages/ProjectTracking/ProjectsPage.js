// https://legacy.reactjs.org/docs/lists-and-keys.html

import React, {useContext, useEffect, useState} from "react";
import ProjectCard from "../../Components/ProjCard";
import UploadProjects from "./addProject";
import Card from "../../Components/Card";
import { useParams } from 'react-router-dom';
import SwitchContainer from "../../Components/SwitchContainer";
import axios from 'axios';

import trialCard from "../../Components/test";

import '../../GlobalStyles/main.css';
import "../../GlobalStyles/Card.css"

import NeedleInfo from "../Stash/Needle/needletext";


import AddButton from "../../Components/AddButton";

import { Fab, Modal, Box } from "@mui/material";




const Projects = () => {
    const [activeStatus, setActiveStatus] = useState('in-progress');
    const [isOpenModal, setIsOpenModal] = useState(false);
    const [selectedCard, setSelectedCard] = useState(null);
    const [loading, setLoading] = useState(true);

    const [uploading, setUploading] = useState(false);
   
    const [showModal, setShowModal] = useState(false);
    const [selectedProject, setSelectedProject] = useState(null);


    const fetchNeedles = async () => {
        const token = sessionStorage.getItem('token');
        const url = `http://localhost:5002/api/inventory/get_inventory?userToken=${token}`;
        try {
            const response = await fetch(url);
            if (response.ok) {
                const data = await response.json();
                setNeedles(data.needleInventory || []);
            } else {
                console.error("Failed to fetch needle data.");
            }
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    };
    
    useEffect(() => {
        fetchNeedles();
    }, []);


    const toggleUpload = () => {
        setUploading(!uploading);
    };


    const fetchProjects = async () => {
        setLoading(true);
        try {
            const response = await axios.get('http://localhost:5002/api/recipe/getprojects' + '?userToken=' + sessionStorage.getItem('token')); 
            setRecipes(response.data || []); 
        } catch (error) {
            console.error('Error fetching recipes:', error);
        } finally {
            setLoading(false);
        }
    };

    const toggleModal = (isOpen) => {
        setIsOpenModal(isOpen);
    };

    

    const openProject = (project) => {
        setSelectedCard(project);
        toggleModal(true);

    };

    const handleProjectClick = (project) => {
        setSelectedProject(project);
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
    };
    const handleCloseUploading =() =>{
        setLoading(false);
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
            
            

            
            <div className="page-container">

            <AddButton onClick={toggleUpload} />
            
            <Modal open={uploading} onClose={toggleUpload} >
                <NeedleInfo onClose={toggleUpload} fetchNeedles={fetchNeedles}/>
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