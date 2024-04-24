import React from 'react';
import "../../../GlobalStyles/main.css";

const getCustomLabel = (propName) => {
    const labels = {
        TotalUsers: 'Total Users',
        UnverifiedUsers: 'Unverified Users',
        VerifiedUsers: 'Verified Users',
        BannedUsers: 'Banned Users',
        TotalMessaes: 'Total Messages',
        UnreadMessages: 'Unread Messages',
        NumYarns: 'Number of Yarns',
        NumProjects: 'Number of Projects',
        NumActiveProjects: 'Number of Active Projects',
        NumFinishedProjects: 'Number of Finished Projects',
        NumRecipies: 'Number of Recipies',
        // Add more labels here
    };

    // Return lable
    return labels[propName] || propName;
};

  


const DarshbordCard = ({ title, value, onClick }) => {
    return (
        <div className="card" onClick={onClick}>
            <h2>{title}</h2>
            <p>{value}</p>
        </div>
    );
};

export default DarshbordCard;