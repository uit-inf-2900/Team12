import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Upload from './UpLoad';
import UploadedRecipes from './UploadedRecipes';
import "../../GlobalStyles/main.css";
import Button from '@mui/material/Button';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import Box from '@mui/material/Box';
import ModalContent from "../../Components/Forms/ModualContent";

const RecipesPage = () => {
    const [uploading, setUploading] = useState(false);
    const [recipes, setRecipes] = useState([]);

    const fetchRecipes = async () => {
        try {
            const response = await axios.get('http://localhost:5002/api/recipe/getallrecipes', {
                params: { userToken: sessionStorage.getItem('token') }
            });
            setRecipes(response.data || []);
        } catch (error) {
            console.error('Error fetching recipes:', error);
        }
    };

    useEffect(() => {
        fetchRecipes();
    }, []);

    return (
        <div>
            <Box className={uploading ? "page-container blur-background" : "page-container"}>
                <h1>Welcome to the Recipes Page!</h1>
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
                <UploadedRecipes recipes={recipes} fetchRecipes={fetchRecipes} />
            </Box>
            <ModalContent 
                open={uploading}
                handleClose={() => setUploading(false)} 
                infobox={<Upload onClose={() => setUploading(false)} onUploadSuccess={fetchRecipes} />}
            />
        </div>
    );
}

export default RecipesPage;
