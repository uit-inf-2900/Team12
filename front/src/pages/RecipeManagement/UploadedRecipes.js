import React, { useState, useMemo } from 'react';
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
import { TextField, Modal, Box, Button } from '@mui/material';

const UploadedRecipes = ({ recipes, fetchRecipes }) => {
    const [searchText, setSearchText] = useState('');
    const [sortBy, setSortBy] = useState('');
    const [loading, setLoading] = useState(true);
    const [needleSizeFilter, setNeedleSizeFilter] = useState('');
    const [knitDensityFilter, setKnitDensityFilter] = useState('');
    const [selectedRecipe, setSelectedRecipe] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false); // State for controlling modal open/close
    
    // Open modual when clicked on
    const handleProjectClick = (recipe) => {
        setSelectedRecipe(recipe);
        setIsModalOpen(true); // Open modal
    };


    // Close modual
    const handleClose = () => {
        setIsModalOpen(false);
        fetchRecipes();
    };

    // Handle deletion of code 
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
        <div className="page-container" style={{ width: '80%', margin: '0 auto' }}>
            <h1>My Recipes</h1>
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: 20, width:'80%' ,  justifyContent: 'center',  margin: '0 auto'}}>
                {/* Search field for sercing for recipes */}
                <TextField
                    label="Search Recipes by Name"
                    variant="outlined"
                    value={searchText}
                    onChange={(e) => setSearchText(e.target.value)}
                    style={{ flexGrow: 2, marginRight: 10, width: '100%' }}
                />
                {/* Dropdown for sorting recipes by needle size*/}
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
                {/* Dropdown for sorting recipes by Knitting Gauge*/}
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
            {/* {loading ? <p>Loading recipes...</p> : ( */}
                <div className='card-container' style={{justifyContent: 'flex-start', justifyContent: 'center'}}>
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
