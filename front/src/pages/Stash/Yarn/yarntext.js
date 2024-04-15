import React, {useState} from 'react';
import "../../GlobalStyles/main.css";
import "../Counter.css";
import CustomButton from '../../Components/Button';

const TextYarn = ({open, handleClose, addYarnEntry}) => {
    const [yarnDetails, setYarnDetails] = useState({
        brand: '',
        type: '',
        weight: '',
        length: '',
        content: '',
        knittingTension: '',
        color: '',
        batchNumber: '',
        weightUsed: '',
        notes: ''
    });

    // Function to update yarn details state
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setYarnDetails(prev => ({...prev, [name]: value}));
    };

    
    const handleSubmit = (e) => {
        e.preventDefault();
        addYarnEntry(yarnDetails);
        setYarnDetails({
            brand: '', type: '', weight: '', length: '', content: '', 
            knittingTension: '', color: '', batchNumber: '', weightUsed: '', notes: ''
        });
        handleClose();
    };

    if (!open) return null;

    return (
        <div className="pop">
            <div className="pop-content" style={{height: '80%', width: '50%'}}>
                <h2> Add Yarn </h2>
                <form onSubmit={handleSubmit} className="yarn-form" style={{display: 'flex', flexDirection: 'column'}}>
                    {Object.keys(yarnDetails).map((key) => {
                        if (key === 'weight' || key === 'weightUsed' || key === 'notes') {
                            return null;
                        }
                        return (
                            <div key={key} className="input-wrapper" style={{marginBottom: '5px'}}>
                                <input
                                    type="text"
                                    name={key}
                                    className="yarn-input"
                                    style={{width: '80%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc'}}
                                    placeholder={key.charAt(0).toUpperCase() + key.slice(1).replaceAll(/([A-Z])/g, ' $1').trim()}
                                    value={yarnDetails[key]}
                                    onChange={handleInputChange}
                                />
                            </div>
                        );
                    })}
                    <div className="input-row" style={{ display: 'flex', justifyContent: 'space-between', width: '80%', margin: '0 auto' }}>
                        <div className="input-wrapper" style={{ width: 'calc(50% - 5px)', marginRight: '5px' }}>
                            <input
                                type="text"
                                name="weight"
                                className="yarn-input" style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
                                placeholder="Weight"
                                value={yarnDetails.weight}
                                onChange={handleInputChange}
                            />
                        </div>
                        <div className="input-wrapper" style={{ width: 'calc(50% - 5px)' }}>
                            <input
                                type="text"
                                name="weightUsed"
                                className="yarn-input" style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
                                placeholder="Weight Used"
                                value={yarnDetails.weightUsed}
                                onChange={handleInputChange}
                            />
                        </div>
                    </div>
                    <div className="input-wrapper" style={{marginBottom: '5px'}}>
                        <input
                            type="text"
                            name="notes"
                            className="yarn-input"
                            style={{width: '80%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc'}}
                            placeholder="Notes"
                            value={yarnDetails.notes}
                            onChange={handleInputChange}
                        />
                    </div>
                <div className="counter-controls">
                    <button className="dark" type="submit">Add</button>
                    <button className="dark" onClick={handleClose}>Cancel</button>
                </div>
                </form>
            </div>
        </div>
    )
}

export default TextYarn;
