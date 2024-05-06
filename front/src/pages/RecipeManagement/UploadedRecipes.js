import React, { useState, useEffect } from 'react';
import axios from 'axios';
import "../../GlobalStyles/main.css";
import "../../GlobalStyles/Card.css"
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import MultiSelect from '../../Components/MultiSelect';
import Card from '../../Components/Card';
import PDFViewer from '../../Components/PDFviewer';

import { Fab, Modal, Box } from "@mui/material";

const UploadedRecipes = () => {
    // State for storing recipes, sorting criteria, and loading status
    const [recipes, setRecipes] = useState([]);
    const [sortBy, setSortBy] = useState('');
    const [loading, setLoading] = useState(true);
    const [selectedRecipe, setSelectedRecipe] = useState(null);
    const [recipeCard, setRecipeCard]=useState(false);


    const toggleRecipeCard = () => {
        setRecipeCard(!recipeCard);
    };

    // Effect to fetch recipes on component mount
    useEffect(() => {
        fetchRecipes();
    }, []);

    // Fetch recipes from the backend
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

    const deleteRecipe=async () => {
        try {
            const response = await axios.delete(`http://localhost:5002/api/recipe/recipe?userToken=${sessionStorage.getItem('token')}&recipeId=${id}`);
            setRecipes(response.data || []); 
        } catch (error) {
            console.error('Error deleting recipe:', error);
        } finally {
            setLoading(false);
        }

    };

    // Handle sort criteria change
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
        setRecipeCard(true);
        
        
    };

    const handleRecipeDelete = () => {
        deleteRecipe(recipe.recipeId);
    };

    // Menu items for the sort select
    const sortMenuItems = [
        { value: '', name: 'Select' },
        { value: 'author', name: 'Author' },
        { value: 'needleSize', name: 'Needle Size' },
        { value: 'type', name: 'Type' },
        { value: 'gauge', name: 'Gauge' }
    ];

    // Show loading state or recipes list 
    return (
        <div className="page-container">
            <h1>My Recipes</h1>
            <MultiSelect 
                label="Sort by"
                value={sortBy}
                handleChange={handleSortChange}
                menuItems={sortMenuItems}
            />
            {/* Check if data is still being loaded */}
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
                        />
                        
                        
                    ))}
                    
                    {selectedRecipe && (

                        <Modal open={recipeCard} onClose={toggleRecipeCard}>
                            <PDFViewer id={selectedRecipe.recipeId} onClose={toggleRecipeCard} />
                        </Modal>
                    )}   
                </div>
                
                
            )}
            

           
            

        </div>
    );
};

export default UploadedRecipes;