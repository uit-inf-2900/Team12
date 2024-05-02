import React, { useEffect, useState } from 'react';
import { TableContainer, Table, TableHead, TableBody, TableRow, TableCell, CircularProgress, TablePagination, TextField } from '@mui/material';

import { fetchUserData } from '../apiServices';
import SetAlert from '../../../Components/Alert';
import CustomButton from '../../../Components/Button';
import useDialog from '../useDialog';
import { getStatusLabel } from '../UserLable';



const ViewUsers = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const { isOpen, openDialog, closeDialog } = useDialog();

    useEffect(() => {
        setLoading(true);
        fetchUserData().then(data => {
            setUsers(data);
            setLoading(false);
        }).catch(error => {
            console.error('Error setting user data:', error);
            setLoading(false);
        });
    }, []);

    return (
        <div style={{width:'100%'}}>
            <h2>View Users</h2>
            <SetAlert />
            <TextField label="Search Users" variant="outlined" fullWidth style={{ marginBottom: '10px' }} />
            <TableContainer style={{ width: '100%' }}>
                {loading ? (
                    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '300px' }}>
                        <CircularProgress />
                    </div>
                ) : (
                    <Table >
                        <TableHead>
                            <TableRow>
                                <TableCell>Name</TableCell>
                                <TableCell>Email</TableCell>
                                <TableCell>Status</TableCell>
                                <TableCell>Admin Privileges</TableCell>
                                <TableCell>Actions</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {users.map((user, index) => (
                                <TableRow key={index}>
                                    <TableCell>{user.fullName}</TableCell>
                                    <TableCell>{user.email}</TableCell>
                                    <TableCell>{getStatusLabel(user.status)}</TableCell>
                                    <TableCell>
                                        <CustomButton
                                            variant="contained"
                                            color={user.isAdmin ? "secondary" : "primary"}
                                            onClick={openDialog}
                                        >
                                            {user.isAdmin ? 'Remove Admin' : 'Add Admin'}
                                        </CustomButton>
                                    </TableCell>
                                    <TableCell>
                                        <CustomButton
                                            variant="contained"
                                            color={user.status === "banned" ? "primary" : "secondary"}
                                            onClick={openDialog}
                                        >
                                            {user.status === "banned" ? "Unban User" : "Ban User"}
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

export default ViewUsers;