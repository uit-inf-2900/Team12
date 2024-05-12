import React, { useState, useEffect } from 'react';
import "../../../GlobalStyles/main.css";
import GeneralCard from './Card'; 
import StatisticsChart from '../../../data/ChartData';
import {getImageByName} from '../../../images/getImageByName';
import { fetchSubscribers } from '../apiServices';

const API_BASE_URL = 'http://localhost:5002';


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
    const [inactiveMessages, setInactiveMessages] = useState([]); 
    const [yarnData, setYarnData] = useState([]);
    const [needleData, setNeedleData] = useState([]);
    const [recipesData, setRecipesData] = useState([]);
    const [subscribers, setSubscribers] = useState([]);
    const [handledMessages, setHandledMessages] = useState([]);

    const usersToken = sessionStorage.getItem('token');


    // Fetch data from various APIs to populate the dashboard with updated information.
    useEffect(() => {
        const fetchData = async (userToken) => {
            try {
                const fetchOptions = { headers: { 'Accept': 'application/json' } };

                const usersResponse = await fetch(`${API_BASE_URL}/getUsers?userToken=` + userToken, fetchOptions);
                setUsersData(await usersResponse.json());

                const activeMessagesResponse = await fetch(`${API_BASE_URL}/api/Contact?isActive=true&isHandled=false&userToken=` + userToken, fetchOptions);
                setActiveMessages(await activeMessagesResponse.json());

                const inactiveMessagesResponse = await fetch(`${API_BASE_URL}/api/Contact?isActive=false&isHandled=false&userToken=` + userToken, fetchOptions);
                setInactiveMessages(await inactiveMessagesResponse.json());

                const handledMessagesResponse = await fetch(`${API_BASE_URL}/api/Contact?isActive=false&isHandled=true&userToken=` + userToken, fetchOptions);
                setHandledMessages(await handledMessagesResponse.json());

                const recipesResponse = await fetch(`${API_BASE_URL}/api/recipe/getallrecipes?userToken=${usersToken}`, fetchOptions);
                setRecipesData(await recipesResponse.json());

                const inventoryResponse = await fetch(`${API_BASE_URL}/api/inventory/getAll?userToken=${usersToken}`, fetchOptions);
                const inventoryData = await inventoryResponse.json();
                setYarnData(inventoryData.yarnInventory);
                setNeedleData(inventoryData.needleInventory);

                setSubscribers(await fetchSubscribers());
            } catch (error) {
                console.error('Error fetching dashboard data:', error);
            }
        };

        fetchData(usersToken);
    }, [usersToken]);

    // Desides if you want a image or a chart. We only want charts if there are something to display on the cart 
    const isValidStatistic = (stat) => stat.value > 0 && !isNaN(stat.value);

    const renderContent = (stats, label, altImage) => {
        return stats.length > 0 && isValidStatistic(stats[0]) ?
            <StatisticsChart label={label} userStats={stats} /> :
            <img src={getImageByName(altImage)} alt="No Data" />;
    };

    
    // User info that is sendt into the card (do not want to count users with admin status)
    const userStats = [
        { label: "Total number of users", value: usersData.length },
        { label: "Banned users", value: usersData.filter(user => user.status === 'banned').length },
        { label: "Unverified users", value: usersData.filter(user => user.status === 'unverified' && !user.isAdmin).length },
        { label: "Verified users", value: usersData.filter(user => user.status === 'verified' && !user.isAdmin).length },
        { label: "Admins", value: usersData.filter(user => user.isAdmin).length },
    ];

    
    // To avoid getting NaN if one or more are note defined
    const activeMessagesLength = activeMessages.length || 0;
    const inactiveMessagesLength = inactiveMessages.length || 0;
    const handledMessagesLength = handledMessages.length || 0;
    
    // Message info that is sendt into the card
    const totalMessages = activeMessagesLength + inactiveMessagesLength + handledMessagesLength;
    const Messages = [
        { label: "Total Messages", value: totalMessages },
        { label: "Active", value: activeMessagesLength},
        { label: "Inactive", value: inactiveMessagesLength},
        { label: "Handled Messages", value: handledMessagesLength },
    ];

    // Needle info that is sendt into the card
    const Needles = [
        { label: "Total Needles", value: needleData.length },
        { label: "Interchangeable", value: needleData.filter(needle => needle.type === 'Interchangeable').length },
        { label: "DoublePointed", value: needleData.filter(needle => needle.type === 'DoublePointed').length },
        { label: "Circular", value: needleData.filter(needle => needle.type === 'Circular').length },
        { label: "Other", value: needleData.filter(needle => !['Interchangeable', 'DoublePointed', 'Circular'].includes(needle.type)).length }
    ];

    // Yarn info that is sendt into the card
    const Yarn = [
        { label: "Total Yarn cards", value: yarnData.length },
    ];

    // Recipe info that is sendt into the card
    const Recipes = [
        { label: "Total Recipes", value: recipesData.length },
    ];

    // Newsletter info that is sendt into the card
    const Newsletter = [
        { label: "Newsletter Subscribers", value: subscribers.length },
    ];


    return (
        <div>
            <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "space-between" }}>
                {/* Generate alle the card for the admin view  */}
                <GeneralCard
                    title={`User Statistics: ${usersData.length} users`}
                    stats={userStats}
                    onClick={() => toggleView('users')}
                    hovermessage="Click to view user statistics"
                    chartComponent={<StatisticsChart lable={"User Statistics"} userStats={userStats} />}
                />

                <GeneralCard
                    title={`Newsletter: ${subscribers.length} subscribers`}
                    stats={Newsletter}
                    hovermessage="Click to view newsletter subscribers"
                    chartComponent={renderContent(0, "Newsletter Statistics", "pileOfSweaters")}
                    onClick={() => toggleView('newsletter')}
                />

                <GeneralCard
                    title={`Message: ${totalMessages} Message`}
                    stats={Messages}
                    hovermessage="Click to view message statistics"
                    chartComponent={renderContent(Messages, "Message Statistics", "reading")}
                    onClick={() => toggleView('messages')}
                />

                <GeneralCard
                    title={`Yarn: ${yarnData.length}`}
                    stats={Yarn}
                    chartComponent={renderContent(0, "Yarn Statistics", "yarnSheep")}
                />

                <GeneralCard
                    title={`Needle: ${needleData.length} `}
                    stats={Needles}
                    chartComponent={renderContent(Needles, "Needle Statistics", "yarnBasket")}
                />

                <GeneralCard
                    title="Recipes Statistics"
                    stats={Recipes}
                    chartComponent={renderContent(0, "Recipes Statistics", "books")}
                />

            </div>
        </div>
    );
};


export default Dashboard; 