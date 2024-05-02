import React, { useState, useEffect } from 'react';
import "../GlobalStyles/main.css";
import './home.css';
import axios from 'axios';
import StatisticBox from './StatisticBox';
import { useNavigate } from 'react-router-dom';
import './StatisticBox.css';




export const Home = () => {
  const navigate = useNavigate();
  const [userProfileState, setUserProfileState] = useState({ userFullName: '', userEmail: '' });
  const [yarnsUsed, setYarnsUsed] = useState(0);
  const [needlesInStash, setNeedlesInStash] = useState(0);
  const [completeProjects, setCompleteProjects] = useState(0);
  const [ongoingProjects, setOngoingProjects] = useState(0);

  useEffect(() => {
    const token = sessionStorage.getItem('token');
    // Fetches the name of the user
    if (token) {
      const address = 'http://localhost:5002/getprofileinfo?userToken=' + token;
      axios.get(address)
        .then(response => {
          setUserProfileState(response.data);
        })
        .catch(error => {
          console.error("Error fetching profile data: ", error);
        });
        
      const fetchStatistic = async () => {
        try {
          // Fetches the number of yarns in stash
          const yarnsResponse = await axios.get(`${baseAddress}/getyarnsused?userToken=${token}`);
          setYarnsUsed(yarnsResponse.data.yarnsUsed);
            
          // Fetches the number of needles in stash 
          const needlesResponse = await axios.get(`${baseAddress}/getneedlesinstash?userToken=${token}`);
          setNeedlesInStash(needlesResponse.data.needlesInStash);
            
          // Fetches the number of complete projects
          const finishedProjectsResponse = await axios.get(`${baseAddress}/getcompleteprojects?userToken=${token}`);
          setCompleteProjects(finishedProjectsResponse.data.completeProjects);
    
          // Fetches the number of ongoing projects 
          const ongoingProjectsResponse = await axios.get(`${baseAddress}/getongoingprojects?userToken=${token}`);
          setOngoingProjects(ongoingProjectsResponse.data.ongoingProjects);
        } catch (error) {
          console.error("Error fetching statistics data: ", error);
        }
      };
      fetchStatistic();
    }
  }, []);

  return (
    <div className="page-container">
      <header className="main-header">
        <h2>God dag {userProfileState.userFullName || 'Loading...'}!</h2>
      </header>
      
      <div className="content-container">
        <div className="statistics-container" style={{ flex: '2' }}> {/* Updated */}
          <h4>Her har du en oversikt over ditt arbeid sålangt:</h4>
          <StatisticBox icon={KnittingImage} label="yarns used" value={yarnsUsed.toString()} />
          <StatisticBox icon={SixImage} label="needles in stash" value={needlesInStash.toString()} />
          <StatisticBox icon={KnittingImage} label="complete projects" value={completeProjects.toString()} />
          <StatisticBox icon={SixImage} label="ongoing projects" value={ongoingProjects.toString()} />          
        </div>
        
        <div className="creative-content-container" style={{ flex: '3' }}> {/* Updated */}
          <h4>I dag er dagen for å være kreativ</h4>
          <img src={PileOfSweatersImage} className="creative-image" />
        </div>
      </div>
    </div>
  );
};