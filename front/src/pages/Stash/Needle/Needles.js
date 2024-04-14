import React, { useState, useEffect, useMemo } from 'react';
import { Fab, Modal, Box } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import MultiSelect from '../../../Components/MultiSelect';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import "../../../GlobalStyles/main.css";
import CustomButton from '../../../Components/Button';

export const NeedleStash = ({ setNeedleTypes, needleTypes }) => {
    // Set the needle state and the delete modal state
    const [needles, setNeedles] = useState([]);
    const [openDeleteModal, setOpenDeleteModal] = useState(false);
    const [needleToDelete, setNeedleToDelete] = useState(null);

    // Open and closing Modual for deleting needles 
    const handleOpenDeleteModal = (needle) => {
        setNeedleToDelete(needle);
        setOpenDeleteModal(true);
    };
    const handleCloseDeleteModal = () => {
        setOpenDeleteModal(false);
        setNeedleToDelete(null);
    };

    // Function to delete needles
    const handleDeleteNeedle = () => {
        // TODO: implement delete needle functionality
        setOpenDeleteModal(false);
    };

    
    const fetchNeedles = async () => {
        const token = sessionStorage.getItem('token');
        const url = `http://localhost:5002/api/inventory/get_inventory?userToken=${token}`;
        try {
            const response = await fetch(url);
            if (response.ok) {
                const data = await response.json();
                setNeedles(data.needleInventory || []);
            } else {
                console.error("Failed to fetch needle data.");
            }
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    };
    
    useEffect(() => {
        fetchNeedles();
    }, []);

    // Define the predefined needle types 
    const predefinedTypes = ['Interchangeble', 'DoublePointed', 'Circular', ];

    // useMemo hook to memoize the needles options for the MultiSelect component, avoiding recalculation on every render.

    const NeedlesOptions = useMemo(() => {
        // Extract the types from the needle stash to create filter options
        const uniqueTypes = Array.from(new Set(needles.map(needle => needle.type)));
        // Set the unique types into an array of options for the MultiSelect. Includes 'Other' for non-predefined types.

        return uniqueTypes.reduce((acc, type) => {
            if (predefinedTypes.includes(type)) {
                acc.push({ value: type, name: `${type} needles` });
            } else if (!acc.some(option => option.value === 'Other')) {
                acc.push({ value: 'Other', name: 'Other' });
            }
            return acc;
        }, [{ value: 'All', name: 'All needles' }]);
    }, [needles]);

    // Filter the needle stash based on the selected needle types.
    const filteredNeedleStash = needles.filter(needle => {
        return needleTypes.includes('All') ||
            needleTypes.includes(needle.type) ||
            (needleTypes.includes('Other') && !predefinedTypes.includes(needle.type));
    });

    return (
        <>
        {/* Check if there are any needles to display */}
        {needles.length > 0 ? (
        <>
            <MultiSelect
                label="Needle Type"
                value={needleTypes}
                handleChange={e => setNeedleTypes(typeof e.target.value === 'string' ? e.target.value.split(',') : e.target.value)}
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
                        <tr key={needle.itemId}>
                            <td>{needle.type}</td>
                            <td>{needle.size} mm</td>
                            <td>{needle.length} cm</td>
                            <td>{needle.numItem}</td>
                            <td className={needle.numInUse ? 'in-use' : 'not-in-use'}>
                                {needle.numInUse ? 'In Use' : 'Not In Use'}
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
            <Modal open={openDeleteModal} onClose={handleCloseDeleteModal}>
                <Box className="box light">
                    <h2>Delete Needle</h2>
                    <p>Are you sure you want to delete this needle?</p>
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

export default NeedleStash;
