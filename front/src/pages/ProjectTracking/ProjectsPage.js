import React, { useEffect, useState } from "react";
import axios from 'axios';
import { useLocation } from "react-router-dom";

import ProjectCard from "../../Components/DataDisplay/ProjectCard";
import UploadProjects from "./addProject";
import Card from "../../Components/DataDisplay/Card";
import SwitchContainer from "../../Components/Utilities/SwitchContainer";
import { AddButton } from "../../Components/UI/Button";
import { Modal } from "@mui/material";

import '../../GlobalStyles/main.css';
import "../../GlobalStyles/Card.css"

const Projects = () => {
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const defaultTab = queryParams.get('tab');

    const [loading, setLoading] = useState(true);
    const [activeStatus, setActiveStatus] = useState(defaultTab ? parseInt(defaultTab) : 1);
    const [isOpenModal, setIsOpenModal] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [selectedProject, setSelectedProject] = useState(null);
    const [allProjects, setAllProjects] = useState([]);

    const fetchProjects = async () => {
        setLoading(true);
        try {
            const response = await axios.get('http://localhost:5002/api/projects?userToken=' + sessionStorage.getItem('token'));
            setAllProjects(response.data || []);
        } catch (error) {
            console.error('Error fetching projects:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProjects();
    }, []);

    const deleteProject = async (projectId) => {
        try {
            await axios.delete(`http://localhost:5002/api/projects?userToken=${sessionStorage.getItem('token')}&projectId=${projectId}`);
            handleCloseModal();
            fetchProjects();
        } catch (error) {
            console.error('Error deleting project:', error);
        }
    };

    const handleCompleted = async (projectId) => {
        try {
            await axios.post(`http://localhost:5002/api/projects/complete?userToken=${sessionStorage.getItem('token')}&projectId=${projectId}`);
            fetchProjects();
        } catch (error) {
            console.error('Error setting project to complete:', error);
        }
    };

    const updateProjectStatus = async (projectId, statusId) => {
        try {
            await axios.put(`http://localhost:5002/api/projects/updateStatus?userToken=${sessionStorage.getItem('token')}&projectId=${projectId}&statusId=${statusId}`);
            fetchProjects();
        } catch (error) {
            console.error('Error updating project status:', error);
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

    return (
        <div className="page-container">
            <SwitchContainer
                options={options}
                activeStatus={activeStatus}
                setActiveStatus={setActiveStatus}
            />

            <div className="card-container" style={{justifyContent: 'flex-start', justifyContent: 'center'}}>
                {filteredProjects.map(project => (
                    <Card
                        key={project.projectId}
                        title={project.projectName}
                        yarns={project.yarns}
                        needles={project.needles}
                        onClick={() => handleProjectClick(project)}
                    />
                ))}
            </div>

            <AddButton onClick={toggleUpload}/>

            <Modal open={uploading} onClose={toggleUpload}>
                <UploadProjects onClose={toggleUpload} fetchProjects={fetchProjects} />
            </Modal>

            {selectedProject && (
                <ProjectCard
                    show={showModal}
                    project={selectedProject}
                    handleClose={handleCloseModal}
                    onDelete={() => deleteProject(selectedProject.projectId)}
                    onComplete={() => handleCompleted(selectedProject.projectId)}
                    onUpdate={() => updateProjectStatus(selectedProject.projectId, 1)}
                />
            )}
        </div>
    );
};

export default Projects;
