import React, { useEffect, useState } from 'react';
import { TableContainer, Table, TableHead, TableBody, TableRow, TableCell, CircularProgress, TablePagination, TextField } from '@mui/material';

import { fetchSubscribers } from './apiServices';
import SetAlert from '../../Components/Alert';
import CustomButton from '../../Components/Button';
import useDialog from './useDialog';

const ViewSubscribers = () => {
    const [subscribers, setSubscribers] = useState([]);
    const [loading, setLoading] = useState(true);
    const { isOpen, openDialog, closeDialog } = useDialog();

    useEffect(() => {
        setLoading(true);
        fetchSubscribers().then(data => {
            setSubscribers(data);
            setLoading(false);
        }).catch(error => {
            console.error('Error setting subscriber data:', error);
            setLoading(false);
        });
    }, []);

    return (
        <div className='section-container' style={{justifyContent:'center'}}>
            <h2>View Subscribers</h2>
            <TextField label="Search for subscribers" variant="outlined" fullWidth style={{ marginBottom: '10px' }} />
            <SetAlert />
            <TableContainer style={{ width: '100%' }}>
                {loading ? (
                    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '300px' }}>
                        <CircularProgress />
                    </div>
                ) : (
                    <Table >
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
                                            onClick={openDialog}
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
        </div>
    );
};

export default ViewSubscribers;
