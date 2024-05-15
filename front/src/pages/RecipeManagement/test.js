import React, { useState, useMemo } from 'react';
import "../../GlobalStyles/main.css";
import "../../GlobalStyles/Card.css";
import { InputLabel, MenuItem, FormControl, Select, TextField, Modal, Box, Button } from '@mui/material';
import Card from '../../Components/DataDisplay/Card';
import PDFViewer from '../../Components/Utilities/PDFviewer'; // Import PDFViewer component
import axios from 'axios';

const UploadedRecipes = ({ recipes, fetchRecipes }) => {
    const [searchText, setSearchText] = useState('');
    const [needleSizeFilter, setNeedleSizeFilter] = useState('');
    const [knitDensityFilter, setKnitDensityFilter] = useState('');
    const [selectedRecipe, setSelectedRecipe] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false); // State for controlling modal open/close

    const handleProjectClick = (recipe) => {
        setSelectedRecipe(recipe);
        setIsModalOpen(true);
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

    // Extract unique needle sizes and knitting gauges
    const needleSizes = useMemo(() => [...new Set(recipes.map(r => r.needleSize).filter(Boolean))], [recipes]);
    const knittingGauges = useMemo(() => [...new Set(recipes.map(r => r.knittingGauge).filter(Boolean))], [recipes]);

    // Filtering logic
    const filteredRecipes = recipes.filter(recipe =>
        (searchText ? recipe.recipeName.toLowerCase().includes(searchText.toLowerCase()) : true) &&
        (needleSizeFilter ? recipe.needleSize === needleSizeFilter : true) &&
        (knitDensityFilter ? recipe.knittingGauge === knitDensityFilter : true)
    );

    return (
        <div className="page-container">
            <h1>My Recipes</h1>
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: 20, width:'80%' ,  justifyContent: 'center',  margin: '0 auto'}}>
                <TextField
                    label="Search Recipes by Name"
                    variant="outlined"
                    value={searchText}
                    onChange={(e) => setSearchText(e.target.value)}
                    style={{ flexGrow: 2, marginRight: 10, width: '100%' }}
                />
                <FormControl style={{ minWidth: 150, marginRight: 10 }}>
                    <InputLabel>Needle Size</InputLabel>
                    <Select
                        value={needleSizeFilter}
                        label="Needle Size"
                        onChange={(e) => setNeedleSizeFilter(e.target.value)}
                    >
                        <MenuItem value=""><em>None</em></MenuItem>
                        {needleSizes.map(size => (
                            <MenuItem key={size} value={size}>{size}</MenuItem>
                        ))}
                    </Select>
                </FormControl>
                <FormControl style={{ minWidth: 150 }}>
                    <InputLabel>Knitting Gauge</InputLabel>
                    <Select
                        value={knitDensityFilter}
                        label="Knitting Gauge"
                        onChange={(e) => setKnitDensityFilter(e.target.value)}
                    >
                        <MenuItem value=""><em>None</em></MenuItem>
                        {knittingGauges.map(gauge => (
                            <MenuItem key={gauge} value={gauge}>{gauge}</MenuItem>
                        ))}
                    </Select>
                </FormControl>
            </div>
            <div className='card-container'>
                {filteredRecipes.map((recipe, index) => (
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
            {selectedRecipe && (
                <Modal open={isModalOpen} onClose={handleClose}>
                    <Box sx={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', bgcolor: 'background.paper', boxShadow: 24, p: 4 }}>
                        <PDFViewer id={selectedRecipe.recipeId} onClose={handleClose} onDelete={() => handleRecipeDelete(selectedRecipe.recipeId)} />
                    </Box>
                </Modal>
            )}
        </div>
    );
};

export default UploadedRecipes;
