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

    const getStatusLabel = (status) => {
        switch (status) {
            case 'verified':
                return <Chip label="Verified" color="success" />;
            case 'unverified':
                return <Chip label="Unverified" color="warning" />;
            case 'banned':
                return <Chip label="Banned" color="error" />;
            default:
                return <Chip label="Unknown" />;
        }
    };

    
    // Function to toggle the admin status of a user
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
    

    const banUser = async (UserId) => {
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
                            <TableCell style={{ fontWeight: 'bold' }}>Name</TableCell>
                            <TableCell style={{ fontWeight: 'bold' }}>Email</TableCell>
                            <TableCell style={{ fontWeight: 'bold' }}>Status</TableCell>
                            <TableCell style={{ fontWeight: 'bold' }}>Admin Privileges</TableCell>
                            <TableCell style={{ fontWeight: 'bold' }}>Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    {/* Add the user information to the table */}
                    <TableBody>
                        {users
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
                                <TableCell >{user.status}
                                <CustomButton
                                    variant="contained"
                                    color={user.status === "banned" ? "primary" : "secondary"} // Endre farge basert på status
                                    onClick={() => banUser(user.userId)}
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
        </Paper>
    );
};

export default ViewUsers;
