import React, { useEffect, useState } from 'react';
import { TableContainer, Table, TableHead, TableBody, TableRow, TableCell, CircularProgress, TablePagination, TextField } from '@mui/material';

import { fetchUserData } from '../apiServices';
import SetAlert from '../../../Components/Alert';
import { CustomButton } from '../../../Components/Button';
import useDialog from '../../../Components/useDialog';
import { getStatusLabel } from '../../../Components/UserLable';



const ViewUsers = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);
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

    const filteredUsers = users.filter(user =>
        user.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
    };

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };


    return (
        <div >
            <h2>View Users</h2>
            <SetAlert />
            <TextField label="Search Users" variant="outlined" fullWidth style={{ marginBottom: '10px' }} />
            <TableContainer >
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
                            {filteredUsers.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((user, index) => (
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
                <TablePagination
                    rowsPerPageOptions={[5, 10, 25]}
                    component="div"
                    count={filteredUsers.length}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onPageChange={handleChangePage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                />
            </TableContainer>
        </div>
    );
};

export default ViewUsers;