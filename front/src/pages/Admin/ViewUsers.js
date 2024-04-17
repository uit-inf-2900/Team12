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
import Button from '@mui/material/Button';


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

    // function to toggle admin 
    const toggleAdminStatus = async (userId, isAdmin) => {
        try {
            const response = await axios.patch(`http://localhost:5002/updateUser/${userId}`, {
                isAdmin: !isAdmin
            });
            if (response.status === 200) {
                setUsers(prevUsers => prevUsers.map(user =>
                    user.id === userId ? { ...user, isAdmin: !user.isAdmin } : user
                ));
                alert('Admin status updated successfully');
            }
        } catch (error) {
            console.error('Error updating admin status:', error);
            alert('Failed to update admin status');
        }
    };



    return (
        <Paper>
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
                                <TableCell>{user.status}</TableCell>
                                <TableCell>{user.isAdmin ? 'Yes' : 'No'}
                                    <Button
                                        style={{alignItems: 'right'}}
                                        variant="contained"
                                        color={user.isAdmin ? "secondary" : "primary"}
                                        onClick={() => toggleAdminStatus(user.id, user.isAdmin)}
                                    >
                                        {user.isAdmin ? 'Remove Admin' : 'Add Admin'}
                                    </Button>
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
