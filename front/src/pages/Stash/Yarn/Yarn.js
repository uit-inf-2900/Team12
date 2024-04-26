import React, {useState, useEffect} from "react";
import { Modal } from "@mui/material";
import "../../../GlobalStyles/main.css";
import TextYarn from './yarntext';
import AddButton from '../../../Components/AddButton';
import Card from '../../../Components/Card';

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
            <div className="yarn-container">
                <div className="card-container">
                {yarns.map(yarn => {
                    console.log("Card data",yarn);
                    return(
                    <Card
                        key={yarn.itemId}
                        ItemID={yarn.itemId}
                        Type={yarn.type}
                        Manufacturer={yarn.manufacturer}
                        Color={yarn.color}
                        Weight={yarn.weight !== null ? yarn.weight.toString() : ''} // Convert to string if not null
                        Length={yarn.length !== null ? yarn.length.toString() : ''}
                        onDelete={handleDeleteYarn}
                        />
                    );
                })}
                </div>
            </div>
        <AddButton onClick={toggleYarnModal} />

        <Modal open={openYarnModal} onClose={toggleYarnModal}>
            <TextYarn onClose={toggleYarnModal} fetchYarns={fetchYarns} />
        </Modal>
    </div>
    );
};

export default YarnStash;