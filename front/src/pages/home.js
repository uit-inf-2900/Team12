import React from "react";
import "../GlobalStyles/main.css";

import ProjectCard from "../Components/ProjectCard";
import Card from "../Components/Card";

import PDF from "../Components/PDFviewer";


export const Home = () => {

  
  return (
    <div className="page-container">
      <h1>Home </h1> 
      <div>
        <PDF></PDF>
      
      </div>
      
    </div>
  );
};
