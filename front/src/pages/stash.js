import React, { useState } from "react";
import "../GlobalStyles/main.css";
import "./Counter.css";

export const Stash = () => {
    const [counters, setCounters] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [counterName, setCounterName] = useState('');

    const handleIncrement = (index) => {
        const newCounters = counters.map((counter, i) => 
            i === index ? { ...counter, value: counter.value + 1 } : counter
        );
        setCounters(newCounters);
    };

    const handleDecrement = (index) => {
        const newCounters = counters.map((counter, i) => 
            i === index ? { ...counter, value: Math.max(counter.value - 1, 0) } : counter
        );
        setCounters(newCounters);
    };

    // const handleRemoveCounter = (index) => {
    //     setCounters(counters.filter((_, i) => i !== index));
    // };

    const handleSubmit = (e) => {
        e.preventDefault();
        setCounters([...counters, { name: counterName, value: 0 }]);
        setCounterName('');
        setIsModalOpen(false);
    };

    // Counter Sub-Component
    const Counter = ({ index, name, value }) => {
        return (
            <div className="counter-container">
                <div className="counter-name">{name}</div>
                <div className="counter-value">{value}</div>
                <div className="counter-controls">
                    <button className= "light-button" onClick={() => handleDecrement(index)}>-</button>
                    <button className= "light-button" onClick={() => handleIncrement(index)}>+</button>
                </div>
            </div>
        );
    };

    return (
        <div className="page-container">        
            <div className="add-counter-box" onClick={() => setIsModalOpen(true)}>
            <span>Counter</span>
            <span className="plus-sign">+</span>
            </div>

            {isModalOpen && (
                <div className="modal">
                    <div className="modal-content">
                        <form onSubmit={handleSubmit}>
                            <input
                                type="text"
                                placeholder="Navn"
                                value={counterName}
                                onChange={(e) => setCounterName(e.target.value)}
                            />
                            <button type="submit">Legg til</button>
                            <button type="button" onClick={() => setIsModalOpen(false)}>Avbryt</button>
                        </form>
                    </div>
                </div>
            )}

            {counters.map((counter, index) => (
                <Counter
                    key={index}
                    index={index}
                    name={counter.name}
                    value={counter.value}
                />
            ))}
        </div>
    );
};

export default Stash;