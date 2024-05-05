import React, { useEffect, useState } from 'react';
import { TableContainer, TablePagination, Table, TableHead, TableBody, TableRow, TableCell, CircularProgress, TextField, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Button } from '@mui/material';
import axios from 'axios';

import { fetchSubscribers } from './apiServices';
import SetAlert from '../../Components/Alert';
import { CustomButton } from '../../Components/Button';


/**
 * Component for viewing and managing newsletter subscribers.
 * @returns {JSX.Element} - ViewSubscribers component.
 */
const ViewSubscribers = () => {
    // State variables 
    const [subscribers, setSubscribers] = useState([]);
    const [filteredSubscribers, setFilteredSubscribers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [dialogOpen, setDialogOpen] = useState(false);
    const [open, setOpen] = useState(false);  
    const [emailToRemove, setEmailToRemove] = useState('');
    const [alert, setAlert] = useState({ severity: '', message: '' });

    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);

    // Fetch the subscribers 
    useEffect(() => {
        loadSubscribers();
    }, []);

    // User interaction handlers
    const handleChangePage = (event, newPage) => setPage(newPage);
    const handleChangeRowsPerPage = event => {
        setRowsPerPage(+event.target.value);
        setPage(0);
    };


    /**
     * Function to fetch the newsletter subscribers 
     */
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

    // Filter subscribers based on search term 
    useEffect(() => {
        const filtered = subscribers
            .filter(subscriber => subscriber.email.toLowerCase().includes(searchTerm.toLowerCase()))
            .sort((a, b) => a.email.localeCompare(b.email)); // Sort alphabetically
        setFilteredSubscribers(filtered);
    }, [searchTerm, subscribers]);

    // Handle the change when seraching 
    const handleSearchChange = (event) => {
        setSearchTerm(event.target.value);
    };

    // Remove emails from subscription list when clicked on
    const handleRemoveClick = (email) => {
        setEmailToRemove(email);
        setDialogOpen(true);
    };

    // Handle the close of the dialog
    const handleCloseDialog = () => {
        setDialogOpen(false);
    };

    /**
     * Function to remove a subscriber 
     */
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
            {/* Show a loding bar when loading from backen */}
            {loading ? (
                <CircularProgress style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '300px' }} />
            ) : (
                <>
                    {/* Show the search bar as long as there are users in the subscribers list  */}
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
                                    {filteredSubscribers
                                        .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                        .map((subscriber, index) => (
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
                        // Show a message if the email search is not found 
                        <div style={{ textAlign: 'center', margin: '20px' }}>
                            No subscribers found with the given search term.
                        </div>
                    ) : (
                        // Show a message if there are no registerd newsletter subscribers
                        <div style={{ textAlign: 'center', margin: '20px' }}>
                            There are no registerd newsletter subscribers at the moment.
                        </div>
                    )}
                    {/* Navigate between pages of data displayed within a table */}
            <TablePagination
                rowsPerPageOptions={[5, 10, 25, 50, 100]}
                component="div"
                count={subscribers.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
            />
                </>
            )}
            {/* Make sure the admin want to remove the subscriber from the newsletter */}
            <Dialog
                open={dialogOpen}
                onClose={handleCloseDialog}
            >
                <DialogTitle id="alert-dialog-title">{"Confirm Removal"}</DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description" color="black">
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
            
            {/* Alert for the admin to tell the user if all is good, or if something went wrong */}
            <SetAlert open={open} setOpen={setOpen} severity={alert.severity} message={alert.message} />
        </div>
    );
};

export default ViewSubscribers;
