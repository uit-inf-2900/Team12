import { useState } from "react";

// Define the useCounterStash hook
export const useCounterStash = (fetchCounter, setAlertInfo) => {
    const token = sessionStorage.getItem('token');
    const [counterData, setCounterData] = useState({
        userToken: token,
        name: '',
        roundNumber: 0
    });

    // Function to handle changes in form inputs, updating state accordingly
    const handleChange = (prop) => (event) => {
        setCounterData({ ...counterData, [prop]: event.target.value });
    };

    // Function to handle form submission
    const handleSubmit = async (event, setIsAddModalOpen) => {
        event.preventDefault();

        const payload = {
            userToken: counterData.userToken,
            name: counterData.name,
            roundNumber: counterData.roundNumber
        };

        // Send a POST request to the server with the counter data
        const response = await fetch('http://localhost:5002/api/counter/createcounter', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify(payload)
        });

        if (response.ok) {
            await response.json();
            // Close the modal
            setIsAddModalOpen(false);
            // Update counter
            fetchCounter();
        } else {
            const errorText = await response.text();
            setAlertInfo({
                open: true,
                severity: 'error',
                message: `An unexpected error occurred: ${errorText}`
            });
        }
    };

    return {
        counterData,
        handleChange,
        handleSubmit
    };
};
