import React, { useState } from 'react';
import InputField from '../../Components/InputField';
import CustomButton from '../../Components/Button';

import '../../GlobalStyles/main.css';
import "../../GlobalStyles/Card.css"

const TrialCard =({onClose}) => {

    return(

        <div className='box-container'>
            <div className="project-card">
                
                
                
                
                <button className='close-button' onClick={onClose}>close</button>
            </div>
        </div>
        

    );
};


export default TrialCard;
