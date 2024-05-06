import React, { useState, useEffect, useRef } from 'react';
import InputField from '../../Components/InputField';
import CustomButton from '../../Components/Button';
import SetAlert from '../../Components/Alert';
import axios from 'axios';


const UploadProjects = ({ onClose, fetchProjects }) => {

  const token = sessionStorage.getItem('token');
  const [alertInfo, setAlertInfo] = useState({open: false, severity: 'info', message: 'test message'});
  const [loading, setLoading] = useState(true);
  const [recipes, setRecipes] = useState([]);
  const [projectData, setProjectData] = useState({

    recipeId: '',
    status: '',
    needleIds: [],
    yarnIds: [],
    notes: '',
    userToken: token
    
  });
  const Options = [
        
    { id: 0, label: 'Planned' },
    { id: 1, label: 'In Progress' },
    { id: 2, label: 'Completed' }
  ];

  const handleInputChange = (prop) => (e) => {
    setProjectData({ ...projectData, [prop]: e.target.value });
  };

  const handleStatusChange = (event) => {
    const { value } = event.target;
    setProjectData({ ...projectData, status: value });
  };

  const handleRecipeChange = (event) => {
    const { value } = event.target;
    setProjectData({ ...projectData, recipeId: value });
  };

  

  const handleSubmit = async (e) => {


    e.preventDefault();
    

  const payload = {
    userToken: token,
    RecipeId: projectData.recipeId,
    Status: projectData.status,
    Needles: projectData.needleIds,
    Yarns: projectData.yarnIds,
    Notes: projectData.notes
    


  };

 

  try {
      const response = await axios.post('http://localhost:5002/api/projects'+ '?userToken=' + sessionStorage.getItem('token'),payload,{
        headers: {
          'Content-Type': 'application/JSON',
          
        },
        
        
        

      });
      console.log(response.data); // Handle success
      console.log(payload)
    } catch (error) {
      console.error(error); // Handle error
    }
    
  };



  //TODO fetch all recipes and display in options for new Project
  //this to connect recipe to project so one could directly open 
  //recipe from project
  const fetchRecipes = async () => {
    setLoading(true);
    try {
        const response = await axios.get('http://localhost:5002/api/recipe/getallrecipes' + '?userToken=' + sessionStorage.getItem('token')); // TODO: Replace with the actual backend endpoint
        setRecipes(response.data || []); 
    } catch (error) {
        console.error('Error fetching recipes:', error);
    } finally {
        setLoading(false);
    }
  };
  useEffect(() => {
    fetchRecipes();
  }, []);




  return (
    <div className="box-container">
      <div className='box dark'>
        <h3>Hei,</h3>
        <p>Start et nytt prosjekt her!</p>
        
        <InputField label="Name the project" name="projectName" type="text" onChange={handleInputChange} />
        <InputField 
                    label="Status" 
                    type="select"
                    value={projectData.status}
                    onChange={handleStatusChange}
                    options={Options.map(option => ({ value: option.id, label: option.label }))}
                />   
        <InputField label="Needles" value={projectData.needleIds} type="number" onChange={handleInputChange('needleIds')} />     
        <InputField label="Yarn"  type="text" value={projectData.yarnIds} onChange={handleInputChange('yarnIds')} />    
        <InputField label="Notes" type="text" value={projectData.notes} onChange={handleInputChange('notes')} /> 
        <InputField 
                    label="Choose recipe" 
                    type="select"
                    value={projectData.recipeId}
                    onChange={handleRecipeChange}
                    options={recipes.map(recipe => ({ value: recipe.recipeId, label: recipe.recipeName }))}
                />

      

        <button className='close-button' onClick={handleSubmit}>Upload</button>
        <button className='close-button' onClick={onClose}>close</button>
      </div>
            

    </div>
  );
};

export default UploadProjects;
