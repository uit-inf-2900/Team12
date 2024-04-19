import React, { useEffect, useState } from 'react';
import {
    Paper,
    TableContainer,
    Table,
    TableHead,
    TableBody,
    TableRow,
    TableCell,
    TablePagination,
    CircularProgress,
    Button,
    Dialog,
    DialogActions,
    DialogTitle,
    TextField
} from '@mui/material';
import axios from 'axios';
import SetAlert from '../../Components/Alert';
import CustomButton from '../../Components/Button';
import Chip from '@mui/material/Chip';


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

const getStatusLabel = (status) => {
    switch (status) {
        case 'verified':
            return <Chip label="Verified" color="success" variant="outlined" />;
        case 'unverified':
            return <Chip label="Unverified" color="warning" variant="outlined" />;
        case 'banned':
            return <Chip label="Banned" color="error"variant="outlined"  />;
        default:
            return <Chip label="Unknown" variant="outlined" />;
    }
};



const ViewUsers = () => {
    // State variables to store user data, current page, rows per page, and loading state
    const [users, setUsers] = useState([]);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [loading, setLoading] = useState(true);
    const [alertOpen, setAlertOpen] = useState(false);
    const [alertSeverity, setAlertSeverity] = useState('info');
    const [alertMessage, setAlertMessage] = useState('');
    const token = sessionStorage.getItem('token');
    const [sortField, setSortField] = useState('fullName');
    const [sortDirection, setSortDirection] = useState('asc');
    const [searchText, setSearchText] = useState('');
    const [dialogOpen, setDialogOpen] = useState(false);
    const [dialogAction, setDialogAction] = useState(() => () => {});
    const [dialogMessage, setDialogMessage] = useState('');


    // Call this function to open the dialog and set the action that will be taken upon confirmation
    const handleActionOpen = (message, action) => {
        setDialogMessage(message);
        setDialogAction(() => action);
        setDialogOpen(true);
    };

    const handleActionConfirm = () => {
        dialogAction();
        setDialogOpen(false);
    };

    const handleActionCancel = () => {
        setDialogOpen(false);
    };
    const handleSearchChange = (event) => {
        setSearchText(event.target.value.toLowerCase());
    };

    
    // Event handler for sorting
    const handleSort = (field) => {
        const isAsc = sortField === field && sortDirection === 'asc';
        setSortDirection(isAsc ? 'desc' : 'asc');
        setSortField(field);
    };

    // Filter users based on search text
    const filteredUsers = users.filter((user) =>
        user.fullName.toLowerCase().includes(searchText) || 
        user.email.toLowerCase().includes(searchText)
    );

    // Sort users based on sort field and direction
    const sortedUsers = filteredUsers.sort((a, b) => {
        if (a[sortField] < b[sortField]) {
            return sortDirection === 'asc' ? -1 : 1;
        }
        if (a[sortField] > b[sortField]) {
            return sortDirection === 'asc' ? 1 : -1;
        }
        return 0;
    });


    useEffect(() => {
        // Fetch the user data when the component mounts
        const timer = setTimeout(() => {
            fetchUserData()
                .then(data => {
                    setUsers(data);
                    setLoading(false);
                })
                .catch(error => {
                    console.error('Error setting user data:', error);
                    setLoading(false);
                });
        }, 1000);

        // Clean up timer
        return () => clearTimeout(timer);
    }, []);

    // Function to change the current page 
    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    // Function to change the number of rows per page
    const handleChangeRowsPerPage = event => {
        setRowsPerPage(+event.target.value);
        setPage(0);
    };


    
    const toggleAdminStatus = (userId, isAdmin) => {
        handleActionOpen(
            `Are you sure you want to ${isAdmin ? 'remove' : 'add'} admin privileges for this user?`,
            () => updateAdminStatus(userId, !isAdmin)
        );
    };

    const banUser = (userId) => {
        handleActionOpen(
            'Are you sure you want to ban this user?',
            () => executeBanUser(userId)
        );
    };


    // Function to toggle the admin status of a user
    const updateAdminStatus = async (userId, isAdmin) => {

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
    

    const executeBanUser = async (UserId) => {
        try {
            // Send a POST request to the server to ban the user
            const response = await axios.patch('http://localhost:5002/Users/banUser', {
                userToken: token,
                banUserId: UserId
            });
            console.log("userToken: ", token);
            console.log("banUserId: ", UserId);
            console.log("response: ", response);

            // If the request is successful, update the users array to remove the banned user
            if (response.status === 200) {
                setUsers(prevUsers => prevUsers.filter(user => user.userId !== UserId));
                // Set alert for success
                setAlertMessage('User banned successfully');
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
        <Paper>
            {/* Setup the alert status */}
            <SetAlert 
                open={alertOpen} 
                setOpen={setAlertOpen} 
                severity={alertSeverity} 
                message={alertMessage} 
            />
            {/* Make a search */}
            <TextField
                label="Search Users"
                variant="outlined"
                value={searchText}
                onChange={handleSearchChange}
                style={{ margin: '10px 0' }}
                fullWidth
            />
            <Dialog open={dialogOpen} onClose={handleActionCancel}>
                <DialogTitle>{dialogMessage}</DialogTitle>
                <DialogActions>
                    <Button onClick={handleActionCancel}>Cancel</Button>
                    <Button onClick={handleActionConfirm} color="primary">Confirm</Button>
                </DialogActions>
            </Dialog>
            <TableContainer>
                {/* Display a loading spinner while fetching data */}
                {loading ?
                (
                    <CircularProgress style={{ display: 'block', margin: 'auto' }} />
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
                                        onClick={() => toggleAdminStatus(user.userId, user.isAdmin)}
                                    >
                                        {user.isAdmin ? 'Remove Admin' : 'Add Admin'}
                                    </CustomButton>
                                </TableCell>
                                <TableCell >
                                    {user.status !== "banned" && (
                                        <CustomButton
                                            variant="contained"
                                            color="secondary"
                                            onClick={() => banUser(user.userId)}
                                        >
                                            Ban User
                                        </CustomButton>
                                    )}
                                    {user.status === "banned" }
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
                )}
            </TableContainer>

            {/* Navigate between pages of data displayed within a table */}
            <TablePagination
                rowsPerPageOptions={[5, 10, 25]}
                component="div"
                count={users.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={(_, newPage) => setPage(newPage)}
                onRowsPerPageChange={(event) => setRowsPerPage(+event.target.value)}
            />
        </Paper>
    );
};

export default ViewUsers;
