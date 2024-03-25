import React, { useEffect, useState } from 'react';
import '../../GlobalStyles/main.css';


// Get the user data from the server
const fetchUserData = async() => {
    try {
        const response = await fetch('http://localhost:5002/getUsers');
        if (!response.ok) {
            throw new Error('Failed to fetch user data');
        }
        const data = await response.json();
        return data;
    }
    catch (error) {
        console.error('Error fetching user data:', error);
        return [];
    }

};

const UsersTable = () => {

    // State to hold users data
    const [users, setUsers] = useState([]);

    // Fetch users data and set the state
    useEffect(() => {
        fetchUserData()
            .then(data => setUsers(data))
            .catch(error => console.error('Error setting user data:', error));
    }, []);


    return (
        <table>
            <thead>
                <tr>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Status</th>
                    <th>Admin Privileges</th>
                </tr>
            </thead>
            <tbody>
                {users.map((user, index) => (
                    <tr key={index}>
                        <td>{user.fullName}</td>
                        <td>{user.email}</td>
                        <td>{user.status}</td>
                        <td>{user.isAdmin ? 'Yes' : 'No'}</td>
                    </tr>
                ))}
            </tbody>
        </table>
    );
};

export default UsersTable;
