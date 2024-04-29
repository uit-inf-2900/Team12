import React, {useState, useEffect} from "react";
import { Modal } from "@mui/material";
import "../../../GlobalStyles/main.css";
import TextYarn from './yarntext';
import AddButton from '../../../Components/AddButton';
import GeneralCard from '../../Admin/Dashboard/Card';

const YarnStash = (setYarnTypes, yarnTypes) => {
    // Set the yarn state and the delete modal state
    const [yarns, setYarns] = useState([]);
    const [openYarnModal, setOpenYarnModal] = useState(false);

    // Toggle the yarn modal
    const toggleYarnModal = () => {
        setOpenYarnModal(!openYarnModal);
    };

    const yarnStash = [
        { ItemID: '', Type: '', Manufacturer:'', Color: '', Weight: '', Length: '' },
    ];

    const handleDeleteYarn = async (ItemID) => {
        console.log(`Deleting yarn with ID: ${ItemID}`);
        
        const url = `http://localhost:5002/api/inventory/deleteyarn`; 
        const payload = {
            UserToken: sessionStorage.getItem('token'), // Fetching the token from session storage
            itemId: ItemID
        };

        try {
            const response = await fetch(url, {
                method: 'DELETE', // or 'DELETE', depending on your API
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': '*/*'
                },
                body: JSON.stringify(payload)
            });

            if (response.ok) {
                console.log("Yarn deleted successfully");
                setYarns(currentYarns => currentYarns.filter(yarn => yarn.itemId !== ItemID));
            } else {
                console.error("Failed to delete the yarn", await response.text());
            }
        } catch (error) {
            console.error("Error deleting yarn:", error);
        }
        fetchYarns();
    };

    const editYarn = async () => {
        console.log(`Editing yarn with ID: ${ItemID}`);
        const url = 'http://localhost:5002/api/inventory/updateyarn';
        const payload = {
            UserToken: sessionStorage.getItem('token'), // Fetching the token from session storage
            itemId: ItemID
        };

        try {
            const response = await fetch(url, {
                method: 'PATCH', 
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': '*/*'
                },
                body: JSON.stringify(payload)
            });

            if (response.ok) {
                console.log("Yarn edited successfully");
                setYarns(currentYarns => currentYarns.filter(yarn => yarn.itemId !== ItemID));
            } else {
                console.error("Failed to edit the yarn", await response.text());
            }
        } catch (error) {
            console.error("Error editing yarn:", error);
        }
    }

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
    

    const YarnStats = [
        { label: "Brand type", value: yarns.map( yarn => yarn.type)},
        { label: "Brand", value: yarns.map( yarn => yarn.manufacturer)},
        { label: "Color", value: yarns.map( yarn => yarn.color)},
        { label: "Weight", value: yarns.map( yarn => yarn.weight)},
        { label: "Length", value: yarns.map( yarn => yarn.length )},
        { label: "Gauge", value: yarns.map( yarn => yarn.gauge)},
        { label: "Notes", value: yarns.map( yarn => yarn.type)}
    ];

    return (
        <div>
            <div className="card-container">
            {yarns.map(yarn => (
                <GeneralCard
                    key = {yarn.itemId}
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
                    onDelete = {() => handleDeleteYarn(yarn.itemId)}
                    
                />
            ))}
            </div>
            <AddButton onClick={toggleYarnModal} />
            <Modal open={openYarnModal} onClose={toggleYarnModal}>
                <TextYarn onClose={toggleYarnModal} fetchYarns={fetchYarns} />
            </Modal>
        </div>
    );
};

export default YarnStash;