import React, { useState, useEffect } from "react";
import "../GlobalStyles/main.css";
import "./Counter.css";
import { CustomButton } from '../Components/Button';
import SetAlert from "../Components/Alert";
import InputField from "../Components/InputField";


export const Counter = () => {
    // Store an array of counter objects
    const [counters, setCounters] = useState([]);
    // Control the visibility of the add counter modal.
    const [isAddModalOpen, setIsAddModalOpen] = useState(false); 
    // Control the visibility of the edit counter modal
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    // Storing the name of a new counter being added
    const [counterName, setCounterName] = useState('');
    // Keep track of the index of the counter being edited
    const [editIndex, setEditIndex] = useState(null);
    // Storing the updated name of the counter being edited
    const [editCounterName, setEditCounterName] = useState('');
    const [alertInfo, setAlertInfo] = useState({open: false, severity: 'info', message: 'test message'});
    const token = sessionStorage.getItem('token');
    const [counterData, setCounterData] = useState({
        userToken: token,
        name: ''
    });

    // Function to update counter details state
    const handleChange = (prop) => (event) => {
        setCounterData({ ...counterData, [prop]: event.target.value});
    };

    // Function to increment the value of a counter
    const handleIncrement = (index) => {
        const newCounters = counters.map((counter, i) => 
            i === index ? { ...counter, value: counter.value + 1 } : counter
        );
        setCounters(newCounters);
    };

    // Function to decrement the value of a counter but not below 0
    const handleDecrement = (index) => {
        const newCounters = counters.map((counter, i) => 
            i === index ? { ...counter, value: Math.max(counter.value - 1, 0) } : counter
        );
        setCounters(newCounters);
    };

    // Function to open the edit modal and set up for editing a counter
    const handleEdit = (index) => {
        setEditIndex(index);
        setEditCounterName(counters[index].name);
        setIsEditModalOpen(true);
    };
      
    // Function to handle the submission of an edited counter name
    const handleEditSubmit = (e) => {
        e.preventDefault();
        const updatedCounters = counters.map((counter, i) =>
          i === editIndex ? { ...counter, name: editCounterName } : counter
        );
        setCounters(updatedCounters);
        // Reset edit state
        setEditIndex(null);
        setEditCounterName('');
        setIsEditModalOpen(false);
    };

    const handleDeleteCounter = async (CounterId) => {
        const url = `http://localhost:5002/api/counter/deletecounter`;
        const payload = {
            UserToken: sessionStorage.getItem('token'),
            counterId: CounterId
        };
        try {
            const response = await fetch(url, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': '*/*'
                },
                body: JSON.stringify(payload)
            });
            if (response.ok) {
                setCounters(currentCounter => currentCounter.filter(counter => counter.counterId !== CounterId));
                closeEditModal();
            } else {
                console.error("Failed to delete the counter", await response.text());
            }
        } catch (error) {
            console.error("Error deleting counter:", error);
        }
    };

    // Handle submission for adding new counters
    const handleSubmit = async (event) => {
        event.preventDefault();

        // if (!counterData.name) {
        //     setAlertInfo({
        //         open: true,
        //         severity: 'error',
        //         message: 'Please fill in all fields.'
        //     });
        //     return;
        // }

        const payload = {
            userToken: counterData.userToken,
            name: counterData.name
        };
        console.log('hei', payload);


        const response = await fetch('http://localhost:5002/api/counter/createcounter', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'accept': '*/*'
            },
            body: JSON.stringify(payload)
        });

        // Clone the response for debugging
        const clone = response.clone();
        // Read the clone for logging
        const responseText = await clone.text();
        console.log('Response status:', response.status);
        console.log('Response body:', responseText);

        if (response.ok) {
            const result = await response.json();
            console.log('Success:', result);
            setIsAddModalOpen(false);
            fetchCounter(); // Make sure this function is called to update the UI
        } else {
            const errorText = await response.text(); // Use text() to avoid JSON parsing errors
            console.error('Error response:', errorText);
            setAlertInfo({
                open: true,
                severity: 'error',
                message: 'An unexpected error occurred'
            });
        }
        console.log(payload);
    };

    const fetchCounter = async () => {
        const token = sessionStorage.getItem('token');
        const url = `http://localhost:5002/api/counter/getcounters?userToken=${token}`;
        try {
            const response = await fetch(url);
            if (response.ok) {
                const data = await response.json();
                if (data && Array.isArray(data.counterInventory)) {  // Check if data.counterInventory is an array
                    setCounters(data.counterInventory);
                    console.log(data.counterInventory);
                } else {
                    setCounters([]);  // Ensure that counters is always an array
                    console.warn("Received non-array data:", data);
                }
            } else {
                setCounters([]);  // Set counters to empty array if response is not OK
                console.error("Failed to fetch counter data with status:", response.status);
                const errorText = await response.text();
                console.error("Error response body:", errorText);
            }
        } catch (error) {
            setCounters([]);  // Set counters to empty array in case of error
            console.error("Error fetching data:", error);
        }
    };

    // Function to remove a counter
    const handleRemoveCounter = () => {
        setCounters(counters.filter((_, i) => i !== editIndex));
        // Reset edit state
        setEditIndex(null);
        setEditCounterName('');
        setIsEditModalOpen(false);
    };  
    
    // Function to cancel the edit operation
    const handleCancelEdit = () => {
        // Reset edit state
        setEditIndex(null);
        setEditCounterName('');
        setIsEditModalOpen(false);
    };

    // // Function to handle the submission of a new counter
    // const handleSubmit = (e) => {
    //     e.preventDefault();
    //     setCounters([...counters, { name: counterName, value: 0 }]);
    //     // Reset add counter state
    //     setCounterName('');
    //     setIsAddModalOpen(false);
    // };

    useEffect(() => {
        fetchCounter();
    }, []);

    // Counter component to display each counter with its controls
    const Counters = ({ index, name, value }) => {
        return (
            <div className="counter-container">
            <div className="counter-info" style={{fontSize: '1.2rem'}}>{name}</div>
            <div className="counter-info">{counterData.name}</div>
            <div className="counter-controls">
                <button className= "light-button" onClick={() => handleDecrement(index)}>-</button>
                <button className= "light-button" onClick={() => handleIncrement(index)}>+</button>
            </div>
            <span className="edit-text" onClick={() => handleEdit(index)}>Edit</span>
            </div>
        );
    };

    return (
        <div className="page-container">
            <div className="boxes-container">
                <div className="add-counter-box" onClick={() => setIsAddModalOpen(true)}>
                <span>Counter</span>
                <span>+</span>
                </div>
                {/* Modal for adding a new counter */}
                {isAddModalOpen && (
                    <div className="pop">
                        <div className="pop-content">
                            <form onSubmit={handleSubmit}>
                                <InputField
                                    label="Name"
                                    type="text"
                                    value={counterData.name}
                                    onChange={handleChange('name')}
                                    />
                                <div className="counter-controls">    
                                    <button className= "light-button" type="submit" >Add</button>
                                    <button className= "light-button" type="button" onClick={() => setIsAddModalOpen(false)}>Cancel</button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}
                {/* Modal for editing an existing counter */}
                {isEditModalOpen && editIndex !== null && (
                    <div className="pop">
                    <div className="pop-content">
                        <form onSubmit={handleEditSubmit}>
                            <InputField
                                type="text"
                                label="Edit Name"
                                value={editCounterName}
                                onChange={(e) => setEditCounterName(e.target.value)}
                                />
                            <div className="counter-controls"> 
                                <button className= "light-button" type="submit">Update</button>
                                <button className= "light-button" type="button" onClick={() => handleCancelEdit(false)}>Cancel</button>
                                <button className= "light-button" type="button" onClick={handleDeleteCounter}>Delete Counter</button>
                            </div>
                        </form>
                    </div>
                </div>
                )}
                {/* Mapping through the counters array to display each Counter component */}
                {counters.map((counter, index) => (
                    <Counters
                    key={index}
                    index={index}
                    name={counterData.name}
                    value={counter.value}
                    />
                ))}
                <SetAlert
                    open={alertInfo.open} 
                    setOpen={(isOpen) => setAlertInfo({...alertInfo, open: isOpen})} 
                    severity={alertInfo.severity} 
                    message={alertInfo.message} />
            </div>   
        </div>
    );
};

export default Counter;