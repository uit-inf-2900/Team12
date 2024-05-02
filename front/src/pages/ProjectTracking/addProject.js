import React, { useState, useRef } from 'react';
import InputField from '../../Components/InputField';
import CustomButton from '../../Components/Button';
import axios from 'axios';


const UploadProjects = ({ onClose }) => {

  const token = sessionStorage.getItem('token');






  return (
    <div className="box dark">
            <h3>Hei,</h3>
            <p>Start et nytt prosjekt her!</p>

    </div>
    );
};

export default UploadProjects;
