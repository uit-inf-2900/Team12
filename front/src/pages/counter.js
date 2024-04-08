import React, { useState } from "react";
import "../GlobalStyles/main.css";
import "./Counter.css";
import CustomButton from '../Components/Button';

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

    // Function to handle the submission of a new counter
    const handleSubmit = (e) => {
        e.preventDefault();
        setCounters([...counters, { name: counterName, value: 0 }]);
        // Reset add counter state
        setCounterName('');
        setIsAddModalOpen(false);
    };

    // Counter component to display each counter with its controls
    const Counters = ({ index, name, value }) => {
        return (
            <div className="counter-container">
            <div className="counter-info" style={{fontSize: '1.2rem'}}>{name}</div>
            <div className="counter-info">{value}</div>
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
                                <input
                                    type="text"
                                    placeholder="Name"
                                    value={counterName}
                                    onChange={(e) => setCounterName(e.target.value)}
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
                            <input
                                type="text"
                                placeholder="Edit Name"
                                value={editCounterName}
                                onChange={(e) => setEditCounterName(e.target.value)}
                                />
                            <div className="counter-controls"> 
                                <button className= "light-button" type="submit">Update</button>
                                <button className= "light-button" type="button" onClick={() => handleCancelEdit(false)}>Cancel</button>
                                <button className= "light-button" type="button" onClick={handleRemoveCounter}>Delete Counter</button>
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
                    name={counter.name}
                    value={counter.value}
                    />
                    ))}
            </div>   
        </div>
    );
};

export default Counter;