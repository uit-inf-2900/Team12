import React, { useState, useEffect } from 'react';
import axios from 'axios';

import InputField from '../../Components/UI/InputField';
import CustomButton from '../../Components/UI/Button';
import SetAlert from '../../Components/UI/Alert';

const UpdateProject = ({ projectId, onClose }) => {
    const token = sessionStorage.getItem('token');
    const [currentProject, setCurrentProject]= useState();
    const [formErrors, setFormErrors] = useState({});
    const [alertInfo, setAlertInfo] = useState({ open: false, message: '', severity: 'info' });

    const [recipes, setRecipes]=useState([]);
    const [yarns, setYarns]=useState([]);
    const [needles, setNeedles]=useState([]);

    const [projectData, setProjectData] = useState({
        projectName: '',
        recipeId: '',
        status: '',
        needleIds: [],
        yarnIds: '',
        yarnType: '',
        yarnAmount: '',
        notes: ''
    });

    const Options = [
        
        { id: 0, label: 'Planned' },
        { id: 1, label: 'In Progress' },
    ];




    const fetchProject = async () => {
        try {
            const response = await axios.get(`http://localhost:5002/api/projects/${projectId}?userToken=${sessionStorage.getItem('token')}`, {
            headers: {
                'Content-Type': 'application/json',
            },
            });
            setProjectData(response.data);
            console.log('Project fetched successfully:', response.data);
        
        } catch (error) {
            console.error('Error updating project:', error);
        }

    };

    //fetching needed data for changing projects

    const fetchRecipes = async () => {
     
        try {
            const response = await axios.get('http://localhost:5002/api/recipe/' + '?userToken=' + sessionStorage.getItem('token')); // TODO: Replace with the actual backend endpoint
            setRecipes(response.data || []); 
        } catch (error) {
            console.error('Error fetching recipes:', error);
        } 
    };
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
    const fetchYarns = async () => {
        const token = sessionStorage.getItem('token');
        const url = `http://localhost:5002/api/inventory/get_inventory?userToken=${token}`;
        try {
            const response = await fetch(url);
            if (response.ok) {
                const data = await response.json();
                setYarns(data.yarnInventory );
                
            } else {
                console.error("Failed to fetch yarn data.");
            }
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    };

    const validateForm = () => {
        const errors = {};
        if (!projectData.projectName) errors.projectName = 'Project name is required';
        // if (!projectData.status) errors.status = 'Status is required';
        if (projectData.needleIds.length === 0) errors.needleIds = 'Needles selection is required';
        if (!projectData.yarnType) errors.yarnType = 'Yarn type is required';
        // if (!projectData.yarnAmount) errors.yarnAmount = 'Yarn amount is required';
        if (!projectData.recipeId) errors.recipeId = 'Recipe selection is required';
        return errors;
    };


    useEffect(() => {
        fetchProject();
        fetchRecipes();
        fetchNeedles();
        fetchYarns();
        
    }, []);
    




    const handleChange = (prop) => (e) => {
        setProjectData({ ...projectData, [prop]: e.target.value });
    };

    const handleStatusChange = (event) => {
        const { value } = event.target;
        setProjectData({ ...projectData, status: value });
    };
    const handleNeedleChange = (e) => {
        const {value} = e.target;
    
        setProjectData({
            ...projectData,
            needleIds: [value]
        });
    };
    const handleYarnChange = (e) => {
        const {value} = e.target;
      
        setProjectData({...projectData, yarnType: [value]});
        
    
    };
    const handleRecipeChange = (event) => {
        const { value } = event.target;
        setProjectData({ ...projectData, recipeId: value });
      };


    

    const handleSubmit = async (e) => {
        e.preventDefault();
        const errors = validateForm();
        if (Object.keys(errors).length > 0) {
            setFormErrors(errors);
            return;
        }


        const payLoad ={
            status: projectData.status,
            projectName: projectData.projectName,
            notes: projectData.notes,
            needleIds: projectData.needleIds,
            yarnIds: { [projectData.yarnType] : projectData.yarnAmount},
        };

        try {
        const response = await axios.patch(`http://localhost:5002/api/projects?userToken=${sessionStorage.getItem('token')}&projectId=${projectId}`, payLoad, {
            headers: {
            'Content-Type': 'application/merge-patch+json',
            },
        });
        console.log('Project updated successfully:', response.data);
        setAlertInfo({ open: true, message: 'Project updated successfully!', severity: 'success' });
        onClose();
    
        } catch (error) {
        console.error('Error updating project:', error);
        setAlertInfo({ open: true, message: 'Failed to update project.', severity: 'error' });
        }
        
    };

    return (
        <div className="box-container">
        <div className='box dark'>
            {alertInfo.open && <SetAlert severity={alertInfo.severity}>{alertInfo.message}</SetAlert>}
            <h3>Update Project</h3>
            <InputField label="Name the project" value={projectData.projectName} name="projectName" type="text" onChange={handleChange('projectName')} />
       
            <InputField 
                    label="Status" 
                    type="select"
                    value={projectData.status }
                    onChange={handleStatusChange}
                    options={Options.map(option => ({ value: option.id, label: option.label }))}
                />  
            <InputField 
        
                label="Needles"
                type="select"
                value={projectData.needleIds}
                onChange={handleNeedleChange}
                options={needles.map(needle=> ({
                value: needle.itemId,
                label: `${needle.type} size: ${needle.size} length: ${needle.length}cm`
                }))}
            />
            <InputField 
        
                label="Yarn"
                type="select"
                value={projectData.yarnType}
                onChange={handleYarnChange}
                options={yarns.map(yarn=> ({
                value: yarn.itemId,
                label: `${yarn.type} by ${yarn.manufacturer}`
                }))}
            />
            <InputField label="Amount yarn needed"  type="number" value={projectData.yarnAmount} onChange={handleChange('yarnAmount')} />    
            <InputField 
                label="Choose recipe" 
                type="select"
                value={projectData.recipeId}
                onChange={handleRecipeChange}
                options={recipes.map(recipe => ({ value: recipe.recipeId, label: recipe.recipeName}))}
            />
            
            <InputField label="Notes" value={projectData.notes || ''} name="notes" type="text" onChange={handleChange('notes')} />
            <button className='button' onClick={handleSubmit}>Upload</button>
            
            <button onClick={onClose}>Cancel</button>
        </div>
        </div>
    );
};

export default UpdateProject;
