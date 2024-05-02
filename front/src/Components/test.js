import React, { useState } from 'react';
import InputField from './InputField';
import CustomButton from './Button';
import "../GlobalStyles/main.css";

const trialCard =({onClose})=>{


    return(

        <div className="box dark">
            <h3>Hei,</h3>
            <p>Her kan du laste opp nytt prosjekt</p>

            <CustomButton themeMode="light" submit={true}>Add project</CustomButton>
            <button onClick={onClose}>close</button>
        </div>

    );
}


export default trialCard;