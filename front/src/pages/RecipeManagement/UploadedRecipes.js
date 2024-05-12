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

const UploadedRecipes = () => {
    const [recipes, setRecipes] = useState([]);
    const [sortBy, setSortBy] = useState('');
    const [loading, setLoading] = useState(true);
    const [selectedRecipe, setSelectedRecipe] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false); // State for controlling modal open/close

    useEffect(() => {
        fetchRecipes();
    }, []);

    const fetchRecipes = async () => {
        setLoading(true);
        try {
            const response = await axios.get('http://localhost:5002/api/recipe/getallrecipes' + '?userToken=' + sessionStorage.getItem('token'));
            setRecipes(response.data || []); 
        } catch (error) {
            console.error('Error fetching recipes:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSortChange = (event) => {
        setSortBy(event.target.value);
        const sortedRecipes = [...recipes].sort((a, b) => {
            if (a[event.target.value] < b[event.target.value]) 
                return -1;
            if (a[event.target.value] > b[event.target.value]) 
                return 1;
            return 0;
        });
        setRecipes(sortedRecipes);
    };

    const handleProjectClick = (recipe) => {
        setSelectedRecipe(recipe);
        setIsModalOpen(true); // Open modal
    };

    const handleRecipeDelete = async (recipeId) => {
        try {
            const response = await axios.delete(`http://localhost:5002/api/recipe/recipe?userToken=${sessionStorage.getItem('token')}&recipeId=${recipeId}`);
            setRecipes(response.data || []); 
        } catch (error) {
            console.error('Error deleting recipe:', error);
        } finally {
            setLoading(false);
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
        <div className="page-container">
            <h1>My Recipes</h1>
            <MultiSelect 
                label="Sort by"
                value={sortBy}
                handleChange={handleSortChange}
                menuItems={sortMenuItems}
            />
            
            {loading ? <p>Loading recipes...</p> : (
                <div className='card-container'>
                    {recipes.map((recipe, index) => (
                        <Card
                            key={recipe.recipeId}
                            title={recipe.recipeName}
                            needleSize={recipe.needleSize}
                            knittingGauge={recipe.knittingGauge}
                            notes={recipe.notes}
                            onClick={() => handleProjectClick(recipe)}
                            onDelete={() => handleRecipeDelete(recipe.recipeId)}
                        />
                    ))}
                </div>
                
            )}
            {selectedRecipe && (
                    <Modal open={isModalOpen}>
                        <Box>
                            <PDFViewer id={selectedRecipe.recipeId} onClose={()=>setIsModalOpen(false)}/>
                        </Box>   
                    </Modal>
                )} 
            
        </div>
    );
};

export default UploadedRecipes;
