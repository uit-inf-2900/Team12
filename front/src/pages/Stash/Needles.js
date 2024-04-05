// src/Components/NeedlesComponent.js

import React, { useState, useMemo } from 'react'; 
import { Fab, Modal, Box } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import MultiSelect from '../../Components/MultiSelect';

export const NeedleStash= ({ setNeedleTypes, needleTypes }) => {
    
    const needleStash = [
        { id: 1, size: '10', length: '40 cm', quantity: 5, inUse: true, type: 'Replaceable' },
        { id: 2, size: '5', length: '20 cm', quantity: 8, inUse: false, type: 'Set' },
        { id: 3, size: '3', length: '15 cm', quantity: 12, inUse: true, type: 'Round' },
        { id: 5, size: '3', length: '1 cm', quantity: 2, inUse: false, type: 'Heklenål' },
        { id: 6, size: '3', length: '7 cm', quantity: 2, inUse: false, type: 'Flettepinne' },
    ];

    // Predefined types of needles for filtering. Only these types will be directly selectable.   
    const predefinedTypes = ['Replaceable', 'Set', 'Round'];

    // useMemo hook to memoize the needles options for the MultiSelect component, avoiding recalculation on every render.
    const NeedlesOptions = useMemo(() => {
        // Extract the types from the needle stash to create filter options
        const uniqueTypes = Array.from(new Set(needleStash.map(needle => needle.type)));

        // Set the unique types into an array of options for the MultiSelect. Includes 'Other' for non-predefined types.
        return uniqueTypes.reduce((acc, type) => {
            if (predefinedTypes.includes(type)) {
                acc.push({ value: type, name: `${type} needles` });             // Adds predefined types as options
            } else if (!acc.some(option => option.value === 'Other')) {
                acc.push({ value: 'Other', name: 'Other' });                    // Adds 'Other' option once for non-predefined types.
            }       
            return acc;
        }, [{ value: 'All', name: 'All needles' }]);                            // Adds 'All' option for all types.                
    }, [needleStash]);


    // Handler for changing needle type selection, updating the state with selected type(s).
    const handleNeedleTypeChange = (event) => {
        const { target: { value } } = event;
        setNeedleTypes(typeof value === 'string' ? value.split(',') : value);
    };


    // Filter the needle stash based on the selected needle types.
    const filteredNeedleStash = needleStash.filter(needle => {
        return needleTypes.includes('All') ||
            needleTypes.includes(needle.type) ||
            (needleTypes.includes('Other') && !predefinedTypes.includes(needle.type));
    });

    return (
        <>
            {/* Check if there are any needles to display. */}
            {needleStash.length > 0 ? (
                <>
                    <MultiSelect
                        label="Needle Type"
                        value={needleTypes}
                        handleChange={handleNeedleTypeChange}
                        menuItems={NeedlesOptions}
                    />

                    {/* Table for displaying the needle stash */}
                    <table className="table">
                        <thead>
                            <tr>
                                <th>Type</th>
                                <th>Size</th>
                                <th>Length</th>
                                <th>Quantity</th>
                                <th>In Use</th>
                            </tr>
                        </thead>

                        {/* Maps each needle to a row in the table */}
                        <tbody>
                            {filteredNeedleStash.map(needle => (
                                <tr key={needle.id}>
                                    <td>{needle.type}</td>
                                    <td>{needle.size} mm</td>
                                    <td>{needle.length}</td>
                                    <td>{needle.quantity}</td>
                                    <td>{needle.inUse ? 'Yes' : 'No'}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </>
            ) : (
                <p>You have no registered knitting needles. Please add knitting needles to see them in the overview.</p>
            )}            


        </>
    );
};
