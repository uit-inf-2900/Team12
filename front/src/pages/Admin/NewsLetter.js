import React, { useEffect, useState } from 'react';
import {
    TableContainer,
    Table,
    TableHead,
    TableBody,
    TableRow,
    TableCell,
    CircularProgress,
    Dialog,
    DialogActions,
    DialogTitle,
} from '@mui/material';
import axios from 'axios';

import CustomButton from '../../Components/Button';
import SetAlert from '../../Components/Alert';


/**
 * Fuction to fetch all the subscribers from the database
 * @returns {Array} An array of all the subscribers.
 */
const fetchSubscribers = async () => {
    // Fetch the token from sessionStorage
    try {
        const token = sessionStorage.getItem('token');
        console.log("Token fetched from sessionStorage:", token);
        const response = await axios.get('http://localhost:5002/api/newsletter/getsunscribers', {
            params: { userToken: token }
        });
        console.log("API response:", response);

        // Check if the response is successful, if so, return the data as an array of objects
        if (response.status === 200) {
            return response.data.map(email => ({ email }));         
        } else {
            throw new Error('Failed to fetch subscribers');
        }
    } catch (error) {
        console.error('Error fetching subscribers:', error.response ? error.response.data : error.message);
        return [];
    }
    
};


/**
 * Component to view and manage subscribers.
 * @returns {JSX.Element} JSX element.
 */
const ViewSubscribers = () => {
    const [subscribers, setSubscribers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [alertOpen, setAlertOpen] = useState(false);
    const [alertSeverity, setAlertSeverity] = useState('info');
    const [alertMessage, setAlertMessage] = useState('');
    const [dialogOpen, setDialogOpen] = useState(false);
    const [dialogMessage, setDialogMessage] = useState('');
    const [dialogAction, setDialogAction] = useState(() => () => {});
    const [refreshData, setRefreshData] = useState(false);


    /**
     * Fetch all subscribers when the component mounts or when the refreshData state changes
     */
    useEffect(() => {
        setLoading(true);
        fetchSubscribers().then(data => {
            setSubscribers(data);
            setLoading(false);
        }).catch(error => {
            console.error('Error setting subscriber data:', error);
            setLoading(false);
        });
    }, [refreshData]);

    /**
     * Function to handle the opening of the dialog box
     */ 
    const handleActionOpen = (message, action) => {
        setDialogMessage(message);
        setDialogAction(() => action);
        setDialogOpen(true);
    };

    /**
     * Function for handling the confirmation of the dialog box
     */
    const handleActionConfirm = () => {
        dialogAction();
        setDialogOpen(false);
        setRefreshData(prev => !prev);
    };

    /**
     * 
     * @returns - a function to handle the closing of the dialog box
     */
    const handleActionCancel = () => setDialogOpen(false);

    /**
     * A function to delete a subscriber from the database 
     * @param {*} - the email of the subscriber to be deleted 
     */
    const deleteSubscriber = async (email) => {
        // Send a request to the server to delete the subscriber
        try {
            const token = sessionStorage.getItem('token');
            const response = await axios.delete(`http://localhost:5002/api/newsletter/removesubscriber`, {
                params: { userToken: token, subEmail: email }
            });
            // Update the subscribers list by removing the deleted subscriber, or throw an error if the response is not successful
            if (response.status === 200) {
                setSubscribers(currentSubscribers => 
                    currentSubscribers.filter(subscriber => subscriber.email !== email)
                );
                // Display a success message if the subscriber is deleted successfully 
                setAlertMessage('Subscriber removed successfully');
                setAlertSeverity('success');
                setAlertOpen(true);
            } else {
                throw new Error('Failed to remove subscriber');
            }
        } catch (error) {
            setAlertMessage('Failed to remove subscriber');
            setAlertSeverity('error');
            setAlertOpen(true);
            console.error('Error removing subscriber:', error);
        }
    };
    
    return (
        <div>
            <SetAlert 
                open={alertOpen} 
                setOpen={setAlertOpen} 
                severity={alertSeverity} 
                message={alertMessage} 
            />
            <TableContainer>
                {loading ? (
                    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '300px' }}>
                        <CircularProgress />
                    </div>
                ) : (
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>Email</TableCell>
                                <TableCell>Actions</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {subscribers.map((subscriber, index) => (
                                <TableRow key={index}>
                                    <TableCell>{subscriber.email}</TableCell>
                                    <TableCell>
                                        <CustomButton
                                            variant="contained"
                                            color="secondary"
                                            onClick={() => handleActionOpen(
                                                `Are you sure you want to remove the subscriber: ${subscriber.email}?`,
                                                () => deleteSubscriber(subscriber.email)
                                            )}
                                        >
                                            Delete
                                        </CustomButton>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                )}
            </TableContainer>
            <Dialog open={dialogOpen} onClose={handleActionCancel}>
                <DialogTitle>{dialogMessage}</DialogTitle>
                <DialogActions>
                    <CustomButton onClick={handleActionConfirm} color="primary">Confirm</CustomButton>
                    <CustomButton onClick={handleActionCancel}>Cancel</CustomButton>
                </DialogActions>
            </Dialog>
        </div>
    );
};

export default ViewSubscribers;
