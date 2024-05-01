import React, { useState, useEffect } from "react";
import { Modal, Box, TextField, Button } from "@mui/material";
import "../../../GlobalStyles/main.css";
import TextYarn from './yarntext';
import AddButton from '../../../Components/AddButton';
import GeneralCard from '../../Admin/Dashboard/Card';
import InputField from '../../../Components/InputField';
import CustomButton from '../../../Components/Button';
import yarnBasket from '../../../images/yarnSheep.png';




const YarnStash = () => {
    const [yarns, setYarns] = useState([]);
    const [openYarnModal, setOpenYarnModal] = useState(false);
    const [editYarnModalOpen, setEditYarnModalOpen] = useState(false);
    const [currentYarn, setCurrentYarn] = useState({});

    const toggleYarnModal = () => {
        setOpenYarnModal(!openYarnModal);
    };

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
                setYarns(currentYarns => currentYarns.filter(yarn => yarn.itemId !== ItemID));
            } else {
                console.error("Failed to delete the yarn", await response.text());
            }
        } catch (error) {
            console.error("Error deleting yarn:", error);
        }
    };

    const handleEditYarn = (yarn) => {
        setCurrentYarn(yarn);
        setEditYarnModalOpen(true);
    };

    const closeEditModal = () => {
        setEditYarnModalOpen(false);
    };

    const handleInputChange = (prop) => (event) => {
        setCurrentYarn({ ...currentYarn, [prop]: event.target.value });
    };

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
                setYarns(currentYarns => currentYarns.map(yarn => yarn.itemId === currentYarn.itemId ? {...yarn, ...currentYarn} : yarn));
                closeEditModal();
            } else {
                console.error("Failed to update the yarn", await response.text());
            }
        } catch (error) {
            console.error("Error updating yarn:", error);
        }
    };

    const fetchYarns = async () => {
        const token = sessionStorage.getItem('token');
        const url = `http://localhost:5002/api/inventory/get_inventory?userToken=${token}`;
        try {
            const response = await fetch(url);
            if (response.ok) {
                const data = await response.json();
                setYarns(data.yarnInventory);
            } else {
                console.error("Failed to fetch yarn data.");
            }
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    };

    useEffect(() => {
        fetchYarns();
    }, []);

    return (
        <div>
            <div className="card-container" style={{justifyContent: 'flex-start'}}>
            {yarns.map(yarn => (
                <GeneralCard
                    key={yarn.itemId}
                    ItemID={yarn.itemId}
                    title={yarn.type}
                    stats={[
                        { label: "Brand type", value: yarn.type},
                        { label: "Brand", value: yarn.manufacturer},
                        { label: "Color", value: yarn.color},
                        { label: "Weight", value: yarn.weight},
                        { label: "Length", value: yarn.length },
                        { label: "Gauge", value: yarn.gauge},
                        { label: "Notes", value: yarn.type}
                    ]}
                    onDelete={() => handleDeleteYarn(yarn.itemId)}
                    onEdit={() => handleEditYarn(yarn)}
                />
            ))}
            </div>
            <AddButton onClick={toggleYarnModal} />
            <Modal open={openYarnModal} onClose={toggleYarnModal}>
                <TextYarn onClose={toggleYarnModal} fetchYarns={fetchYarns} />
            </Modal>
            <Modal open={editYarnModalOpen} onClose={closeEditModal}>
                <div className="pop">
                    <div className="pop-content" style={{height: '95%', width: '50%', alignContent:'center'}}>
                        <h2>Edit Yarn</h2>
                        <div className="yarn-form" style={{display: 'flex', flexDirection: 'column'}}>
                            <InputField label="Brand" value={currentYarn.manufacturer || ''} onChange={handleInputChange('manufacturer')} />
                            <InputField label="Type" value={currentYarn.type || ''} onChange={handleInputChange('type')} />
                            <InputField label="Color" value={currentYarn.color || ''} onChange={handleInputChange('color')} />
                            <InputField label="Weight" value={currentYarn.weight || ''} onChange={handleInputChange('weight')} />
                            <InputField label="Length" value={currentYarn.length || ''} onChange={handleInputChange('length')} />
                            <InputField label="Notes" value={currentYarn.notes || ''} onChange={handleInputChange('notes')} />
                            <CustomButton onClick={handleSaveUpdatedYarn}>Save Changes</CustomButton>
                            <CustomButton onClick={closeEditModal}>Cancel</CustomButton>
                        </div>
                    </div>
                </div>
            </Modal>
        </div>
    );
};

export default YarnStash;
