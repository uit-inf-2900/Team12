import React, { useState, useEffect } from 'react';
import "../GlobalStyles/main.css";
import axios from 'axios';
import StatisticBox from './StatisticBox';
import { useNavigate } from 'react-router-dom';
import './StatisticBox.css';
import InstagramFeed from './KnitHubResources/InstagramFeed'; // Importer InstagramFeed-komponenten
// Import images
import KnittingImage from "../images/knitting.png";
import SixImage from "../images/6.png"; // Status of yarn used
import StashImage from "../images/stash.png"; // Status of needles used
import PileOfSweatersImage from "../images/pileOfSweaters.png"; // Status of completed projects
import OpenBookImage from "../images/openBook.png"; // Other status
import HuggingYarnImage from "../images/huggingYarn.png";
import CustomButton from '../Components/Button';

import "./about/about.css";


export const Home = () => {
  const navigate = useNavigate();
  const [userProfileState, setUserProfileState] = useState({ userFullName: '', userEmail: '' });
  const [yarnInventoryLength, setYarnInventoryLength] = useState(0);
  const [needleInventoryLength, setNeedleInventoryLength] = useState(0);
  const [completeProjects, setCompleteProjects] = useState(0);
  const [ongoingProjects, setOngoingProjects] = useState(0);

  // access to instagram
  const accessTokenInsta = 'IGQWRNYjdRX3BnVHFmdVR0Qm5yR3RDWml0TTgwc3lhV1VRZAmw5U3I2eWZAkUTRKekRzOS1JWEt5REEzZA3JHX0dDSXVfdVpodWlHRXFLbngwdEtSVXhuaXdtYmRSY0dGSzhvR1NVQkhnMmlJSE5JNHFmMFJCMS1IdjAZD';


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
          const baseAddress = "http://localhost:5002";
          const response = await axios.get(`${baseAddress}/api/inventory/get_inventory?userToken=${token}`);
          const data = response.data;
          console.log(data);

          if(data.yarnInventory){
            setYarnInventoryLength(data.yarnInventory.length);
          }
          if(data.needleInventory){
            setNeedleInventoryLength(data.needleInventory.length);
          }
            
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
    <div className='page-container'>
      <h1 style={{padding: '20px'}}>God dag {userProfileState.userFullName || ''}!</h1>
      <div className="home-container" style={{'display': 'flex', padding: '20px', alignItems:'flex-start'}}>
        <div className="statistics-container" style={{width:'40%', alignSself: 'flex-start'}}>
          <h3>Her har du en oversikt over ditt arbeid sålangt:</h3>
          <div className="StatisticBox" style={{ display: 'flex', flexWrap: 'wrap', justifyContent:'center' }}> 
            <StatisticBox icon={KnittingImage} label="yarns in stash" value={yarnInventoryLength.toString()} />
            <StatisticBox icon={SixImage} label="needles in stash" value={needleInventoryLength.toString()} />
            <StatisticBox icon={PileOfSweatersImage} label="complete projects" value={completeProjects.toString()} />
            <StatisticBox icon={OpenBookImage} label="ongoing projects" value={ongoingProjects.toString()} />
          </div>
        </div>
        <div className="creative-content-container" style={{width:'60%', alignItems: 'center', justifyContent: 'center', display: 'flex', flexDirection: 'column'}}>
          <h3>I dag er dagen for å være kreativ</h3>
          <img src={PileOfSweatersImage} style={{ alignItems: 'center'}}/>
        </div>
      </div>

      <h2  style={{padding: '20px', paddingTop:'30px'}}>Inspiration from Instagram </h2>
      <InstagramFeed accessToken={accessTokenInsta} />
    </div>
  );
};