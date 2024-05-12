import React, { useState, useEffect } from 'react';
import axios from 'axios';
import StatisticBox from './StatisticBox';
import { useNavigate } from 'react-router-dom';
import { getImageByName } from '../../images/getImageByName';
import "../../GlobalStyles/main.css";
import "../about/about.css";
import './StatisticBox.css';
import InstagramFeed from '../../Components/UI/InstagramFeed'; 

/**
 * The home page with inventory statistics, project states and instragramfeed.
 */
export const Home = () => {
  const navigate = useNavigate();
  const [userProfileState, setUserProfileState] = useState({ userFullName: '', userEmail: '' });
  const [yarnInventoryLength, setYarnInventoryLength] = useState(0);
  const [needleInventoryLength, setNeedleInventoryLength] = useState(0);
  const [completeProjects, setCompleteProjects] = useState(0);
  const [ongoingProjects, setOngoingProjects] = useState(0);

  // Access token to instagram
  const accessTokenInsta = 'IGQWRNYjdRX3BnVHFmdVR0Qm5yR3RDWml0TTgwc3lhV1VRZAmw5U3I2eWZAkUTRKekRzOS1JWEt5REEzZA3JHX0dDSXVfdVpodWlHRXFLbngwdEtSVXhuaXdtYmRSY0dGSzhvR1NVQkhnMmlJSE5JNHFmMFJCMS1IdjAZD';
  
  // Function to handle navigation
  const handleNavigate = (path, tab) => {
    navigate(`${path}?tab=${tab}`);
  };


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
      
      // Fetches project and inventory statistics
      const fetchStatistic = async () => {
        try {
          const baseAddress = "http://localhost:5002";
          const response = await axios.get(`${baseAddress}/api/inventory/get_inventory?userToken=${token}`);
          const data = response.data;
          console.log(data);

          // Find yarn inventory
          if(data.yarnInventory){
            setYarnInventoryLength(data.yarnInventory.length);
          }
          // Find needle inventory
          if(data.needleInventory){
            setNeedleInventoryLength(data.needleInventory.length);
          }
            
          const finishedProjectsResponse = await axios.get(`${baseAddress}/getcompleteprojects?userToken=${token}`);
          setCompleteProjects(finishedProjectsResponse.data.completeProjects);
    
          const ongoingProjectsResponse = await axios.get(`${baseAddress}/getongoingprojects?userToken=${token}`);
          setOngoingProjects(ongoingProjectsResponse.data.ongoingProjects);
        } catch (error) {
          console.error("Error fetching statistics data: ", error);
        }
      };
      fetchStatistic();
      }
  }, []);
  
  // Home page
  return (
    <div className='page-container'>
      <h1 style={{padding: '20px'}}>Hello, good to see you {userProfileState.userFullName || ''}!</h1>
      <div className="home-container" style={{'display': 'flex', padding: '20px', alignItems:'flex-start'}}>
        {/* Show project and inventory */}
        <div className="statistics-container" style={{width:'40%', alignSself: 'flex-start'}}>
          <h3>Here is an overview of your projects and inventory:</h3>
          <div className="StatisticBox" style={{ display: 'flex', flexWrap: 'wrap', justifyContent:'center' }}> 
            <StatisticBox icon={getImageByName('yarnSheep')} label="yarns in stash" value={yarnInventoryLength.toString()} onClick={() => handleNavigate('/stash', 'yarn')}  />
            <StatisticBox icon={getImageByName('yarnBasket')} label="needles in stash" value={needleInventoryLength.toString()} onClick={() => handleNavigate('/stash', 'needles')} />
            <StatisticBox icon={getImageByName('pileOfSweaters')} label="complete projects" value={completeProjects.toString() } onClick={() => handleNavigate('/projects', 2)}/>
            <StatisticBox icon={getImageByName('openBook')} label="ongoing projects" value={ongoingProjects.toString()} onClick={() => handleNavigate('/projects', 1)}/>
          </div>
        </div>
        {/* Show image on the right side of home page */}
        <div className="creative-content-container" style={{width:'60%', alignItems: 'center', justifyContent: 'center', display: 'flex', flexDirection: 'column'}}>
          <h3>Today is the day to be creative! </h3>
          <img src={getImageByName('huggingYarn')} style={{ alignItems: 'center'}} alt="Pile of sweaters"/>
        </div>
      </div>
      {/* Show instagram feed */}
      <h2  style={{padding: '20px', paddingTop:'30px'}}>Here are some inspiration from Instagram </h2>
      <InstagramFeed accessToken={accessTokenInsta} />
    </div>
  );
};