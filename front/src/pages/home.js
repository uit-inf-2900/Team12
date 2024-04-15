import React from "react";
import ReactDOM from 'react-dom';
import PDFview from "../Components/pdfViewer";
import PDF from "../Components/pdf1";
import "../GlobalStyles/main.css";



export const Home = () => {
  return (
    <div className="page-container">
      <h1>Home </h1>      
      {/* Rest of the content */}
      <div>
        <PDFview></PDFview>
      </div>
        
    </div>
    

  );
};
