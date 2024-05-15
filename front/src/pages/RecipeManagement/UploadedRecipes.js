import React, { useState, useEffect } from 'react';
import axios from 'axios';
import "../../GlobalStyles/main.css";
import "../../GlobalStyles/Card.css"
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import MultiSelect from '../../Components/Forms/MultiSelect';
import Card from '../../Components/DataDisplay/Card';
import PDFwindow from '../../Components/Utilities/PDFwindow';
import PDFViewer from '../../Components/Utilities/PDFviewer'; // Import PDFViewer component
import { Fab, Modal, Box, Button } from "@mui/material";

const UploadedRecipes = ({ recipes, fetchRecipes }) => {
    const [sortBy, setSortBy] = useState('');
    const [loading, setLoading] = useState(true);
    const [selectedRecipe, setSelectedRecipe] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false); // State for controlling modal open/close
    
    
    const handleProjectClick = (recipe) => {
        setSelectedRecipe(recipe);
        setIsModalOpen(true); // Open modal
    };

    const handleClose = () => {
        setIsModalOpen(false);
        fetchRecipes();
    };

    
    const handleRecipeDelete = async (recipeId) => {
        try {
            const response = await axios.delete(`http://localhost:5002/api/recipe/recipe?userToken=${sessionStorage.getItem('token')}&recipeId=${recipeId}`);
            console.log('Recipe deleted:', response);
        } catch (error) {
            console.error('Error deleting recipe:', error);
        } finally {
            handleClose();
            
        }
    };
    const sortMenuItems = [
        { value: '', name: 'Select' },
        { value: 'author', name: 'Author' },
        { value: 'needleSize', name: 'Needle Size' },
        { value: 'type', name: 'Type' },
        { value: 'gauge', name: 'Gauge' }
    ];


    return (
        <div className="page-container" >
            <h1>My Recipes</h1>
           
            
            {/* {loading ? <p>Loading recipes...</p> : ( */}
                <div className='card-container' style={{justifyContent: 'flex-start', justifyContent: 'center'}}>
                    {recipes.map((recipe, index) => (
                        <Card
                        key={recipe.recipeId}
                        title={recipe.recipeName}
                        needleSize={recipe.needleSize}
                        knittingGauge={recipe.knittingGauge}
                        notes={recipe.notes}
                        onClick={() => handleProjectClick(recipe)}
                        />
                    ))}
            </div>
                
            {/* )} */}
            {selectedRecipe && (
                    <Modal open={isModalOpen}>
                        <Box>
                            <PDFViewer id={selectedRecipe.recipeId} onClose={()=>handleClose()} onDelete={()=>handleRecipeDelete(selectedRecipe.recipeId)}/>
                        </Box>   
                    </Modal>
                )} 
            
        </div>
    );
};

export default UploadedRecipes;
