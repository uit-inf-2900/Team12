import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import validator from 'validator'; 
import axios from 'axios';

import InputField from "../../Components/InputField";
import "../../GlobalStyles/main.css";


const ViewUsers = () => {

    return(
        <div className="page-container">
            <h1>All users</h1>
        </div>
    );

};

export default ViewUsers;