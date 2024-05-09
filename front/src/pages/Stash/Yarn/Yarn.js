import React, { useState, useEffect } from "react";
import { Modal } from "@mui/material";
import "../../../GlobalStyles/main.css";
import TextYarn from './yarntext';
import "../../Counter.css";
import GeneralCard from '../../Admin/Dashboard/Card';
import InputField from '../../../Components/InputField';
import { CustomButton, AddButton } from '../../../Components/Button';
import yarnBasket from '../../../images/yarnSheep.png';

const YarnStash = () => {
    // State declarations
    const [yarns, setYarns] = useState([]);
    const [openYarnModal, setOpenYarnModal] = useState(false);
    const [editYarnModalOpen, setEditYarnModalOpen] = useState(false);
    const [currentYarn, setCurrentYarn] = useState({});

    // Handling the deletion of yarn
    const handleDeleteYarn = async (ItemID) => {
        const url = `http://localhost:5002/api/inventory/deleteyarn`;
        const payload = {
            UserToken: sessionStorage.getItem('token'),
            itemId: ItemID
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
                // If deletion was successful, update yarns state by removing deleted yarn
                setYarns(currentYarns => currentYarns.filter(yarn => yarn.itemId !== ItemID));
                setEditYarnModalOpen(false);
            } else {
                console.error("Failed to delete the yarn", await response.text());
            }
        } catch (error) {
            console.error("Error deleting yarn:", error);
        }
    };

    // Function to handle editing of yarn
    const handleEditYarn = (yarn) => {
        setCurrentYarn(yarn);
        setEditYarnModalOpen(true);
    };

    // Function to handle input change for yarn attributes
    const handleInputChange = (prop) => (event) => {
        setCurrentYarn({ ...currentYarn, [prop]: event.target.value });
    };

    // Handling saving updated yarn
    const handleSaveUpdatedYarn = async () => {
        const url = `http://localhost:5002/api/inventory/updateyarn`;
        const payload = {
            UserToken: sessionStorage.getItem('token'),
            ...currentYarn
        };
        try {
            const response = await fetch(url, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(payload)
            });
            if (response.ok) {
                // If update successful, update yarns state with updated yarn
                setYarns(currentYarns => currentYarns.map(yarn => yarn.itemId === currentYarn.itemId ? {...yarn, ...currentYarn} : yarn));
                setEditYarnModalOpen(false);
            } else {
                console.error("Failed to update the yarn", await response.text());
            }
        } catch (error) {
            console.error("Error updating yarn:", error);
        }
    };

    // Function to fetch yarn data
    const fetchYarns = async () => {
        const token = sessionStorage.getItem('token');
        const url = `http://localhost:5002/api/inventory/get_inventory?userToken=${token}`;
        try {
            const response = await fetch(url);
            if (response.ok) {
                const data = await response.json();
                setYarns(data.yarnInventory);
                console.log('Fetched yarns', data.yarnInventory)
            } else {
                console.error("Failed to fetch yarn data.");
            }
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    };

    // Fetch yarns on component mount
    useEffect(() => {
        fetchYarns();
    }, []);

    return (
        <div>
            {/* Displaying yarn cards */}
            <div className="card-container" style={{justifyContent: 'flex-start', justifyContent: 'center'}}>
                {yarns.map(yarn => (
                    <GeneralCard
                        key={yarn.itemId}
                        ItemId={yarn.ItemID}
                        title={`${yarn.manufacturer}, ${yarn.type}`}
                        stats={[
                            { label: "Brand", value: yarn.manufacturer},
                            { label: "Type", value: yarn.type},
                            { label: "Color", value: yarn.color},
                            { label: "Weight", value: yarn.weight},
                            { label: "Gauge", value: yarn.gauge},
                        ]}
                        hovermessage = 'Click to view, edit or delete'
                        onClick={() => handleEditYarn(yarn)}
                    />
                ))}
            </div>
            <AddButton onClick={() => setOpenYarnModal(!openYarnModal)}/>
            {/* Modal for adding yarn */}
            <Modal open={openYarnModal} onClose={() => setOpenYarnModal(!openYarnModal)}>
                <TextYarn onClose={() => setOpenYarnModal(!openYarnModal)} fetchYarns={fetchYarns}/>
            </Modal>
            {/* Modal for editing yarn */}
            <Modal open={editYarnModalOpen} onClose={() => setEditYarnModalOpen(false)}>
                <div className="pop" >
                    <div className="pop-content" style={{height: 'auto', width: '50%'}}>
                        <h2>Edit Yarn</h2>
                        <div className="yarn-form" style={{ display: 'flex', flexDirection: 'column'}}>
                            <div className="input-row" style={{ display: 'flex', justifyContent: 'space-between', width: '100%', margin: '0 auto' }}>
                                <div className="input-wrapper" style={{  width: 'calc(50% + 100px)', marginRight: '10px'}}>
                                    <InputField label="Brand" type= 'text' value={currentYarn.manufacturer || ''} onChange={handleInputChange('manufacturer')} />
                                    <InputField label="Length" type= 'text' value={currentYarn.length || ''} onChange={handleInputChange('length')} />
                                    <InputField label="Gauge" type= 'text' value={currentYarn.gauge || ''} onChange={handleInputChange('gauge')} />
                                    <InputField label="Color" type= 'text' value={currentYarn.color || ''} onChange={handleInputChange('color')} />
                                </div>
                                <div className="input-wrapper" style={{  width: 'calc(50% + 100px)', marginRight: '10px'}}>
                                    <InputField label="Type" type= 'text' value={currentYarn.type || ''} onChange={handleInputChange('type')} />
                                </div>
                            </div>
                            <div className="input-row" style={{ display: 'flex', justifyContent: 'space-between', margin: '0 auto' }}>
                                <div className="input-wrapper" style={{  width: 'calc(50% + 100px)'}}></div>
                                <div style={{ width: '40%', alignItems: 'center', marginTop: '-190px'}}>
                                    <img src={yarnBasket} alt="Yarn Basket" />
                                </div>
                            </div>
                            <div className="input-row" style={{ display: 'flex', justifyContent: 'space-between', width: '100%', margin: '0 auto' }}>
                                <div className="input-wrapper" style={{  width: 'calc(50% + 100px)', marginRight: '10px'}}>
                                    <InputField label="Weight" type= 'number' value={currentYarn.weight || ''} onChange={handleInputChange('weight')} />
                                </div>
                                <div className="input-wrapper" style={{ width: 'calc(50% + 100px)'}}>
                                    <InputField label="Batch number" type= 'text' value={currentYarn.batch_Number || ''} onChange={handleInputChange('batch_Number')} />
                                </div>
                            </div>
                            <div className="input-wrapper" style={{ width:'100%', marginBottom: '10px'}}>
                                <InputField label="Notes" type= 'text' value={currentYarn.notes || ''} onChange={handleInputChange('notes')} multiline rows={4} />
                            </div>
                            <div style={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
                                {/* Buttons for saving changes, canceling and deleting yarn */}
                                <CustomButton onClick={handleSaveUpdatedYarn} style={{ margin: '10px' }}>Save Changes</CustomButton>
                                <CustomButton onClick={() => setEditYarnModalOpen(false)} style={{ margin: '10px' }}>Cancel</CustomButton>
                                <CustomButton onClick={() => handleDeleteYarn(currentYarn.itemId)} style={{ margin: ' 10px' }}>Delete</CustomButton>
                            </div>
                        </div>
                    </div>
                </div>
            </Modal>
        </div>
    );
};
export default YarnStash;