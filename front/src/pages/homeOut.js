import React, { useState, useEffect } from 'react';
import "../GlobalStyles/main.css";
import axios from 'axios';
import StatisticBox from './StatisticBox'; // Sjekk at stien stemmer
import { useNavigate } from 'react-router-dom';
import InstagramFeed from './KnitHubResources/InstagramFeed'; 
import Hero from './landingpage/hero';
import AboutLanding from './landingpage/aboutUs';
import Inspiration from './landingpage/inspiration';
// access to instagram
const accessTokenInsta = 'IGQWRNYjdRX3BnVHFmdVR0Qm5yR3RDWml0TTgwc3lhV1VRZAmw5U3I2eWZAkUTRKekRzOS1JWEt5REEzZA3JHX0dDSXVfdVpodWlHRXFLbngwdEtSVXhuaXdtYmRSY0dGSzhvR1NVQkhnMmlJSE5JNHFmMFJCMS1IdjAZD';
  


export const HomeOut = () => {

    



    return (
        <div>

            
            <Hero></Hero>
            <AboutLanding></AboutLanding>
            <Inspiration></Inspiration>
            <InstagramFeed accessToken={accessTokenInsta} />


        </div>
    );
};