import React from 'react';
import { Doughnut, Bar, Pie } from 'react-chartjs-2';
import 'chartjs-plugin-datalabels';
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
  


/**
 * Component for creating a statistics chart.
 * @param {Object} props - The component props.
 * @param {string} props.label - The label for the chart.
 * @param {Array<Object>} props.userStats - An array of user statistics objects.
 * @param {string} props.chartType - The type of chart to render ('bar', 'pie', 'doughnut').
 * @returns {JSX.Element} The statistics chart component.
 */
const StatisticsChart = ({ label, userStats, chartType }) => {
    // Prepare chart data, excluding the first statistic
    const userChartData = {
        labels: userStats.map(stat => stat.label).slice(1), // Exclude the first label
        datasets: [{
            label: label,
            data: userStats.map(stat => stat.value).slice(1), // Exclude the first data point
            backgroundColor: ['#875340', '#ebb897', '#953237', '#caaca7', '#d66e25'],
        }]
    };

    // Additional options for Chart.js to include datalabels
    const options = {
        plugins: {
            datalabels: {
                color: '#fff',
                formatter: (value, context) => {
                    // Show the value in each data point
                    return value;
                }
            }
        }
    };

    // Render the appropriate chart based on chartType
    switch (chartType) {
        case 'bar':
            return <Bar data={userChartData} options={options} />;
        case 'pie':
            return <Pie data={userChartData} options={options} />;
        case 'doughnut':
        default:
            return <Doughnut data={userChartData} options={options} />;
    }
};

export default StatisticsChart;
