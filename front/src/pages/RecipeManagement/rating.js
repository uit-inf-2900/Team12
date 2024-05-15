import React, { useState, useEffect } from 'react';
import Rating from '@mui/material/Rating';
import { styled } from '@mui/material/styles';
import axios from 'axios';
import { Box, Typography } from "@mui/material";
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';

const RateRecipe = ({ id }) => {
    const [rating, setRating] = useState(0);

    const StyledRating = styled(Rating)({
        '& .MuiRating-iconFilled': {
          color: '#ff6d75',
        },
        '& .MuiRating-iconHover': {
          color: '#ff3d47',
        },
      });

    useEffect(() => {
        fetchRating();
    }, [id]);

    const fetchRating = async () => {
        try {
            const response = await axios.get(`http://localhost:5002/api/rating/${id}?userToken=${sessionStorage.getItem('token')}`);
            setRating(response.data.rating);
        } catch (error) {
            console.error('Error fetching rating: ', error);
        }
    };

    const postRating = async (newRating) => {
        try {
            await axios.post(`http://localhost:5002/api/rating/${id}?rating=${newRating}&userToken=${sessionStorage.getItem('token')}`);
            setRating(newRating);
        } catch (error) {
            console.error('Error rating recipe: ', error);
        }
    };

    return (
        <Box sx={{ '& > legend': { margin: '20px 0' } }}>
            <Typography component="legend">Recipe Rating</Typography>
            <StyledRating
                name="customized-color"
                size="large"
                icon={<FavoriteIcon fontSize="inherit" />}
                emptyIcon={<FavoriteBorderIcon fontSize="inherit" />}
                value={rating}
                onChange={(event, newValue) => {
                    postRating(newValue);
                }}
            />
        </Box>
    );
};

export default RateRecipe;
