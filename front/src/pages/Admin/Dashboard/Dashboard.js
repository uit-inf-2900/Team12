import React, { useState, useEffect } from 'react';
import CardDashbord from './CardDashbord'; 
import "../../../GlobalStyles/main.css";
import GeneralCard from './Card'; 

const Dashboard = ({ toggleView }) => {  // Rettet prop-navnet fra usersToken til usersToken for konsistens
    const [usersData, setUsersData] = useState([]);
    const [messagesData, setMessagesData] = useState([]);
    const [yarnData, setYarnData] = useState([]);
    const [needleData, setNeedleData] = useState([]);
    const [recipesData, setRecipesData] = useState([]);

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
            .then(data => setMessagesData(data))
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


        // TODO: Add number of subscribers to the newsletter 

        
    }, [usersToken]);  

    const userStats = [
        { label: "Total number of users", value: usersData.length },
        { label: "Banned users", value: usersData.filter(user => user.status === 'banned').length },
        { label: "Unverified users", value: usersData.filter(user => user.status === 'unverified').length },
        { label: "Verified users", value: usersData.filter(user => user.status === 'verified').length },
        { label: "Admins", value: usersData.filter(user => user.isAdmin).length },
    ];

    const Messages = [
        { label: "Total Messages", value: messagesData.length },
        { label: "Unhandled Active", value: messagesData.filter(message => message.isActive && !message.isHandled).length },
        { label: "Unhandled Inactive", value: messagesData.filter(message => !message.isActive && !message.isHandled).length},
        { label: "Handled Messages", value: messagesData.filter(message => !message.isActive && message.isHandled).length }
    ]; 

    const Needles = [
        { label: "Total Needles", value: needleData.length },
        { label: "Interchangeble Needles", value: needleData.filter(needle => needle.type === 'Interchangeble').length },
        { label: "DoublePointed Needles", value: needleData.filter(needle => needle.type === 'DoublePointed').length },
        { label: "Circular Needles", value: needleData.filter(needle => needle.type === 'Circular').length },
        { label: "Other Needles", value: needleData.filter(needle => needle.type === 'Other').length }
    ];

    const Yarn = [
        { label: "Total Yarn", value: yarnData.length },
    ];

    const Recipes = [
        { label: "Total Recipes", value: recipesData.length },
    ];

    const Newsletter = [
        { label: "Total Newsletter", value: 0 },
    ];

    return (
        <div>
            <h1>Dashboard</h1>
            <div style={{ display: "flex",flexWrap: "wrap", justifyContent: "space-between" }}>
                <GeneralCard 
                    title="User Statistics"
                    stats={userStats}
                    onClick={() => toggleView('users')}
                />
                <GeneralCard 
                    title="Message Statistics"
                    stats={Messages}
                    onClick={() => toggleView('users')}
                />
                <GeneralCard 
                    title="Recipes Statistics"
                    stats={Recipes}
                    onClick={() => toggleView('')}
                />
                <GeneralCard 
                    title="Yarn Statistics"
                    stats={Yarn}
                    onClick={() => toggleView('')}
                />
                <GeneralCard 
                    title="Needle Statistics"
                    stats={Needles}
                    onClick={() => toggleView('')}
                />
                <GeneralCard 
                    title="Newsletter subscripers"
                    stats={Newsletter}
                    onClick={() => toggleView('')}
                />
            </div>
        </div>        
    );
};

export default Dashboard;
