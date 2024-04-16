import React, { useState, useEffect } from 'react';
import "../GlobalStyles/main.css";
import './home.css';
import axios from 'axios';
import StatisticBox from './StatisticBox'; // Sjekk at stien stemmer
import { useNavigate } from 'react-router-dom';

import KnittingImage from "../images/knitting.png";
import SixImage from "../images/6.png"; // Status of yarn used
import StashImage from "../images/stash.png"; // Status of needles used
import PileOfSweatersImage from "../images/pileOfSweaters.png"; // Status of completed projects
import OpenBookImage from "../images/openBook.png"; // Other status
import HuggingYarnImage from "../images/huggingYarn.png";

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
    <div className="customs-box">
      {/*  */}
      <h2>God dag {userProfileState.userFullName || 'Loading...'}!</h2>
      <h4>Her har du en oversikt over ditt arbeid sålangt:</h4>
      <div className="statistics-container">
        <StatisticBox icon={KnittingImage} label="nøster brukt" value="15" />        
        <StatisticBox icon={SixImage} label="nøster brukt" value="132" />       
        <StatisticBox icon={StashImage} label="nøster brukt" value="456" />
      </div>
      <div className="statistics-container">
        <StatisticBox icon={PileOfSweatersImage} label="nøster brukt" value="14" />
        <StatisticBox icon={OpenBookImage} label="nøster brukt" value="189" />       
        <StatisticBox icon={HuggingYarnImage} label="nøster brukt" value="19" />
      </div>
    </div>
  );
};