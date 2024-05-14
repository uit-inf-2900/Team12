

import React, { useState } from 'react';
import axios from 'axios';
import Upload from './UpLoad';
import UploadedRecipes from './UploadedRecipes'; 
import "../../GlobalStyles/main.css";
import Button from '@mui/material/Button';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import Box from '@mui/material/Box'; // Import Box from MUI

import ModalContent from "../../Components/Forms/ModualContent";



// Main component for recipe-related functionality
const RecipesPage = () => {
    // State to control the display of the upload modal/form and uploaded recipes list.
    const [uploading, setUploading] = useState(false);

    // Toggle for applying blur when modal is open
    const pageContainer = uploading ? "page-container blur-background" : "page-container";
    

    return (
        <div>
            {/* Use Box instead of div to apply the class for blurring */}
            <Box className={pageContainer}> 
                <h1> Welcome to the Recipes Page! </h1>

                {/* Upload a recipe using Material-UI Button with custom styles */}
                <Button
                    variant="outlined"
                    color='dark'
                    startIcon={<CloudUploadIcon style={{ color: 'black' }} />}
                    onClick={() => setUploading(true)}
                    
                    sx={{
                        color: 'black',
                        backgroundColor: 'white',
                        '&:hover': {
                            backgroundColor: 'white',
                        }, 
                        maxWidth:'fit-content', 
                        padding: '6px 20px', 
                        margin: 'auto',
                    }}
                >
                    Upload Recipes
                </Button>
                
                {/* Component to display uploaded recipes */}
                <UploadedRecipes />
            </Box>

            {/* FileUpload modal - When this is open, the page content is blurred */}
            <ModalContent 
                open={uploading}
                handleClose={() => setUploading(false)} 
                infobox={<Upload onClose={() => setUploading(false)} fetchRecipes={()=>fetchRecipes()} />} 
            />
        </div>
    );
}

export default RecipesPage;
