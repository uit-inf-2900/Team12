import { useState } from "react";

export const useCounterStash = (fetchCounter, setAlertInfo) => {
    const token = sessionStorage.getItem('token');
    const [counterData, setCounterData] = useState({
        userToken: token,
        name: '',
        roundNumber: 0
    });

    const handleChange = (prop) => (event) => {
        setCounterData({ ...counterData, [prop]: event.target.value });
    };

    const handleSubmit = async (event, setIsAddModalOpen) => {
        event.preventDefault();

        const payload = {
            userToken: counterData.userToken,
            name: counterData.name,
            roundNumber: counterData.roundNumber
        };

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
            setIsAddModalOpen(false);
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
