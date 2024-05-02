import React, { useState, useEffect } from 'react';
import "../GlobalStyles/main.css";
import axios from 'axios';
import StatisticBox from './StatisticBox'; // Sjekk at stien stemmer
import { useNavigate } from 'react-router-dom';


export const Home = () => {
  const navigate = useNavigate();
  const [userProfileState, setUserProfileState] = useState({ userFullName: '', userEmail: '' });

  useEffect(() => {
    const token = sessionStorage.getItem('token');
    if (token) {
      const address = 'http://localhost:5002/getprofileinfo?userToken=' + token;
      axios.get(address)
        .then(response => {
          setUserProfileState(response.data);
        })
        .catch(error => {
          console.error("Error fetching user profile data: ", error);
          // Her kan jeg håndtere feil på en annen måte om nødvendig
        });
    }
  }, []);

  // legge inn funksjon til å hente fra back status

  return (
    <div className="page-container">
      <h1>Home </h1>      
    </div>
  );
};