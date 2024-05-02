import React, { useEffect, useState } from 'react';
import {
    TableContainer,
    Table,
    TableHead,
    TableBody,
    TableRow,
    TableCell,
    TablePagination,
    CircularProgress,
    Dialog,
    DialogActions,
    DialogTitle,
    TextField,
} from '@mui/material';
import axios from 'axios';
import SetAlert from '../../../Components/Alert';
import {CustomButton} from '../../../Components/Button';
import { getStatusLabel } from '../../../Components/UserLable';


  // Fetch user data from the backend
const fetchUserData = async () => {
    try {
    const response = await fetch('http://localhost:5002/getUsers');
    if (!response.ok) {
        throw new Error('Failed to fetch user data');
    }
    const data = await response.json();
    return data;
    } catch (error) {
    console.error('Error fetching user data:', error);
    return [];
    }
};


const ViewUsers = () => {
    // State declarations
    const [users, setUsers] = useState([]);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [loading, setLoading] = useState(true);
    const [alertOpen, setAlertOpen] = useState(false);
    const [alertSeverity, setAlertSeverity] = useState('info');
    const [alertMessage, setAlertMessage] = useState('');
    const [sortField, setSortField] = useState('fullName');
    const [sortDirection, setSortDirection] = useState('asc');
    const [searchText, setSearchText] = useState('');
    const [dialogOpen, setDialogOpen] = useState(false);
    const [dialogMessage, setDialogMessage] = useState('');
    const [dialogAction, setDialogAction] = useState(() => () => {});
    const [refreshData, setRefreshData] = useState(false);


    const token = sessionStorage.getItem('token');

    useEffect(() => {
        setLoading(true);
        fetchUserData().then(data => {
            setUsers(data);
            setLoading(false);
        }).catch(error => {
            console.error('Error setting user data:', error);
            setLoading(false);
        });        
    }, [refreshData]);


    // User interaction handlers
    const handleChangePage = (event, newPage) => setPage(newPage);
    const handleChangeRowsPerPage = event => {
        setRowsPerPage(+event.target.value);
        setPage(0);
    };

    const handleSearchChange = event => setSearchText(event.target.value.toLowerCase());
    const handleSort = field => {
        const isAsc = sortField === field && sortDirection === 'asc';
        setSortDirection(isAsc ? 'desc' : 'asc');
        setSortField(field);
    };

    const handleActionOpen = (message, action) => {
        setDialogMessage(message);
        setDialogAction(() => action);
        setDialogOpen(true);
    };
    const handleActionConfirm = () => {
        dialogAction();
        setDialogOpen(false);
        setRefreshData(prev => !prev);
    };
    const handleActionCancel = () => setDialogOpen(false);

     // Sorting and filtering logic
    const filteredUsers = users.filter(user => user.fullName.toLowerCase().includes(searchText) || user.email.toLowerCase().includes(searchText));
    const sortedUsers = filteredUsers.sort((a, b) => (a[sortField] < b[sortField]) ? (sortDirection === 'asc' ? -1 : 1) : (a[sortField] > b[sortField]) ? (sortDirection === 'asc' ? 1 : -1) : 0);

   // Admin status update
    const toggleAdminStatus = async (userId, isAdmin) => {
        // Get the user token from the session storage
        try {
            // Send a PATCH request to the server to update the admin status of the user
            const response = await axios.patch(`http://localhost:5002/Users/updateadmin`, {
                UserToken: token,
                UpdateUser: userId,
                NewAdmin: !isAdmin
            }, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            
            // If the request is successful, update the admin status of the user in the users array
            if (response.status === 200) {
                setUsers(prevUsers => prevUsers.map(user =>
                    user.userId === userId ? { ...user, isAdmin: !user.isAdmin } : user
                ));
                // Set alert for success
                setAlertMessage('Admin status updated successfully');
                setAlertSeverity('success');
                setAlertOpen(true);
            } else {
                const errorData = await response.data;
                // Set alert for error from the server response
                setAlertMessage(`Failed to update admin status: ${errorData.message}`);
                setAlertSeverity('error');
                setAlertOpen(true);
            }
        } catch (error) {
            // Set alert for error in catch block
            setAlertMessage('Failed to update admin status');
            setAlertSeverity('error');
            setAlertOpen(true);
            console.error('Error updating admin status:', error);
        }
    };
    
    // User banning logic
    const banUser = async (userId, banStatus) => {
        try {
            // Send a POST request to the server to ban the user
            const response = await axios.patch('http://localhost:5002/Users/banUser', {
                userToken: token,
                banUserId: userId, 
                ban: banStatus
            });
            console.log("Response: ", response);

            // If the request is successful, update the users array to remove the banned user
            if (response.status === 200) {
                setUsers(prevUsers => prevUsers.map(user => {
                    if (user.userId === userId) {
                        return { ...user, status: banStatus ? "banned" : "active" }; // Oppdater status basert på banStatus
                    }
                    return user;
                }));
                setAlertMessage(`User ${banStatus ? "banned" : "unbanned"} successfully`);
                setAlertSeverity('success');
                setAlertOpen(true);
            } else {
                const errorData = await response.data;
                // Set alert for error from the server response
                setAlertMessage(`Failed to ban user: ${errorData.message}`);
                setAlertSeverity('error');
                setAlertOpen(true);
            }
        } catch (error) {
            // Set alert for error in catch block
            setAlertMessage('Failed to ban user');
            setAlertSeverity('error');
            setAlertOpen(true);
            console.error('Error banning user:', error);
        }
    };


    return (
        <div>
            {/* Setup the alert status */}
            <SetAlert 
                open={alertOpen} 
                setOpen={setAlertOpen} 
                severity={alertSeverity} 
                message={alertMessage} 
            />
            {/* Search field for users */}
            <TextField label="Search Users" variant="outlined" value={searchText} onChange={handleSearchChange} style={{ margin: '10px 0' }} fullWidth />
            {/* Dialog for confirming actions */}
            <Dialog open={dialogOpen} onClose={handleActionCancel}>
                <DialogTitle>{dialogMessage}</DialogTitle>
                <DialogActions>
                    <CustomButton onClick={handleActionConfirm} color="primary">Confirm</CustomButton>
                    <CustomButton onClick={handleActionCancel}>Cancel</CustomButton>
                </DialogActions>
            </Dialog>

            {/* User table and loading state */}
            <TableContainer>
                {/* Display a loading spinner while fetching data */}
                {loading ?
                (
                    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '300px' }}>
                        <CircularProgress style={{ color: '#F6964B' }} />
                    </div>
                ):(
                <Table>
                    {/* Create the header of the table */}
                    <TableHead>
                        <TableRow>
                            <TableCell style={{ fontWeight: 'bold', cursor: 'pointer' }} onClick={() => handleSort('fullName')}>
                                Name {sortField === 'fullName' ? (sortDirection === 'asc' ? '↑' : '↓') : ''}
                            </TableCell>
                            <TableCell style={{ fontWeight: 'bold', cursor: 'pointer' }} onClick={() => handleSort('email')}>
                                Email {sortField === 'email' ? (sortDirection === 'asc' ? '↑' : '↓') : ''}
                            </TableCell>
                            <TableCell style={{ fontWeight: 'bold' }}>Status</TableCell>
                            <TableCell style={{ fontWeight: 'bold' }}>Admin Privileges</TableCell>
                            <TableCell style={{ fontWeight: 'bold' }}>Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    {/* Add the user information to the table */}
                    <TableBody>
                        {sortedUsers
                        .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                        .map((user, index) => (
                            <TableRow key={index}>
                                <TableCell>{user.fullName}</TableCell>
                                <TableCell>{user.email}</TableCell>
                                <TableCell>{getStatusLabel(user.status)}</TableCell>
                                <TableCell>{user.isAdmin ? 'Yes' : 'No'}
                                    <CustomButton
                                        style={{alignItems: 'right'}}
                                        variant="contained"
                                        color={user.isAdmin ? "secondary" : "primary"}
                                        onClick={() => handleActionOpen(
                                            `Are you sure you want to ${user.isAdmin ? 'remove' : 'add'} admin privileges for ${user.fullName} (${user.email})?`,
                                            () => toggleAdminStatus(user.userId, !user.isAdmin)
                                        )}
                                    >
                                        {user.isAdmin ? 'Remove Admin' : 'Add Admin'}
                                    </CustomButton>
                                </TableCell>
                                <TableCell >{user.status}
                                <CustomButton
                                    variant="contained"
                                    color={user.status === "banned" ? "primary" : "secondary"} // Endre farge basert på status
                                    onClick={() => handleActionOpen(
                                        `Are you sure you want to ${user.status === "banned" ? "unban" : "ban"} ${user.fullName} (${user.email})?`,
                                        () => banUser(user.userId, user.status !== "banned")
                                    )}
                                >
                                    {user.status === "banned" ? "Unban User" : "Ban User"} {/* Endre knappetekst basert på status */}
                                </CustomButton>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
                )}
            </TableContainer>

            {/* Navigate between pages of data displayed within a table */}
            <TablePagination
                rowsPerPageOptions={[5, 10, 25, 50, 100]}
                component="div"
                count={users.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
            />
        </div>
    );
};

export default ViewUsers;