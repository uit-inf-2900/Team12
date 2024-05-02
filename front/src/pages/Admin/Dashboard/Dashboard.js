import React, { useState, useEffect } from 'react';
import "../../../GlobalStyles/main.css";
import GeneralCard from './Card'; 
import StatisticsChart from '../../../data/ChartData';
import {getImageByName} from '../../../images/getImageByName';
import { fetchSubscribers } from '../apiServices';

const Dashboard = ({ toggleView }) => {  
    const [usersData, setUsersData] = useState([]);
    const [activeMessages, setActiveMessages] = useState([]);
    const [inactiveeMessages, setInactiveMessages] = useState([]);
    const [handledMessages, setHandledMessages] = useState([]);
    const [yarnData, setYarnData] = useState([]);
    const [needleData, setNeedleData] = useState([]);
    const [recipesData, setRecipesData] = useState([]);
    const [subscribers, setSubscribers] = useState([]);

    const usersToken = sessionStorage.getItem('token');


    useEffect(() => {
        // Get userinfo
        fetch('http://localhost:5002/getUsers', { headers: { 'Accept': 'application/json' }})
            .then(response => response.json())
            .then(data => setUsersData(data))
            .catch(error => console.error('Error fetching users:', error));

        // Get messages 
        fetch('http://localhost:5002/api/Contact?isActive=false&isHandled=false', { headers: { 'Accept': 'application/json' }})
            .then(response => response.json())
            .then(data => setInactiveMessages(data))
            .catch(error => console.error('Error fetching messages:', error));
        fetch('http://localhost:5002/api/Contact?isActive=false&isHandled=true', { headers: { 'Accept': 'application/json' }})
            .then(response => response.json())
            .then(data => setHandledMessages(data))
            .catch(error => console.error('Error fetching messages:', error));
        fetch('http://localhost:5002/api/Contact?isActive=true&isHandled=false', { headers: { 'Accept': 'application/json' }})
            .then(response => response.json())
            .then(data => setActiveMessages(data))
            .catch(error => console.error('Error fetching messages:', error));
        

        // Get recipes
        fetch(`http://localhost:5002/api/recipe/getallrecipes?userToken=${usersToken}`, { headers: { 'Accept': 'application/json' }})
            .then(response => response.json())
            .then(data => setRecipesData(data))
            .catch(error => console.error('Error fetching recipes:', error));

        // Get inventory
        fetch(`http://localhost:5002/api/inventory/get_inventory?userToken=${usersToken}`, { headers: { 'Accept': 'application/json' }})
            .then(response => response.json())
            .then(data => {
                setYarnData(data.yarnInventory);
                setNeedleData(data.needleInventory);
            })
            .catch(error => console.error('Error fetching inventory:', error));


        // Get newsletter subscribers 
        fetchSubscribers().then(data => {
            setSubscribers(data);
        }).catch(error => console.error('Error fetching newsletter subscribers:', error));    
    }, [usersToken]);  

    const userStats = [
        { label: "Total number of users", value: usersData.length },
        { label: "Banned users", value: usersData.filter(user => user.status === 'banned').length },
        { label: "Unverified users", value: usersData.filter(user => user.status === 'unverified').length },
        { label: "Verified users", value: usersData.filter(user => user.status === 'verified').length },
        { label: "Admins", value: usersData.filter(user => user.isAdmin).length },
    ];

    const totalMessages = activeMessages.length + inactiveeMessages.length + handledMessages.length;
    const Messages = [
        { label: "Total Messages", value: totalMessages },
        { label: "Active", value: activeMessages.length }, 
        { label: "Inactive", value: inactiveeMessages.length},
        { label: "Handled Messages", value: handledMessages.length}, 
    ]; 

    const Needles = [
        { label: "Total Needles", value: needleData.length },
        { label: "Interchangeble", value: needleData.filter(needle => needle.type === 'Interchangeble').length },
        { label: "DoublePointed", value: needleData.filter(needle => needle.type === 'DoublePointed').length },
        { label: "Circular", value: needleData.filter(needle => needle.type === 'Circular').length },
        { label: "Other", value: needleData.filter(needle => needle.type !== 'Interchangeble' && needle.type !== 'DoublePointed' && needle.type !== 'Circular').length }
    ];

    const Yarn = [
        { label: "Total Yarn", value: yarnData.length },
    ];

    const Recipes = [
        { label: "Total Recipes", value: recipesData.length },
    ];

    const Newsletter = [
        { label: "Newsletter Subscribers", value: subscribers.length },
    ];

    return (
        <div>
            <div style={{ display: "flex",flexWrap: "wrap", justifyContent: "space-between" }}>
                <GeneralCard 
                    title="User Statistics"
                    stats={userStats}
                    onClick={() => toggleView('users')}
                    chartComponent = {<StatisticsChart lable={"User Statistics"} userStats={userStats} />}
                />

                <GeneralCard 
                    title="Newsletter subscripers"
                    stats={Newsletter}
                    image={getImageByName('pileOfSweaters')}
                    onClick={() => toggleView('newsletter')} 
                /> 

                <GeneralCard 
                    title="Message Statistics"
                    stats={Messages}
                    onClick={() => toggleView('messages')}
                    chartComponent = {<StatisticsChart lable={"Message Statistics"} userStats={Messages} />}
                />

                <GeneralCard 
                    title="Yarn Statistics"
                    stats={Yarn}
                    image={getImageByName('yarnBasket')}
                    // onClick={() => toggleView('')}
                />

                <GeneralCard 
                    title="Needle Statistics"
                    stats={Needles}
                    // onClick={() => toggleView('')}
                    chartComponent = {<StatisticsChart lable={"Needle Statistics"} userStats={Needles} />}
                />

                <GeneralCard 
                    title="Recipes Statistics"
                    stats={Recipes}
                    image={getImageByName('books')}
                    // onClick={() => toggleView('')}
                />
                
            </div>
        </div>        
    );
};

export default Dashboard;
