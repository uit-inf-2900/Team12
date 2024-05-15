import React, { useState, useEffect, useMemo } from 'react';
import { Fab, Modal, Box } from "@mui/material";
import MultiSelect from '../../../Components/Forms/MultiSelect';
import DeleteIcon from '@mui/icons-material/Delete';
import "../../../GlobalStyles/main.css";
import { CustomButton } from '../../../Components/UI/Button';
import NeedleInfo from './needletext';
import { AddButton } from '../../../Components/UI/Button';
import SetAlert from '../../../Components/UI/Alert';

export const NeedleStash = ({ setNeedleTypes, needleTypes }) => {
    // Set the needle state and the delete modal state
    const [needles, setNeedles] = useState([]);
    const [openDeleteModal, setOpenDeleteModal] = useState(false);
    const [needleToDelete, setNeedleToDelete] = useState(null);
    const [openNeedleModal, setOpenNeedleModal] = useState(false);

    const [alertOpen, setAlertOpen] = useState(false);
    const [alertSeverity, setAlertSeverity] = useState('info');
    const [alertMessage, setAlertMessage] = useState('');

    // Toggle the needle modal
    const toggleNeedleModal = () => {
        setOpenNeedleModal(!openNeedleModal);
    };

    // Open and closing Modal for deleting needles 
    const handleOpenDeleteModal = (needle) => {
        setNeedleToDelete(needle);
        setOpenDeleteModal(true);
    };
    const handleCloseDeleteModal = () => {
        setOpenDeleteModal(false);
        setNeedleToDelete(null);
    };

    // Handler to delete needle
    const handleDeleteNeedle = async () => {
        if (needleToDelete) {
            const url = `http://localhost:5002/api/inventory/deleteneedle`; 
            const payload = {
                userToken: sessionStorage.getItem('token'),
                itemId: needleToDelete.itemId
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
                    console.log("Needle deleted successfully");
                    setAlertMessage("Needle deleted successfully");
                    setAlertSeverity('success');
                    setAlertOpen(true);
                    fetchNeedles(); // Refresh the list after deletion
                } else {
                    console.error("Failed to delete the needle", await response.text());
                    setAlertMessage(`Failed to delete the needle`);
                    setAlertSeverity('error');
                    setAlertOpen(true);
                }
            } catch (error) {
                console.error("Error deleting needle:", error);
                setAlertMessage('Error deleting needle');
                setAlertSeverity('error');
                setAlertOpen(true);
            }
        }
        setOpenDeleteModal(false); // Close the modal after attempting to delete
    };

    // Fetching the needles
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
    
    // Fetch needle on component mount
    useEffect(() => {
        fetchNeedles();
    }, []);

    // Define the predefined needle types 
    const predefinedTypes = ['Interchangeble', 'DoublePointed', 'Circular', ];

    // useMemo hook to memoize the needles options for the MultiSelect component
    const NeedlesOptions = useMemo(() => {
        // Extract the types from the needle to create filter options
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
        <div style={{width:'80%', alignItems:'center', textAlign: 'center', margin: '0 auto'}}>
            <SetAlert 
                open={alertOpen} 
                setOpen={setAlertOpen} 
                severity={alertSeverity} 
                message={alertMessage} 
            />
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
                            <th>In Use</th>
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
                                <td className={needle.numInUse ? 'in-use' : 'not-in-use'}>
                                    {needle.numInUse ? 'In Use' : 'Not In Use'}
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
                    <Box className="pop" >
                        <Box className="pop-content">
                            <h2>Delete Needle</h2>
                            <p>Are you sure you want to delete this needle?</p>
                            <Box style={{ display: 'flex', flexDirection: 'row', gap: '1rem' }}>
                                <CustomButton themeMode="light" onClick={handleDeleteNeedle}>Yes, Delete</CustomButton>
                                <CustomButton themeMode="light" onClick={handleCloseDeleteModal}>No, Cancel</CustomButton>
                            </Box>
                        </Box>
                    </Box>
                </Modal>
                </>
            ) : (
                <p>You have no registered knitting needles. Please add knitting needles to see them in the overview.</p>
            )}
            </>
            <AddButton onClick={toggleNeedleModal} />
            <Modal open={openNeedleModal} onClose={toggleNeedleModal}>
                <NeedleInfo onClose={toggleNeedleModal} fetchNeedles={fetchNeedles} />
            </Modal>
        </div>
    );
};

export default NeedleStash;
