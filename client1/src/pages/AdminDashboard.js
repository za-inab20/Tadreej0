import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './AdminDashboard.css';
import { FaTrash, FaUserShield, FaUser } from 'react-icons/fa';

const AdminDashboard = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            const response = await axios.get('http://localhost:5000/api/admin/users');
            setUsers(response.data);
            setLoading(false);
        } catch (err) {
            setError('Failed to fetch users');
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this user?')) {
            try {
                await axios.delete(`http://localhost:5000/api/admin/users/${id}`);
                setUsers(users.filter(user => user._id !== id));
            } catch (err) {
                alert('Failed to delete user');
            }
        }
    };

    if (loading) return <div className="admin-loading">Loading...</div>;
    if (error) return <div className="admin-error">{error}</div>;

    return (
        <div className="admin-dashboard">
            <div className="admin-container">
                <div className="admin-header">
                    <h1>admin Dashboard</h1>
                    <p>Manage users and system settings</p>
                </div>

                <div className="users-table-container">
                    <table className="users-table">
                        <thead>
                            <tr>
                                <th>User</th>
                                <th>Email</th>
                                <th>Role</th>
                                <th>Joined</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.map(user => (
                                <tr key={user._id}>
                                    <td>
                                        <div className="user-cell">
                                            <div className="user-avatar">
                                                {user.profilepic && user.profilepic !== 'default.png' ? (
                                                    <img src={user.profilepic} alt={user.uname} />
                                                ) : (
                                                    <FaUser />
                                                )}
                                            </div>
                                            <span>{user.uname}</span>
                                        </div>
                                    </td>
                                    <td>{user.email}</td>
                                    <td>
                                        <span className={`role-badge ${user.role === 'admin' ? 'admin' : 'user'}`}>
                                            {user.role === 'admin' ? <FaUserShield /> : <FaUser />}
                                            {user.role || 'user'}
                                        </span>
                                    </td>
                                    <td>{new Date(user.createdAt).toLocaleDateString()}</td>
                                    <td>
                                        {user.role !== 'admin' && (
                                            <button 
                                                className="delete-btn"
                                                onClick={() => handleDelete(user._id)}
                                                title="Delete User"
                                            >
                                                <FaTrash />
                                            </button>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
