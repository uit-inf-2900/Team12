import React, { useState, useEffect, useRef } from 'react';
import InputField from '../../Components/InputField';
import CustomButton from '../../Components/Button';
import axios from 'axios';


const UploadProjects = ({ onClose, fetchProjects }) => {

  const token = sessionStorage.getItem('token');
  const [loading, setLoading] = useState(true);
  const [recipes, setRecipes] = useState([]);
  const [projectInfo, setProjectInfo] = useState({
    projectName: '',
    recipe: '',
    status: '',
    needle: '',
    yarn: '',
    notes: ''
  });
  const handleInputChange = (e) => {
    setProjectInfo({ ...projectInfo, [e.target.name]: e.target.value });
  };
  const handleStatusChange = (event) => {
    const { value } = event.target;
    setProjectInfo({ ...projectInfo, status: value });
  };
  const handleRecipeChange = (event) => {
    const { value } = event.target;
    setProjectInfo({ ...projectInfo, recipe: value });
  };

  const postProject = async () => {

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


  const handleUpload = async (event) => {
    event.preventDefault();
    const formData = new FormData();

    formData.append("ProjectName", projectInfo.name);
    formData.append("UserToken", token);
    formData.append("Needle", parseInt(projectInfo.needle));
    formData.append("Yarn", projectInfo.yarn);
    formData.append("Notes", projectInfo.notes);

    try{
      axios.post('http://localhost:5002/api/projects/createProject', formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        }).then(reponse => {
            console.log("Project creation success:", reponse);
        }).catch(error => {
            // Handle error 
            console.error("Project creation error:", error);
        });
    }
    catch (error) {
      console.error('Error:', error);
      setAlertInfo({
          open: true,
          severity: 'error',
          message: 'An error occurred while creating the project.'
      });
  }

  };
    







  return (
    <div className="box-container">
      <div className='box dark'>
        <h3>Hei,</h3>
        <p>Start et nytt prosjekt her!</p>
        
        <InputField label="Name the project" name="projectName" type="text" onChange={handleInputChange} />
        <InputField 
                    label="Status" 
                    type="select"
                    value={projectInfo.status}
                    onChange={handleStatusChange}
                    options={[
                        { value: 'planned', label: 'Planned' },
                        { value: 'in-progress', label: 'In Progress' },
                        { value: 'completed', label: 'Completed' },
        
                    ]}
                />   
        <InputField label="Needle" name="needle" type="number" onChange={handleInputChange} />     
        <InputField label="Yarn" name="yarn" type="text" onChange={handleInputChange} />    
        <InputField label="Notes" name="notes" type="text" onChange={handleInputChange} /> 
        <InputField 
                    label="Choose recipe" 
                    type="select"
                    value={projectInfo.recipe}
                    onChange={handleRecipeChange}
                    options={recipes.map(recipe => ({ value: recipe.recipeId, label: recipe.recipeName }))}
                /> 

          
        <button className='close-button' onClick={onClose}>close</button>
      </div>
            

    </div>
  );
};

export default UploadProjects;
