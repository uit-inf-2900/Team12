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

    const fetchCounter = async () => {
        const token = sessionStorage.getItem('token');
        const url = `http://localhost:5002/api/counter/getcounters?userToken=${token}`;
        try {
            const response = await fetch(url);
            if (response.ok) {
                const data = await response.json();
                setCounters(data || []);
                console.log("Fetched counters:", data);
            } else {
                setCounters([]);
                const errorText = await response.text();
                console.error("Failed to fetch counter data with status:", response.status, "and error:", errorText);
            }
        } catch (error) {
            setCounters([]);
            console.error("Error fetching data:", error);
        }
    };

    const handleSaveUpdatedCounter = async (event) => {
        event.preventDefault(); // Prevent the default form submission
    
        const url = `http://localhost:5002/api/counter/updatecounter`;
        const payload = {
            userToken: sessionStorage.getItem('token'),
            ...currentCounter
        };
        try {
            const response = await fetch(url, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(payload)
            });
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

    const handleIncrement = async (id) => {
        const token = sessionStorage.getItem('token');
        const url = `http://localhost:5002/api/counter/updatecounter`;
        const payload = {
            userToken: token,
            ...currentCounter
        };
        try {
            const response = await fetch(url, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify(payload),
            });
            if (response.ok) {
                const data = await response.json();
                setCounters(currentCounters => currentCounters.map(counter => 
                    counter.counterId === id ? { ...counter, roundNumber: data.newRoundNumber } : counter
                ));
            } else {
                console.error("Failed to increment the counter", await response.text());
            }
        } catch (error) {
            console.error("Error incrementing counter:", error);
        }
    };
    
    const handleDecrement = async (id) => {
        const token = sessionStorage.getItem('token');
        const url = `http://localhost:5002/api/counter/updatecounter`;
        const payload = {
            userToken: token,
            ...currentCounter
        };
        try {
            const response = await fetch(url, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify(payload),
            });
            if (response.ok) {
                const data = await response.json();
                // setCounters(currentCounters => currentCounters.map(counter => {
                //     if (counter.counterId === id){

                //         const newValue = {counter.roundNumber !== undefined ?  counter.roundNumber : 0} + 1;
                //         return{...counter, roundNumber: newValue};
                //     };
                //     return counter;
                // }
                // ));
            } else {
                console.error("Failed to decrement the counter", await response.text());
            }
        } catch (error) {
            console.error("Error decrementing counter:", error);
        }
    };
    

    const handleEdit = (counter) => {
        setCurrentCounter({ ...counter, newName: counter.name });
        setIsEditModalOpen(true);
    };

    const handleDeleteCounter = async (id) => {
        const token = sessionStorage.getItem('token');
        const url = `http://localhost:5002/api/counter/deletecounter`;
        const payload = {
            UserToken: token,
            counterId: id
        };
        try {
            const response = await fetch(url, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify(payload)
            });
            if (response.ok) {
                setCounters(currentCounter => currentCounter.filter(counter => counter.counterId !== id));
                setIsEditModalOpen(false);
            } else {
                console.error("Failed to delete the counter", await response.text());
            }
        } catch (error) {
            console.error("Error deleting counter:", error);
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
                <div className="add-counter-box" onClick={() => setIsAddModalOpen(true)}>
                    <span>Counter</span>
                    <span>+</span>
                </div>
                {isAddModalOpen && (
                    <div className="pop">
                        <div className="pop-content">
                            <form onSubmit={(event) => handleSubmit(event, setIsAddModalOpen)}>
                                <InputField
                                    label="Name"
                                    type="text"
                                    value={counterData.name}
                                    onChange={handleChange('name')}
                                />
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
                                <InputField
                                    label="Edit Name"
                                    type="text"
                                    value={currentCounter.newName || ''}
                                    onChange={handleInputChange('newName')}
                                />
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
                    <CounterItem
                        key={counter.counterId}
                        counter={counter}
                        onEdit={handleEdit}
                        onIncrement={handleIncrement}
                        onDecrement={handleDecrement}
                    />
                ))}
                <SetAlert
                    open={alertInfo.open} 
                    setOpen={(isOpen) => setAlertInfo({ ...alertInfo, open: isOpen })} 
                    severity={alertInfo.severity} 
                    message={alertInfo.message} 
                />
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
