import React, { useState, Component } from 'react';
import { Modal } from "react-bootstrap";
import "../GlobalStyles/Card.css";

const ProjectCard = ({ title, status }) => {

    const [toggle, setToggle]=useState(false);
    

    

    return (
        <div className="card">
            <h3>{title}</h3>


            <div
            onClick={() => {
                setToggle(prev => {
                  return !prev;
                });
              }}
            >
                testing

            </div>
        </div>
    );
};

export default ProjectCard;
