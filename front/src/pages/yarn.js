import React, { useState } from "react";
import "../GlobalStyles/main.css";
import "./Counter.css";

export const Yarn = () => {
    // Store an array of counter objects
    const [yarns, setYarns] = useState([]);
    // Control the visibility of the add counter modal.
    const [isAddModalOpen, setIsAddModalOpen] = useState(false); 
    // Control the visibility of the edit counter modal
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    // Storing the name of a new counter being added
    const [yarnName, setYarnName] = useState('');
    // Keep track of the index of the counter being edited
    const [editIndex, setEditIndex] = useState(null);
    // Storing the updated name of the counter being edited
    const [editYarnName, setEditYarnName] = useState('');

    // Function to increment the value of a counter
    const handleIncrement = (index) => {
        const newYarns = yarns.map((yarn, i) => 
            i === index ? { ...yarn, value: yarn.value + 1 } : yarn
        );
        setYarns(newYarns);
    };

    // Function to decrement the value of a counter but not below 0
    const handleDecrement = (index) => {
        const newYarns = yarns.map((yarn, i) => 
            i === index ? { ...yarn, value: Math.max(yarn.value - 1, 0) } : yarn
        );
        setYarns(newYarns);
    };

    // Function to open the edit modal and set up for editing a counter
    const handleEdit = (index) => {
        setEditIndex(index);
        setEditYarnName(yarns[index].name);
        setIsEditModalOpen(true);
    };
      
    // Function to handle the submission of an edited counter name
    const handleEditSubmit = (e) => {
        e.preventDefault();
        const updatedYarns = yarns.map((yarn, i) =>
          i === editIndex ? { ...yarn, name: editYarnName } : yarn
        );
        setYarns(updatedYarns);
        // Reset edit state
        setEditIndex(null);
        setEditYarnName('');
        setIsEditModalOpen(false);
    };

    // Function to remove a counter
    const handleRemoveYarn = () => {
        setYarns(yarns.filter((_, i) => i !== editIndex));
        // Reset edit state
        setEditIndex(null);
        setEditYarnName('');
        setIsEditModalOpen(false);
    };  
    
    // Function to cancel the edit operation
    const handleCancelEdit = () => {
        // Reset edit state
        setEditIndex(null);
        setEditYarnName('');
        setIsEditModalOpen(false);
    };

    // Function to handle the submission of a new counter
    const handleSubmit = (e) => {
        e.preventDefault();
        setYarns([...yarns, { name: yarnName, value: 0 }]);
        // Reset add counter state
        setYarnName('');
        setIsAddModalOpen(false);
    };

    // Counter component to display each counter with its controls
    const Yarns = ({ index, name, value }) => {
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
                <div className="add-counter-box" style= {{borderRadius: '100px', backgroundColor: 'var(--link-color'}} onClick={() => setIsAddModalOpen(true)}>
                <span>Yarn</span>
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
                                    value={yarnName}
                                    onChange={(e) => setYarnName(e.target.value)}
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
                                value={editYarnName}
                                onChange={(e) => setEditYarnName(e.target.value)}
                                />
                            <div className="counter-controls"> 
                                <button className= "light-button" type="submit">Update</button>
                                <button className= "light-button" type="button" onClick={() => handleCancelEdit(false)}>Cancel</button>
                                <button className= "light-button" type="button" onClick={handleRemoveYarn}>Delete Yarn</button>
                            </div>
                        </form>
                    </div>
                </div>
                )}

                {/* Mapping through the counters array to display each Counter component */}
                {yarns.map((yarn, index) => (
                    <Yarns
                    key={index}
                    index={index}
                    name={yarn.name}
                    value={yarn.value}
                    />
                    ))}
            </div>   
        </div>
    );
};

export default Yarn;