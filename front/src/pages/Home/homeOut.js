import React, { useState, useEffect } from 'react';
import "../../GlobalStyles/main.css";
import axios from 'axios';
import StatisticBox from './StatisticBox'; // Sjekk at stien stemmer
import { useNavigate } from 'react-router-dom';
import InstagramFeed from '../../Components/UI/InstagramFeed'; 
import Hero from './landingPage/hero';



export const HomeOut = () => {

    



    return (
        <div className='page-container'>

        <Hero></Hero>
        <h2  style={{padding: '20px', paddingTop:'30px'}}>Here are some inspiration from Instagram </h2>
            
            {/* <InstagramFeed accessToken={accessTokenInsta} /> */}


        </div>
    );
};