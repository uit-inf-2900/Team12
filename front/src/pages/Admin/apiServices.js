// src/services/apiService.js
import axios from 'axios';

const API_URL = 'http://localhost:5002';

const getToken = () => sessionStorage.getItem('token');

export const fetchSubscribers = async () => {
    try {
        const response = await axios.get(`${API_URL}/api/newsletter/getsunscribers`, {
            params: { userToken: getToken() }
        });
        if (response.status === 200) {
            return response.data.map(email => ({ email }));
        } else {
            throw new Error('Failed to fetch subscribers');
        }
    } catch (error) {
        console.error('Error fetching subscribers:', error.response ? error.response.data : error.message);
        return [];
    }
};

/**
 * Function to fetch all the users from the database
 * @returns {JSX.Element} ViewUsers UI.
 */
export const fetchUserData = async () => {
    try {
    const response = await fetch('http://localhost:5002/getUsers');
    if (!response.ok) {
        throw new Error('Failed to fetch user data');
    }
    const data = await response.json();
    return data;
    } catch (error) {
    console.error('Error fetching user data:', error);
    return [];
    }
};


