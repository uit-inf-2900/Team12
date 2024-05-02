import React, { useState, useEffect } from 'react';
import "../GlobalStyles/main.css";
import './home.css';
import axios from 'axios';
import StatisticBox from './StatisticBox'; // Sjekk at stien stemmer
import { useNavigate } from 'react-router-dom';

export const HomeOut = () => {
    return (
        <div className='page-container'/>
    );
};