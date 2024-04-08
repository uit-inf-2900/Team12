import React from 'react';
import './home.css';
import StatisticBox from './StatisticBox'; // Sjekk at stien stemmer



export const Home = () => {
  return (
    <div className="page-container">
      {/* custom-box fra okefellekalkulator.css */}
      <div className="custom-box">
        {/* legge til å hente navn fra databasen - Full name */}
        <h2>God dag Sera Madeleine</h2>
        <h4>Her har du oversikt over ditt arbeid sålangt:</h4>
        <div className="statistics-container">
          {/* Rad 1 */}
          <StatisticBox label="nøster brukt" value="15" />
          <StatisticBox label="nøster brukt" value="15" />
        </div>
        <div className="statistics-container">
          {/* Rad 2 */}
          <StatisticBox label="nøster brukt" value="15" />
          <StatisticBox label="nøster brukt" value="15" />
        </div>
        <div className="statistics-container">
          {/* Rad 3 */}
          <StatisticBox label="nøster brukt" value="15" />
          <StatisticBox label="nøster brukt" value="15" />
        </div>
      </div>      
      {/* Andre elementer */}
    </div>
  );
};