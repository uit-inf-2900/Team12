import React, { useState, useEffect } from 'react';
import axios from 'axios';
import FileUpload from './UpLoad';
import UploadedRecipes from './UploadedRecipes'; // Assuming you've renamed the component
import '../../Components/Buttons.css'

// Main component for recipe-related functionality
const RecipesPage = () => {
    // State to control the display of the upload modal/form and uploaded recipes list.
    const [uploading, setUploading] = useState(false);

    // Function to fetch recipes from the server
    const fetchRecipes = async () => {
        
    };

    return (
        <div className='page-container'> 
            <h1> Welcome to the Recipes Page! </h1>

            {/* Upload a recipe */}
            <button className='light-button' onClick={() => setUploading(true)}>Upload Recipe</button>
            {uploading && <FileUpload onClose={() => setUploading(false)} />}

            {/* Component to display uploaded recipes */}
            <UploadedRecipes fetchRecipes={fetchRecipes} />
        </div>
    );
}

export default RecipesPage;
