import React, {useState} from "react";
import "../../GlobalStyles/main.css";
import "../Counter.css";
import CustomButton from '../../Components/Button';
import Edit from './edit';

const YarnStash = ({ yarnEntries = [], onUpdate }) => {
    const [editIndex, setEditIndex] = useState(-1);
    const [editFormData, setEditFormData] = useState({});

    if (!yarnEntries || yarnEntries.length === 0) {
        // Return null or some placeholder if you want nothing to show when there are no entries
        return null; // or return <div>Add some yarn to see them here.</div>;
    }

    const handleEditClick = (index) => {
        setEditIndex(index);
        setEditFormData(yarnEntries[index]);
    };

    const handleSaveClick = (index) => {
        onUpdate(index, editFormData); // Call the onUpdate function passed from the parent component
        setEditIndex(-1); // Exit edit mode
    };

    const handleChange = (e, index) => {
        const { name, value } = e.target;
        setEditFormData(prev => ({ ...prev, [name]: value }));
    };

    return (
        <div className="box dark">
            {yarnEntries.map((entry, index) => (
                <div key={index}>
                    <div>Brand: {entry.brand}</div>
                    <div>Type: {entry.type}</div>
                    <div>Weight: {entry.weight}</div>
                    <div>Length: {entry.length}</div>
                    <div>Content: {entry.content}</div>
                    <div>Knitting Tension: {entry.knittingTension}</div>
                    <div>Color: {entry.color}</div>
                    <div>Batch Number: {entry.batchNumber}</div>
                    <div>Weight Used: {entry.weightUsed}</div>
                    <div>Notes: {entry.notes}</div>
                {/* ... Render yarn entry details ... */}
                {editIndex === index ? (
                    // Edit mode
                    <Edit
                    entry={editFormData}
                    onChange={(e) => handleChange(e, index)}
                    onSave={() => handleSaveClick(index)}
                    />
                ) : (
                    // View mode
                    <div>
                    {/* ... Display yarn entry details ... */}
                    <CustomButton themeMode="dark" onClick={() => handleEditClick(index)}>Edit</CustomButton>
                    </div>
                )}
                </div>
            ))}
        </div>
    );
};

export default YarnStash;

// return (
//     <div className="box dark">
//         {yarnEntries.map((entry, index) => (
//             <div key={index}>
//                 {/* Render each yarn entry details */}
//                 <div>Brand: {entry.brand}</div>
//                 <div>Type: {entry.type}</div>
//                 <div>Weight: {entry.weight}</div>
//                 <div>Length: {entry.length}</div>
//                 <div>Content: {entry.content}</div>
//                 <div>Knitting Tension: {entry.knittingTension}</div>
//                 <div>Color: {entry.color}</div>
//                 <div>Batch Number: {entry.batchNumber}</div>
//                 <div>Weight Used: {entry.weightUsed}</div>
//                 <div>Notes: {entry.notes}</div>
//                 {editIndex === index ? (
//                     // Edit mode
//                     <div className="pop">
//                         <div className="pop-content" style={{height: '80%', width: '50%', position: 'fixed', backgroundcolor: 'rgba(0, 0, 0, 0.5)'}}>
//                             <form onSubmit={handleChange}>
//                             <input type="text" name="brand" value={editFormData.brand} onChange={handleChange} />
//                             <input type="text" name="type" value={editFormData.type} onChange={handleChange} />
//                             <input type="text" name="weight" value={editFormData.type} onChange={handleChange} />
//                             <input type="text" name="length" value={editFormData.type} onChange={handleChange} />
//                             <input type="text" name="content" value={editFormData.type} onChange={handleChange} />
//                             <input type="text" name="knitting tension" value={editFormData.type} onChange={handleChange} />
//                             <input type="text" name="color" value={editFormData.type} onChange={handleChange} />
//                             <input type="text" name="batch number" value={editFormData.type} onChange={handleChange} />
//                             <input type="text" name="weight used" value={editFormData.type} onChange={handleChange} />
//                             <input type="text" name="notes" value={editFormData.type} onChange={handleChange} />
                            
//                             <CustomButton themeMode= "dark" onClick={() => handleSaveClick(index)}>Save</CustomButton>
//                             </form>
//                         </div>
//                     </div>
//                 ) : (
//                     // View mode
//                     <div>
//                         <CustomButton themeMode="dark" onClick={() => handleEditClick(index)}>Edit</CustomButton>
//                     </div>
//                 )}
//             </div>
//         ))}
//     </div>
// );