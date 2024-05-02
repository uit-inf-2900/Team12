import React, { useState, useEffect } from "react";
import { Modal } from "@mui/material";
import "../../../GlobalStyles/main.css";
import TextYarn from './yarntext';
import "../../Counter.css";
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
                console.log(data.yarnInventory)
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
                    ItemId={yarn.ItemID}
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
                <div className="pop" >
                    <div className="pop-content" style={{height: '95%', width: '50%', alignContent:'center'}}>
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
                            <div style={{ width: '100%', display: 'flex' }}>
                                <CustomButton onClick={handleSaveUpdatedYarn}>Save Changes</CustomButton>
                                <CustomButton onClick={closeEditModal}>Cancel</CustomButton>
                            </div>
                        </div>
                    </div>
                </div>
            </Modal>
        </div>
    );
};

export default YarnStash;
