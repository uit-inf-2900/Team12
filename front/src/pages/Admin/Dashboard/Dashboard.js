import React, { useState, useEffect } from 'react';
import "../../../GlobalStyles/main.css";
import GeneralCard from './Card'; 
import StatisticsChart from '../../../data/ChartData';
import {getImageByName} from '../../../images/getImageByName';
import { fetchSubscribers } from '../apiServices';


/**
 * The Dashboard component serves as the main view for displaying user statistics,
 * messages, inventory, recipes, and newsletter subscriptions. Each category is presented
 * in its own card with relevant statistics and visuals.
 * 
 * @param {function} toggleView - Function to change views within the application,
 * allowing navigation to detailed pages for each statistic.
 */
const Dashboard = ({ toggleView }) => {  
    const [usersData, setUsersData] = useState([]);
    const [activeMessages, setActiveMessages] = useState([]);
    const [inactiveeMessages, setInactiveMessages] = useState([]); 
    const [yarnData, setYarnData] = useState([]);
    const [needleData, setNeedleData] = useState([]);
    const [recipesData, setRecipesData] = useState([]);
    const [subscribers, setSubscribers] = useState([]);
    const [handledMessages, setHandledMessages] = useState([]);

    const usersToken = sessionStorage.getItem('token');


    // Fetch data from various APIs to populate the dashboard with updated information.
    useEffect(() => {
        // Fetch data from various APIs to populate the dashboard with updated information.
        const fetchData = async () => {
            try {
                const usersResponse = await fetch('http://localhost:5002/getUsers', { headers: { 'Accept': 'application/json' }});
                setUsersData(await usersResponse.json());

                const messagesFetchOptions = { headers: { 'Accept': 'application/json' }};
                const activeMessagesResponse = await fetch('http://localhost:5002/api/Contact?isActive=true&isHandled=false', messagesFetchOptions);
                setActiveMessages(await activeMessagesResponse.json());

                const inactiveMessagesResponse = await fetch('http://localhost:5002/api/Contact?isActive=false&isHandled=false', messagesFetchOptions);
                setInactiveMessages(await inactiveMessagesResponse.json());

                const handledMessagesResponse = await fetch('http://localhost:5002/api/Contact?isActive=false&isHandled=true', messagesFetchOptions);
                setHandledMessages(await handledMessagesResponse.json());

                const recipesResponse = await fetch(`http://localhost:5002/api/recipe/getallrecipes?userToken=${usersToken}`, { headers: { 'Accept': 'application/json' }});
                setRecipesData(await recipesResponse.json());

                const inventoryResponse = await fetch(`http://localhost:5002/api/inventory/get_inventory?userToken=${usersToken}`, { headers: { 'Accept': 'application/json' }});
                const inventoryData = await inventoryResponse.json();
                setYarnData(inventoryData.yarnInventory);
                setNeedleData(inventoryData.needleInventory);

                // Fetch newsletter subscribers separately
                setSubscribers(await fetchSubscribers());
            } catch (error) {
                console.error('Error fetching dashboard data:', error);
            }
        };

        fetchData();
    }, [usersToken]);


    // Check if the statistic is valid (greater than 0 and not NaN)
    const isValidStatistic = (stat) => {
        return stat.value > 0 && !isNaN(stat.value);
    };

    // Render the chart component if the statistics are valid, otherwise display an image
    const renderContent = (stats, label, altImage) => {
        if (stats.length > 0 && isValidStatistic(stats[0])) {
            return <StatisticsChart label={label} userStats={stats} />;
        } else {
            return <img src={getImageByName(altImage)} alt="No Data" />;
        }
    };


    // Define statistics for each category
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
                    hovermessage="Click to view user statistics"
                    chartComponent = {<StatisticsChart lable={"User Statistics"} userStats={userStats} />}
                />

                <GeneralCard 
                    title="Newsletter subscripers"
                    stats={Newsletter}
                    hovermessage="Click to view newsletter subscribers"
                    chartComponent={renderContent(Messages, "Message Statistics", "pileOfSweaters")}
                    onClick={() => toggleView('newsletter')} 
                /> 

                <GeneralCard 
                    title="Message Statistics"
                    stats={Messages}
                    hovermessage="Click to view message statistics"
                    chartComponent={renderContent(Messages, "Message Statistics", "reading")}
                    onClick={() => toggleView('messages')}
                />

                <GeneralCard 
                    title="Yarn Statistics"
                    stats={Yarn}
                    chartComponent={renderContent(Yarn, "Yarn Statistics", "yarnSheep")}
                />

                <GeneralCard 
                    title="Needle Statistics"
                    stats={Needles}
                    chartComponent={renderContent(Needles, "Needle Statistics", "yarnBasket")}
            
                />

                <GeneralCard 
                    title="Recipes Statistics"
                    stats={Recipes}
                    chartComponent={renderContent(Recipes, "Recipes Statistics", "books")}
                />
                
            </div>
        </div>        
    );
};

export default Dashboard;
