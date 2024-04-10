// src/Components/NeedlesComponent.js

import React, { useState, useMemo } from 'react'; 
import { Fab, Modal, Box } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import MultiSelect from '../../../Components/MultiSelect';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import { Button } from '@mui/material';
import "../../../GlobalStyles/main.css";
import CustomButton from '../../../Components/Button';


export const NeedleStash= ({ setNeedleTypes, needleTypes }) => {
    const [openDeleteModal, setOpenDeleteModal] = useState(false);
    const [needleToDelete, setNeedleToDelete] = useState(null);

    // Funksjon for å åpne modalen for sletting
    const handleOpenDeleteModal = (needle) => {
        setNeedleToDelete(needle);
        setOpenDeleteModal(true);
    };

    // Funksjon for å lukke modalen for sletting
    const handleCloseDeleteModal = () => {
        setOpenDeleteModal(false);
        setNeedleToDelete(null);
    };

    // Funksjon for faktisk sletting av nålen
    const handleDeleteNeedle = () => {
        // Implementer logikk for å slette nålen her, basert på needleToDelete.id
        setOpenDeleteModal(false);
    };
    
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
                                <th>Edit</th>
                                <th>Delete</th>
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
                                    <td className={needle.inUse ? 'in-use' : 'not-in-use'}>
                                        {needle.inUse ? 'In Use' : 'Not In Use'}
                                    </td>
                                    <td>
                                        <Fab size="small" onClick={() => handleEditNeedle(needle)}>
                                            <EditIcon />
                                        </Fab>
                                    </td>
                                    <td>
                                        <Fab size="small" onClick={() => handleOpenDeleteModal(needle)}>
                                            <DeleteIcon />
                                        </Fab>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    <Modal className='page-container'
                        open={openDeleteModal}
                        onClose={handleCloseDeleteModal}
                        aria-labelledby="delete-needle-modal-title"
                        aria-describedby="delete-needle-modal-description"
                    >
                        <Box className="box light" >
                            <h2 id="delete-needle-modal-title">Delete Needle</h2>
                            <p id="delete-needle-modal-description">
                                Are you sure you want to delete this needle?
                            </p>
                            <Box style={{ display: 'flex', flexDirection: 'row', gap: '1rem' }}> 
                                <CustomButton themeMode="light" onClick={handleDeleteNeedle}>Yes, Delete</CustomButton>
                                <CustomButton themeMode="light" onClick={handleCloseDeleteModal}>No, Cancel</CustomButton>
                            </Box>
                        </Box>
                    </Modal>
                </>
            ) : (
                <p>You have no registered knitting needles. Please add knitting needles to see them in the overview.</p>
            )}            


        </>
    );
};
