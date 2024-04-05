import React, { useState, useEffect } from 'react';
import axios from 'axios';
import "../../GlobalStyles/main.css";
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import MultiSelect from '../../Components/MultiSelect';


const UploadedRecipes = () => {
    // State for storing recipes, sorting criteria, and loading status
    const [recipes, setRecipes] = useState([]);
    const [sortBy, setSortBy] = useState('');
    const [loading, setLoading] = useState(true);

    // Effect to fetch recipes on component mount
    useEffect(() => {
        fetchRecipes();
    }, []);

    // Fetch recipes from the backend
    const fetchRecipes = async () => {
        setLoading(true);
        try {
            const response = await axios.get('YOUR_BACKEND_ENDPOINT'); // TODO: Replace with the actual backend endpoint
            setRecipes(response.data || []); 
        } catch (error) {
            console.error('Error fetching recipes:', error);
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
                <ul>
                    {recipes.map((recipe, index) => (
                        <li key={index}>
                            {recipe.name} - {recipe.needleSize}, {recipe.type}, {recipe.gauge}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default UploadedRecipes;
