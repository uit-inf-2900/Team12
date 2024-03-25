import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import validator from 'validator'; 
import axios from 'axios';

import "../../GlobalStyles/main.css";
import ViewMessages from './Messages/ViewMessages';
import ViewUsers from './ViewUsers';


const AdminPage = () => {
    const [showMessages, setShowMessages] = useState(false);
    const [showUsers, setShowUsers] = useState(false);


    return(
        <div className="page-container">
            <h1>Admin Page</h1>
            <button className='light-button' onClick={() => setShowUsers(!showUsers)}>
                {showUsers ? 'Hide users': 'Show users'}
            </button>
            {showUsers && <ViewUsers />}


            <button className='light-button' onClick={() => setShowMessages(!showMessages)}>
                {showMessages ? 'Hide messages': 'Show messages'}
            </button>
            {showMessages && <ViewMessages />}
        </div>
    );

};

export default AdminPage;