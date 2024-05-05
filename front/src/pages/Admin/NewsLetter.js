import React, { useEffect, useState } from 'react';
import { TableContainer, Table, TableHead, TableBody, TableRow, TableCell, CircularProgress, TextField, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Button } from '@mui/material';
import axios from 'axios';

import { fetchSubscribers } from './apiServices';
import SetAlert from '../../Components/Alert';
import { CustomButton } from '../../Components/Button';

const ViewSubscribers = () => {
    const [subscribers, setSubscribers] = useState([]);
    const [filteredSubscribers, setFilteredSubscribers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [dialogOpen, setDialogOpen] = useState(false);
    const [open, setOpen] = useState(false);  
    const [emailToRemove, setEmailToRemove] = useState('');
    const [alert, setAlert] = useState({ severity: '', message: '' });


    useEffect(() => {
        loadSubscribers();
    }, []);

    const loadSubscribers = () => {
        setLoading(true);
        fetchSubscribers().then(data => {
            setSubscribers(data);
            setFilteredSubscribers(data);
            setLoading(false);
        }).catch(error => {
            console.error('Error fetching subscriber data:', error);
            setAlert({ severity: 'error', message: 'Failed to fetch subscriber data' });
            setOpen(true);
            setLoading(false);
        });
    };

    useEffect(() => {
        const filtered = subscribers.filter(subscriber =>
            subscriber.email.toLowerCase().includes(searchTerm.toLowerCase())
        );
        setFilteredSubscribers(filtered);
    }, [searchTerm, subscribers]);

    const handleSearchChange = (event) => {
        setSearchTerm(event.target.value);
    };

    const handleRemoveClick = (email) => {
        setEmailToRemove(email);
        setDialogOpen(true);
    };

    const handleCloseDialog = () => {
        setDialogOpen(false);
    };

    const confirmRemoveSubscriber = () => {
        axios.delete(`http://localhost:5002/api/newsletter/removesubscriber?subEmail=${encodeURIComponent(emailToRemove)}`)
            .then(response => {
                if (response.status === 200) {
                    const updatedSubscribers = subscribers.filter(sub => sub.email !== emailToRemove);
                    setSubscribers(updatedSubscribers);
                    setFilteredSubscribers(updatedSubscribers);
                    setAlert({ severity: 'success', message: 'Subscriber removed successfully' });
                    setOpen(true);
                }
                handleCloseDialog();
            })
            .catch(error => {
                console.error('Failed to remove subscriber:', error);
                handleCloseDialog();
            });
    };

    return (
        <div style={{ justifyContent: 'center' }}>
            <h2>View Subscribers</h2>
            {loading ? (
                <CircularProgress style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '300px' }} />
            ) : (
                <>
                    {subscribers.length > 0 && (
                        <TextField
                            label="Search for subscribers"
                            variant="outlined"
                            fullWidth
                            style={{ marginBottom: '10px' }}
                            value={searchTerm}
                            onChange={handleSearchChange}
                        />
                    )}
                    {filteredSubscribers.length > 0 ? (
                        <TableContainer style={{ width: '100%' }}>
                            <Table>
                                <TableHead>
                                    <TableRow>
                                        <TableCell>Email</TableCell>
                                        <TableCell>Actions</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {filteredSubscribers.map((subscriber, index) => (
                                        <TableRow key={index}>
                                            <TableCell>{subscriber.email}</TableCell>
                                            <TableCell>
                                                <CustomButton
                                                    variant="contained"
                                                    color="secondary"
                                                    onClick={() => handleRemoveClick(subscriber.email)}
                                                >
                                                    Remove Subscription
                                                </CustomButton>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    ) : subscribers.length > 0 ? (
                        <div style={{ textAlign: 'center', margin: '20px' }}>
                            There are no registerd newsletter subscribers with the given email.
                        </div>
                    ) : (
                        <div style={{ textAlign: 'center', margin: '20px' }}>
                            There are no registerd newsletter subscribers at the moment.
                        </div>
                    )}
                </>
            )}
            <Dialog
                open={dialogOpen}
                onClose={handleCloseDialog}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">{"Confirm Removal"}</DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        Are you sure you want to remove {emailToRemove} from the newsletter list?
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={confirmRemoveSubscriber} color="primary" autoFocus>
                        Yes, remove
                    </Button>
                    <Button onClick={handleCloseDialog}>Close</Button>
                </DialogActions>
            </Dialog>
            
            <SetAlert open={open} setOpen={setOpen} severity={alert.severity} message={alert.message} />
        </div>
    );
};

export default ViewSubscribers;
