import React, { useState, useEffect } from "react";
import "../GlobalStyles/main.css";
import "./Counter.css";
import SetAlert from "../Components/Alert";
import InputField from "../Components/InputField";
import { useCounterStash } from "./counterStash";

export const Counter = () => {
    const [counters, setCounters] = useState([]);
    const [currentCounter, setCurrentCounter] = useState({});
    const [isAddModalOpen, setIsAddModalOpen] = useState(false); 
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [alertInfo, setAlertInfo] = useState({ open: false, severity: 'info', message: 'test message' });
    const token = sessionStorage.getItem('token');

    // Fetch counter from backend
    const fetchCounter = async () => {
        const url = `http://localhost:5002/api/counter/getcounters?userToken=${token}`;
        try {
            const response = await fetch(url);
            if (response.ok) {
                const data = await response.json();
                setCounters(data || []);
            } else {
                const errorText = await response.text();
                console.error("Fetch error:", errorText);
                setCounters([]);
            }
        } catch (error) {
            console.error("Fetch error:", error);
            setCounters([]);
        }
    };

    // Handle updating a counter
    const handleSaveUpdatedCounter = async (event) => {
        event.preventDefault();
        const url = `http://localhost:5002/api/counter/updatecounter`;
        const payload = {userToken: token, ...currentCounter};
        try {
            const response = await fetch(url, {method: 'PATCH', headers: {'Content-Type': 'application/json'}, body: JSON.stringify(payload)});
            if (response.ok) {
                setCounters(currentCounters => currentCounters.map(counter => counter.counterId === currentCounter.counterId ? {...counter, ...currentCounter} : counter));
                // Close the modal after update
                setIsEditModalOpen(false);
                // Update the edited counter
                fetchCounter();
            } else {
                console.error("Failed to update the counter", await response.text());
            }
        } catch (error) {
            console.error("Error updating counter:", error);
        }
    };
    
    const { counterData, handleChange, handleSubmit } = useCounterStash(fetchCounter, setAlertInfo);

    // Handle incrementing the counter
    const handleIncrement = async (id) => {
        const url = `http://localhost:5002/api/counter/incrementcounter?userToken=${encodeURIComponent(token)}&counterId=${encodeURIComponent(id)}`;
        try {
            const response = await fetch(url, {method: 'PATCH'});
            if (response.ok) {
                setCounters(currentCounters => currentCounters.map(counter =>
                    counter.counterId === id ? { ...counter, roundNumber: counter.roundNumber + 1 } : counter
                ));
            } else {
                const errorText = await response.text();
                console.error("Increment failed", errorText);
            }
        } catch (error) {
            console.error("Increment failed:", error);
        }
    };
    
    // Handle decrement counter
    const handleDecrement = async (id) => {
        // Checking if the counter is greater than zero
        const currentCounter = counters.find(counter => counter.counterId === id);
        if (currentCounter && currentCounter.roundNumber > 0){
            const url = `http://localhost:5002/api/counter/decrementcounter?userToken=${encodeURIComponent(token)}&counterId=${encodeURIComponent(id)}`;
            try {
                const response = await fetch(url, {method: 'PATCH'});
                if (response.ok) {
                    console.log("Decrement successful");
                    setCounters(currentCounters => currentCounters.map(counter =>
                        counter.counterId === id ? { ...counter, roundNumber: counter.roundNumber - 1 } : counter
                    ));
                } else {
                    const errorText = await response.text();
                    console.error("Decrement failed", errorText);
                }
            } catch (error) {
                console.error("Decrement failed:", error);
            }
        // denna kan fjernes om det ikke er vits/ønskelig
        } else {
            alert("Counter cannot go below zero.");
        }
    };
    
    // Edit, delete and input change handler
    const handleEdit = (counter) => {
        setCurrentCounter({ ...counter, newName: counter.name });
        setIsEditModalOpen(true);
    };

    // Handle to delete counter
    const handleDeleteCounter = async (id) => {
        const url = `http://localhost:5002/api/counter/deletecounter`;
        const payload = {UserToken: token, counterId: id};
        try {
            const response = await fetch(url, {method: 'DELETE', headers: {'Content-Type': 'application/json', 'Authorization': `Bearer ${token}`}, body: JSON.stringify(payload)});
            if (response.ok) {
                setCounters(currentCounter => currentCounter.filter(counter => counter.counterId !== id));
                setIsEditModalOpen(false);
            } else {
                console.error("Delete failed", await response.text());
            }
        } catch (error) {
            console.error("Delete failed:", error);
        }
    };

    const handleInputChange = (prop) => (event) => {
        setCurrentCounter({ ...currentCounter, [prop]: event.target.value });
    };

    const handleCancelEdit = () => {
        setCurrentCounter({});
        setIsEditModalOpen(false);
    };

    useEffect(() => {
        fetchCounter();
    }, []);

    return (
        <div className="page-container">
            <div className="boxes-container">
                {/* Render counters, modals, and alert components */}
                <div className="add-counter-box" onClick={() => setIsAddModalOpen(true)}>
                    <span>Counter</span>
                    <span>+</span>
                </div>
                {isAddModalOpen && (
                    <div className="pop">
                        <div className="pop-content">
                            <form onSubmit={(event) => handleSubmit(event, setIsAddModalOpen)}>
                                <InputField label="Name" type="text" value={counterData.name} onChange={handleChange('name')}/>
                                <div className="counter-controls">    
                                    <button className="light-button" type="submit">Add</button>
                                    <button className="light-button" type="button" onClick={() => setIsAddModalOpen(false)}>Cancel</button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}
                {isEditModalOpen && (
                    <div className="pop">
                        <div className="pop-content">
                            <form onSubmit={handleSaveUpdatedCounter}>
                                <InputField label="Edit Name" type="text" value={currentCounter.newName || ''} onChange={handleInputChange('newName')}/>
                                <div className="counter-controls">
                                    <button className="light-button" type="submit">Update</button>
                                    <button className="light-button" type="button" onClick={(handleCancelEdit)}>Cancel</button>
                                    <button className="light-button" type="button" onClick={() => handleDeleteCounter(currentCounter.counterId)}>Delete Counter</button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}
                {counters.map(counter => (
                    <CounterItem key={counter.counterId} counter={counter} onEdit={handleEdit} onIncrement={handleIncrement} onDecrement={handleDecrement}/>
                ))}
                <SetAlert open={alertInfo.open} setOpen={(isOpen) => setAlertInfo({ ...alertInfo, open: isOpen })} severity={alertInfo.severity} message={alertInfo.message}/>
            </div>   
        </div>
    );
};
export default Counter;

const CounterItem = ({ counter, onEdit, onIncrement, onDecrement }) => {
    return (
        <div className="counter-container">
            <div className="counter-info" style={{ fontSize: '1.2rem' }}>{counter.name}</div>
            <div className="counter-info">{counter.roundNumber !== undefined ? counter.roundNumber : 0}</div>
            <div className="counter-controls">
                <button className="light-button" onClick={() => onDecrement(counter.counterId)}>-</button>
                <button className="light-button" onClick={() => onIncrement(counter.counterId)}>+</button>
            </div>
            <span className="edit-text" onClick={() => onEdit(counter)}>Edit</span>
        </div>
    );
};