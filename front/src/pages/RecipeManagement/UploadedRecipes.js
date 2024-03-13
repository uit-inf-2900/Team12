import React, { useState, useEffect } from 'react';
import axios from 'axios';
import "../../GlobalStyles/main.css";

const UploadedRecipes = () => {
    // State for storing recipes, sorting criteria, and loading status
    const [recipes, setRecipes] = useState([]);
    const [sortBy, setSortBy] = useState('');
    const [loading, setLoading] = useState(true);

    // axios.get('/api/uploaded'); 

    // Effect to fetch recipes on component mount
    useEffect(() => {
        fetchRecipes();
    }, []);

    // Fetch recipes from the backend
    const fetchRecipes = async () => {
        setLoading(true);
        console.log("response");
        try {
            const response = await axios.get('http://localhost:5002/recipe'); // TODO: Replace with the actual backend endpoint
            setRecipes(response.data || []); 
        } catch (error) {
            console.error('Error fetching recipes:', error);
        } finally {
            setLoading(false);
        }
    };

    // Handle sort criteria change
    const handleSortChange = (e) => {
        setSortBy(e.target.value);
        const sortedRecipes = [...recipes].sort((a, b) => {
            if (a[e.target.value] < b[e.target.value]) 
                return -1;
            if (a[e.target.value] > b[e.target.value]) 
                return 1;
            return 0;
        });
        setRecipes(sortedRecipes);
    };

    // Show loading state or recipes list
    return (
        <div className="page-container">
            <h1>My Recipes</h1>
            <div>
                <label>Sort by:</label>
                <select onChange={handleSortChange} className="select-dropdown" id="sortSelect">
                    <option value="">Select</option>
                    <option value="author">Author</option>
                    <option value="needleSize">Needle Size</option>
                    <option value="type">Type</option>
                    <option value="gauge">Gauge</option>
                </select>
            </div>
            {/* Check if data is still being loaded */}
            {loading ? <p>Loading recipes...</p> : (
                <ul>
                    {recipes.map((recipe) => (
                        <li key={recipe.id}>
                            {recipe.name} - {recipe.needleSize}, {recipe.type}, {recipe.gauge}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default UploadedRecipes;
