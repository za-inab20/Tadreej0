import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { updateUser } from '../features/UserSlice';
import { FaUser, FaCog, FaLock, FaBell, FaMoon } from 'react-icons/fa';
import './Profile.css';

const Profile = () => {
    const dispatch = useDispatch();
    const { user, isLoading, isError, message } = useSelector((state) => state.users);
    const [activeTab, setActiveTab] = useState('profile');
    
    const [formData, setFormData] = useState({
        uname: '',
        email: '',
        profilepic: '',
        password: '',
        confirmPassword: ''
    });

    const [localMessage, setLocalMessage] = useState('');

    useEffect(() => {
        if (user) {
            setFormData(prev => ({
                ...prev,
                uname: user.uname || '',
                email: user.email || '',
                profilepic: user.profilepic || ''
            }));
        }
    }, [user]);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLocalMessage('');

        if (formData.password && formData.password !== formData.confirmPassword) {
            setLocalMessage('Passwords do not match');
            return;
        }

        const updateData = {
            _id: user._id,
            uname: formData.uname,
            email: formData.email,
            profilepic: formData.profilepic
        };

        if (formData.password) {
            updateData.password = formData.password;
        }

        try {
            await dispatch(updateUser(updateData)).unwrap();
            setLocalMessage('Profile updated successfully!');
            setFormData(prev => ({ ...prev, password: '', confirmPassword: '' }));
        } catch (err) {
            setLocalMessage(err || 'Failed to update profile');
        }
    };

    if (!user) return <div className="profile-container">Loading...</div>;

    return (
        <div className="profile-container full-page">
            <div className="profile-sidebar-nav">
                <div className="user-mini-profile">
                    <img 
                        src={formData.profilepic || "https://via.placeholder.com/150"} 
                        alt="Profile" 
                        className="profile-avatar-small"
                        onError={(e) => { e.target.src = "https://via.placeholder.com/150" }}
                    />
                    <h3>{user.uname}</h3>
                    <span className="role-badge">{user.role || 'User'}</span>
                </div>
                
                <nav className="profile-nav">
                    <button 
                        className={`nav-item ${activeTab === 'profile' ? 'active' : ''}`}
                        onClick={() => setActiveTab('profile')}
                    >
                        <FaUser /> My Profile
                    </button>
                    <button 
                        className={`nav-item ${activeTab === 'settings' ? 'active' : ''}`}
                        onClick={() => setActiveTab('settings')}
                    >
                        <FaCog /> Settings
                    </button>
                </nav>
            </div>

            <div className="profile-main-content">
                <div className="content-header">
                    <h2>{activeTab === 'profile' ? 'Edit Profile' : 'Account Settings'}</h2>
                    <p>{activeTab === 'profile' ? 'Update your personal information' : 'Manage your password and preferences'}</p>
                </div>

                <form onSubmit={handleSubmit} className="profile-form">
                    {localMessage && (
                        <div className={`alert ${localMessage.includes('success') ? 'alert-success' : 'alert-danger'}`}>
                            {localMessage}
                        </div>
                    )}

                    {activeTab === 'profile' && (
                        <div className="tab-content fade-in">
                            <div className="form-group">
                                <label>Full Name</label>
                                <input
                                    type="text"
                                    name="uname"
                                    value={formData.uname}
                                    onChange={handleChange}
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label>Email Address</label>
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    disabled
                                    className="input-disabled"
                                />
                                <small className="text-muted">Email cannot be changed</small>
                            </div>

                            <div className="form-group">
                                <label>Profile Picture URL</label>
                                <input
                                    type="url"
                                    name="profilepic"
                                    value={formData.profilepic}
                                    onChange={handleChange}
                                    placeholder="https://example.com/avatar.jpg"
                                />
                            </div>
                            
                            <div className="profile-actions">
                                <button type="submit" className="btn-save" disabled={isLoading}>
                                    {isLoading ? 'Saving...' : 'Save Changes'}
                                </button>
                            </div>
                        </div>
                    )}

                    {activeTab === 'settings' && (
                        <div className="tab-content fade-in">
                            <div className="settings-section">
                                <h3><FaLock /> Security</h3>
                                <div className="form-group">
                                    <label>New Password</label>
                                    <input
                                        type="password"
                                        name="password"
                                        value={formData.password}
                                        onChange={handleChange}
                                        placeholder="Leave blank to keep current password"
                                        minLength="6"
                                    />
                                </div>

                                <div className="form-group">
                                    <label>Confirm New Password</label>
                                    <input
                                        type="password"
                                        name="confirmPassword"
                                        value={formData.confirmPassword}
                                        onChange={handleChange}
                                        placeholder="Confirm new password"
                                        disabled={!formData.password}
                                    />
                                </div>
                            </div>

                            <div className="settings-section">
                                <h3><FaBell /> Preferences</h3>
                                <div className="preference-item">
                                    <div className="pref-info">
                                        <h4>Email Notifications</h4>
                                        <p>Receive emails about your account activity</p>
                                    </div>
                                    <label className="switch">
                                        <input type="checkbox" defaultChecked />
                                        <span className="slider round"></span>
                                    </label>
                                </div>
                                <div className="preference-item">
                                    <div className="pref-info">
                                        <h4>Marketing Emails</h4>
                                        <p>Receive emails about new features and offers</p>
                                    </div>
                                    <label className="switch">
                                        <input type="checkbox" />
                                        <span className="slider round"></span>
                                    </label>
                                </div>
                            </div>

                            <div className="profile-actions">
                                <button type="submit" className="btn-save" disabled={isLoading}>
                                    {isLoading ? 'Saving...' : 'Save Settings'}
                                </button>
                            </div>
                        </div>
                    )}
                </form>
            </div>
        </div>
    );
};

export default Profile;