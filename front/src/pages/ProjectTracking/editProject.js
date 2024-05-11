import React, { useState, useEffect } from 'react';
import axios from 'axios';

import InputField from '../../Components/InputField';
import CustomButton from '../../Components/Button';
import SetAlert from '../../Components/Alert';

const UpdateProject = ({ projectId, onClose, fetchProjects }) => {
  const token = sessionStorage.getItem('token');
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


  const handleChange = (prop) => (e) => {
    setProjectData({ ...projectData, [prop]: e.target.value });
  };

  const handleSubmit = async (e) => {

    const payLoad ={
        notes: projectData.notes
      };
    e.preventDefault();

    try {
      const response = await axios.patch(`http://localhost:5002/api/projects?userToken=${sessionStorage.getItem('token')}&projectId=${projectId}`, payLoad, {
        headers: {
          'Content-Type': 'application/merge-patch+json',
        },
      });
      console.log('Project updated successfully:', response.data);
      onClose();
      fetchProjects();
    } catch (error) {
      console.error('Error updating project:', error);
    }
  };

  return (
    <div className="box-container">
      <div className='box dark'>
        <h3>Update Project</h3>
        
        <InputField label="Notes" value={projectData.notes} name="notes" type="text" onChange={handleChange('notes')} />
        <button className='button' onClick={handleSubmit}>Upload</button>
        
        <button onClick={onClose}>Cancel</button>
      </div>
    </div>
  );
};

export default UpdateProject;
