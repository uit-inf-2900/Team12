import React, { useState, useEffect, useRef } from 'react';
import InputField from '../../Components/UI/InputField';
import CustomButton from '../../Components/UI/Button';
import SetAlert from '../../Components/UI/Alert';
import axios from 'axios';


const UploadProjects = ({ onClose, fetchProjects }) => {

  const token = sessionStorage.getItem('token');
  const [alertInfo, setAlertInfo] = useState({open: false, severity: 'info', message: 'test message'});
  const [loading, setLoading] = useState(true);
  const [recipes, setRecipes] = useState([]);
  const [needles, setNeedles] = useState([]);
  const [yarns, setYarns] = useState([]);
  const [yarnAmount, setYarnAmount]=useState('');
  

  const [needleIds, setNeedleIds] = useState([]);


  const [projectData, setProjectData] = useState({

    
    recipeId: '',
    status: '',
    needleIds: [], 
    yarnIds: '',
    yarnType: '',
    yarnAmount: '',
    notes: '',
    projectName: '',
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

  const handleNeedleChange = (e) => {
    const {value} = e.target;

    console.log("Selected needle ID:", value);
   
    setProjectData({
      ...projectData,
      needleIds: [value]
    });

    

    //setProjectData({...projectData, needleIds: [value] })
    console.log("NeedleIds after needle selection:", projectData.needleIds);
    console.log("Project Data after needle selection:", projectData);

  };

  const handleYarnIds = () =>{
    setProjectData(() => ({
      ...projectData,
      yarnIds: { [projectData.yarnType] : projectData.yarnAmount},
      //yarnIds: [value, Amount]
    }));


  };

  const handleYarnChange = (e) => {
    const {value} = e.target;
  
    setProjectData({...projectData, yarnType: [value]});
    
    
    // setProjectData(() => ({
    //   ...projectData,
    //   yarnIds: { [value] : projectData.yarnAmount},
    //   //yarnIds: [value, Amount]
    // }));

  };


  const handleSubmit = async (e) => {

    e.preventDefault();
    
  
  const payload ={
    userToken: token,
    ProjectName: projectData.projectName,
    RecipeId: projectData.recipeId,
    Status: projectData.status,
    NeedleIds: projectData.needleIds,
    YarnIds: { [projectData.yarnType] : projectData.yarnAmount},
    Notes: projectData.notes
  };

  try {
      const response = await axios.post('http://localhost:5002/api/projects'+ '?userToken=' + sessionStorage.getItem('token'),payload,{
        headers: {
          'Content-Type': 'application/JSON',
          
        },

      });
      if(response.ok){
        console.log(response.data); // Handle success
        console.log(payload)
        ;
      }
      
    } catch (error) {
      console.error(error); // Handle error
    }
    onClose();
    fetchProjects();
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
            setYarns(data.yarnInventory);
            
        } else {
            console.error("Failed to fetch yarn data.");
        }
    } catch (error) {
        console.error("Error fetching data:", error);
    }
};



  useEffect(() => {
    fetchRecipes();
    fetchNeedles();
    fetchYarns();
  }, []);

  return (
    <div className="box-container">
      <div className='box dark'>
        <h3>Hello,</h3>
        <p>Start a new project here!</p>
        
        <InputField label="Name the project" value={projectData.projectName} name="projectName" type="text" onChange={handleInputChange('projectName')} />
        <InputField 
                    label="Status" 
                    type="select"
                    value={projectData.status}
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
        <InputField label="Amount yarn needed"  type="number" value={projectData.yarnAmount} onChange={handleInputChange('yarnAmount')} />    
        
        <InputField label="Notes" type="text" value={projectData.notes} onChange={handleInputChange('notes')} /> 
        <InputField 
                    label="Choose recipe" 
                    type="select"
                    value={projectData.recipeId}
                    onChange={handleRecipeChange}
                    options={recipes.map(recipe => ({ value: recipe.recipeId, label: recipe.recipeName}))}
                />

      

        <button className='button' onClick={handleSubmit}>Upload</button>
        <button className='button' onClick={onClose}>close</button>
      </div>
            

    </div>
  );
};

export default UploadProjects;
