import React, { useState, useEffect } from 'react';
import axios from 'axios';
import StatisticBox from './StatisticBox';
import { useNavigate } from 'react-router-dom';
import { getImageByName } from '../../images/getImageByName';
import "../../GlobalStyles/main.css";
import "../about/about.css";
import './StatisticBox.css';
import InstagramFeed from '../../Components/UI/InstagramFeed'; 
import heroImg from '../../images/logo/logoOrange.svg';
import Inspiration from './landingPage/inspiration';

/**
 * The home page with inventory statistics, project states and instragramfeed.
 */
export const Home = () => {
  const navigate = useNavigate();
  const [userProfileState, setUserProfileState] = useState({ userFullName: '', userEmail: '' });
  const [yarnInventoryLength, setYarnInventoryLength] = useState(0);
  const [needleInventoryLength, setNeedleInventoryLength] = useState(0);
  const [completeProjects, setCompleteProjects] = useState([]);
  const [ongoingProjects, setOngoingProjects] = useState([]);
  const [ongoingCount, setOngoingCount] = useState(0);
  const [completedCount, setCompletedCount] = useState(0);

  // Function to handle navigation
  const handleNavigate = (path, tab) => {
    navigate(`${path}?tab=${tab}`);
  };

  useEffect(() => {
    const token = sessionStorage.getItem('token');

    // Fetches the name of the user
    if (token) {
      const address = `http://localhost:5002/getprofileinfo?userToken=${token}`;
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
          if (data.yarnInventory) {
            setYarnInventoryLength(data.yarnInventory.length);
          }
          // Find needle inventory
          if (data.needleInventory) {
            setNeedleInventoryLength(data.needleInventory.length);
          }

          // Fetch projects data
          const projectsResponse = await axios.get(`${baseAddress}/api/projects?userToken=${token}`);
          const projectsData = projectsResponse.data;

          // Filter and set projects
          const completed = projectsData.filter(project => project.status === '2');
          const ongoing = projectsData.filter(project => project.status === '1');

          setCompleteProjects(completed);
          setCompletedCount(completed.length);

          setOngoingProjects(ongoing);
          setOngoingCount(ongoing.length);

        } catch (error) {
          console.error("Error fetching statistics data: ", error);
        }
      };
      fetchStatistic();
    }
  }, []);

  return (
    <div className='page-container'>
      <h1 style={{ padding: '20px' }}>Hello, good to see you {userProfileState.userFullName || ''}!</h1>
      <div className="home-container" style={{ display: 'flex', padding: '20px', alignItems: 'flex-start' }}>
        {/* Show project and inventory */}
        <div className="statistics-container" style={{ width: '40%', margin: '0 auto', maxWidth: '500px', textAlign: 'center' }}>
          <h3>Here is an overview of your projects and inventory:</h3>
          <div className="StatisticBox" style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center' }}> 
            <StatisticBox icon={getImageByName('yarnSheep')} label="yarns in stash" value={yarnInventoryLength.toString()} onClick={() => handleNavigate('/stash', 'yarn')}  />
            <StatisticBox icon={getImageByName('yarnBasket')} label="needles in stash" value={needleInventoryLength.toString()} onClick={() => handleNavigate('/stash', 'needles')} />
            <StatisticBox icon={getImageByName('pileOfSweaters')} label="complete projects" value={completedCount.toString()} onClick={() => handleNavigate('/projects', 2)} />
            <StatisticBox icon={getImageByName('openBook')} label="ongoing projects" value={ongoingCount.toString()} onClick={() => handleNavigate('/projects', 1)} />
          </div>
        </div>
        {/* Show image on the right side of home page */}
        <div className="creative-content-container" style={{ width: '60%', alignItems: 'center', justifyContent: 'center', display: 'flex', flexDirection: 'column' }}>
          <h3>Today is the day to be creative!</h3>
          <img src={heroImg} style={{ width: 400, paddingTop: 50 }} alt="Hero" />
        </div>
      </div>
      {/* Show instagram feed */}
      <Inspiration /> 
    </div>
  );
};

export default Home;
