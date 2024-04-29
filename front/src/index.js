import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement
} from 'chart.js';

ChartJS.register(
  ArcElement, // Required for Doughnut
  Tooltip,    // Enables tooltips
  Legend,     // Enables legends
  CategoryScale,  // Required for Bar charts
  LinearScale,    // Required for Bar charts
  BarElement      // Required for Bar charts
);


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
