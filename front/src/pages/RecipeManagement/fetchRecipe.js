import React, { useState, useEffect } from 'react';
import axios from 'axios';
import "../../GlobalStyles/main.css";
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import MultiSelect from '../../Components/MultiSelect';



const Recipe = () => {

    const [recipe, setRecipe] = useState();


    const fetchRecipe = async () => {
    setLoading(true);
    try {
        const response = await axios.get('http://localhost:5002/api/recipe/getrecipe' + '?userToken=' + sessionStorage.getItem('token')); // TODO: Replace with the actual backend endpoint
        setRecipes(response.data || []); 
    } catch (error) {
        console.error('Error fetching recipes:', error);
    } finally {
        setLoading(false);
    }

    };


    return(

        <div>

        </div>

    );
}

