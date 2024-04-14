import React from "react";
import "../GlobalStyles/main.css";
import KnittingTermsTable from "./KnittingTermsTable"; 


export const Home = () => {
  return (
    <div className="page-container">
      <h1>Home </h1>      
      {/* Rest of the content */}
      <KnittingTermsTable/> 
    </div>
  );
};
