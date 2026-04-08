import React, { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { updateUser } from '../features/UserSlice';
import {
  FaBell,
  FaBriefcase,
  FaCog,
  FaEye,
  FaEyeSlash,
  FaLock,
  FaMoon,
  FaPencilAlt,
  FaPlus,
  FaSave,
  FaSun,
  FaTrash,
  FaUser,
} from 'react-icons/fa';
import { api, getUserConfig } from '../utils/api';
import './Profile.css';

const emptyServiceForm = {
  name: '',
  roleTitle: '',
  category: '',
  hourlyRate: '',
  location: '',
  skills: '',
  languages: 'English',
  responseTime: '~ 1 hour',
  memberSince: '',
  completedJobs: 0,
  about: '',
};

const approvalMeta = {
  pending: {
    title: 'Pending admin approval',
    description: 'Your services are visible only to you. Once an admin approves your freelancer account, every saved service becomes public automatically.',
    className: 'pending',
  },
  approved: {
    title: 'Approved freelancer account',
    description: 'Your services are live for everyone. Any new service you add will be published immediately.',
    className: 'approved',
  },
  rejected: {
    title: 'Approval needs changes',
    description: 'Your services are still private. Update them and wait for an admin to approve your freelancer account.',
    className: 'rejected',
  },
  not_requested: {
    title: 'Freelancer mode inactive',
    description: 'Switch this account to Freelancer from registration or ask an admin to enable it for you.',
    className: 'neutral',
  },
};

const Profile = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user, isLoading } = useSelector((state) => state.users);
  const userConfig = useMemo(() => getUserConfig(user), [user]);

  const [activeTab, setActiveTab] = useState('profile');
  const [formData, setFormData] = useState({
    uname: '',
    email: '',
    profilepic: '',
    oldPassword: '',
    password: '',
    confirmPassword: '',
    theme: 'light',
  });
  const [localMessage, setLocalMessage] = useState('');
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [serviceForm, setServiceForm] = useState(emptyServiceForm);
  const [serviceItems, setServiceItems] = useState([]);
  const [serviceLoading, setServiceLoading] = useState(false);
  const [serviceMessage, setServiceMessage] = useState('');
  const [editingServiceId, setEditingServiceId] = useState('');
  const [approvalStatus, setApprovalStatus] = useState(user?.freelancerApprovalStatus || 'not_requested');

  const isFreelancerAccount = user?.accountType === 'freelancer';
  const currentApprovalMeta = approvalMeta[approvalStatus] || approvalMeta.not_requested;

  useEffect(() => {
    if (user) {
      setFormData((prev) => ({
        ...prev,
        uname: user.uname || '',
        email: user.email || '',
        profilepic: user.profilepic || '',
        theme: user.theme || 'light',
      }));
      setApprovalStatus(user.freelancerApprovalStatus || (user.accountType === 'freelancer' ? 'pending' : 'not_requested'));
    }
  }, [user]);

  useEffect(() => {
    if (!isFreelancerAccount) {
      setServiceItems([]);
      return;
    }

    loadFreelancerServices();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?._id, isFreelancerAccount]);

  const loadFreelancerServices = async () => {
    try {
      setServiceLoading(true);
      const response = await api.get('/api/catalog/my/freelancers', userConfig);
      setServiceItems(Array.isArray(response.data?.items) ? response.data.items : []);
      setApprovalStatus(response.data?.approvalStatus || 'pending');
      setServiceMessage('');
    } catch (error) {
      setServiceMessage(error.response?.data?.message || 'Failed to load your freelancer services.');
    } finally {
      setServiceLoading(false);
    }
  };

  const resetServiceForm = () => {
    setServiceForm({
      ...emptyServiceForm,
      name: user?.uname || '',
      memberSince: new Date().toLocaleString('en-US', { month: 'short', year: 'numeric' }),
    });
    setEditingServiceId('');
  };

  useEffect(() => {
    resetServiceForm();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?._id]);

  const handleChange = (event) => {
    setFormData({
      ...formData,
      [event.target.name]: event.target.value,
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLocalMessage('');

    if (formData.password) {
      if (!formData.oldPassword) {
        setLocalMessage('Please enter your current password');
        return;
      }

      if (formData.password !== formData.confirmPassword) {
        setLocalMessage('Passwords do not match');
        return;
      }
    }

    const updateData = {
      _id: user?._id,
      uname: formData.uname,
      email: formData.email,
      profilepic: formData.profilepic,
      theme: formData.theme,
    };

    if (formData.password) {
      updateData.oldPassword = formData.oldPassword;
      updateData.newPassword = formData.password;
    }

    try {
      const result = await dispatch(updateUser(updateData)).unwrap();
      setLocalMessage('Profile updated successfully!');
      setApprovalStatus(result?.user?.freelancerApprovalStatus || approvalStatus);
      setFormData((prev) => ({
        ...prev,
        oldPassword: '',
        password: '',
        confirmPassword: '',
      }));
    } catch (err) {
      setLocalMessage(err || 'Failed to update profile');
    }
  };


  const handleEnableFreelancerAccount = async () => {
    setLocalMessage('');

    try {
      const result = await dispatch(
        updateUser({
          _id: user?._id,
          accountType: 'freelancer',
          theme: formData.theme,
        })
      ).unwrap();

      setApprovalStatus(result?.user?.freelancerApprovalStatus || 'pending');
      setLocalMessage('Freelancer account request submitted successfully. Your request is now pending. You can manage your services privately until admin approval.');
      navigate('/freelancer-studio');
    } catch (err) {
      setLocalMessage(err || 'Failed to activate freelancer account');
    }
  };

  const handleServiceFormChange = (event) => {
    const { name, value } = event.target;
    setServiceForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleServiceSubmit = async (event) => {
    event.preventDefault();
    setServiceMessage('');

    const payload = {
      ...serviceForm,
      hourlyRate: Number(serviceForm.hourlyRate),
      completedJobs: Number(serviceForm.completedJobs || 0),
    };

    try {
      if (editingServiceId) {
        await api.put(`/api/catalog/my/freelancers/${editingServiceId}`, payload, userConfig);
        setServiceMessage('Freelancer service updated successfully.');
      } else {
        await api.post('/api/catalog/my/freelancers', payload, userConfig);
        setServiceMessage('Freelancer service created successfully.');
      }

      resetServiceForm();
      loadFreelancerServices();
    } catch (error) {
      setServiceMessage(error.response?.data?.message || 'Failed to save freelancer service.');
    }
  };

  const handleEditService = (item) => {
    setEditingServiceId(item._id);
    setServiceForm({
      name: item.name || '',
      roleTitle: item.roleTitle || '',
      category: item.category || '',
      hourlyRate: item.hourlyRate ?? '',
      location: item.location || '',
      skills: Array.isArray(item.skills) ? item.skills.join(', ') : '',
      languages: Array.isArray(item.languages) ? item.languages.join(', ') : 'English',
      responseTime: item.responseTime || '~ 1 hour',
      memberSince: item.memberSince || '',
      completedJobs: item.completedJobs ?? 0,
      about: item.about || '',
    });
    setServiceMessage('Editing selected service.');
  };

  const handleDeleteService = async (id) => {
    if (!window.confirm('Delete this freelancer service?')) return;

    try {
      await api.delete(`/api/catalog/my/freelancers/${id}`, userConfig);
      setServiceItems((current) => current.filter((item) => item._id !== id));
      setServiceMessage('Freelancer service deleted successfully.');
      if (editingServiceId === id) {
        resetServiceForm();
      }
    } catch (error) {
      setServiceMessage(error.response?.data?.message || 'Failed to delete freelancer service.');
    }
  };

  if (!user) return <div className="profile-container">Loading...</div>;

  const contentTitle = activeTab === 'profile'
    ? 'Edit Profile'
    : activeTab === 'settings'
      ? 'Account Settings'
      : 'Freelancer Studio';

  const contentDescription = activeTab === 'profile'
    ? 'Update your personal information'
    : activeTab === 'settings'
      ? 'Manage your password and preferences'
      : 'Create, update, preview, and manage your freelancer services';

  return (
    <div className="profile-container full-page">
      <div className="profile-sidebar-nav">
        <div className="user-mini-profile">
          <img
            src={formData.profilepic || 'https://via.placeholder.com/150'}
            alt="Profile"
            className="profile-avatar-small"
            onError={(event) => {
              event.target.src = 'https://via.placeholder.com/150';
            }}
          />
          <h3>{user.uname}</h3>
          <span className="role-badge">{user.role || 'User'}</span>
          {isFreelancerAccount && (
            <span className={`approval-badge ${currentApprovalMeta.className}`}>
              {currentApprovalMeta.title}
            </span>
          )}
        </div>

        <nav className="profile-nav">
          <button
            type="button"
            className={`nav-item ${activeTab === 'profile' ? 'active' : ''}`}
            onClick={() => setActiveTab('profile')}
          >
            <FaUser /> My Profile
          </button>

          <button
            type="button"
            className={`nav-item ${activeTab === 'settings' ? 'active' : ''}`}
            onClick={() => setActiveTab('settings')}
          >
            <FaCog /> Settings
          </button>

          {isFreelancerAccount && (
            <button
              type="button"
              className={`nav-item ${activeTab === 'freelancer' ? 'active' : ''}`}
              onClick={() => setActiveTab('freelancer')}
            >
              <FaBriefcase /> Freelancer Studio
            </button>
          )}
        </nav>
      </div>

      <div className="profile-main-content">
        <div className="content-header">
          <h2>{contentTitle}</h2>
          <p>{contentDescription}</p>
        </div>

        {activeTab !== 'freelancer' ? (
          <form onSubmit={handleSubmit} className="profile-form">
            {localMessage && (
              <div
                className={`alert ${
                  localMessage.toLowerCase().includes('success') ? 'alert-success' : 'alert-danger'
                }`}
              >
                {localMessage}
              </div>
            )}

            {activeTab === 'profile' && (
              <div className="tab-content fade-in">
                <div className="form-group">
                  <label>Full Name</label>
                  <input type="text" name="uname" value={formData.uname} onChange={handleChange} required />
                </div>

                <div className="form-group">
                  <label>Email Address</label>
                  <input type="email" name="email" value={formData.email} disabled className="input-disabled" />
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
                  <h3>
                    <FaLock /> Security
                  </h3>

                  <div className="form-group password-group">
                    <label>Current Password</label>
                    <div className="password-wrapper">
                      <input
                        type={showOldPassword ? 'text' : 'password'}
                        name="oldPassword"
                        value={formData.oldPassword}
                        onChange={handleChange}
                        placeholder="Enter current password"
                      />
                      <span onClick={() => setShowOldPassword((value) => !value)} style={{ cursor: 'pointer' }}>
                        {showOldPassword ? <FaEyeSlash /> : <FaEye />}
                      </span>
                    </div>
                  </div>

                  <div className="form-group password-group">
                    <label>New Password</label>
                    <div className="password-wrapper">
                      <input
                        type={showNewPassword ? 'text' : 'password'}
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        placeholder="Leave blank to keep current password"
                        minLength="6"
                      />
                      <span onClick={() => setShowNewPassword((value) => !value)} style={{ cursor: 'pointer' }}>
                        {showNewPassword ? <FaEyeSlash /> : <FaEye />}
                      </span>
                    </div>
                  </div>

                  <div className="form-group password-group">
                    <label>Confirm New Password</label>
                    <div className="password-wrapper">
                      <input
                        type={showConfirmPassword ? 'text' : 'password'}
                        name="confirmPassword"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        placeholder="Confirm new password"
                        disabled={!formData.password}
                      />
                      <span onClick={() => setShowConfirmPassword((value) => !value)} style={{ cursor: 'pointer' }}>
                        {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="settings-section">
                  <h3>
                    <FaCog /> Appearance
                  </h3>

                  <div className="theme-mode-group">
                    <button
                      type="button"
                      className={`theme-option ${formData.theme === 'light' ? 'active' : ''}`}
                      onClick={() => setFormData((prev) => ({ ...prev, theme: 'light' }))}
                    >
                      <FaSun />
                      <div>
                        <strong>Light Mode</strong>
                        <span>Bright workspace with soft contrast</span>
                      </div>
                    </button>

                    <button
                      type="button"
                      className={`theme-option ${formData.theme === 'dark' ? 'active' : ''}`}
                      onClick={() => setFormData((prev) => ({ ...prev, theme: 'dark' }))}
                    >
                      <FaMoon />
                      <div>
                        <strong>Dark Mode</strong>
                        <span>Low-glare interface for night use</span>
                      </div>
                    </button>
                  </div>
                </div>

                <div className="settings-section">
                  <h3>
                    <FaBriefcase /> Freelancer Account
                  </h3>

                  <div className={`studio-approval-card compact ${currentApprovalMeta.className}`}>
                    <div>
                      <h3>{isFreelancerAccount ? currentApprovalMeta.title : 'Create freelancer account'}</h3>
                      <p>
                        {isFreelancerAccount
                          ? currentApprovalMeta.description
                          : 'Turn your account into a freelancer account so you can build services, edit them privately, and publish them after admin approval.'}
                      </p>
                    </div>
                    <div className="studio-approval-meta">
                      <span>{isFreelancerAccount ? approvalStatus.replace('_', ' ') : 'not requested'}</span>
                    </div>
                  </div>

                  <div className="freelancer-settings-actions">
                    {!isFreelancerAccount ? (
                      <button type="button" className="btn-save" onClick={handleEnableFreelancerAccount}>
                        Create Freelancer Account
                      </button>
                    ) : (
                      <button type="button" className="btn-ghost" onClick={() => navigate('/freelancer-studio')}>
                        Open Freelancer Studio
                      </button>
                    )}
                  </div>
                </div>

                <div className="settings-section">
                  <h3>
                    <FaBell /> Preferences
                  </h3>

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
        ) : (
          <div className="tab-content fade-in freelancer-studio-layout">
            <div className={`studio-approval-card ${currentApprovalMeta.className}`}>
              <div>
                <h3>{currentApprovalMeta.title}</h3>
                <p>{currentApprovalMeta.description}</p>
              </div>
              <div className="studio-approval-meta">
                <span>{serviceItems.length} service{serviceItems.length === 1 ? '' : 's'}</span>
                <strong>{approvalStatus.replace('_', ' ')}</strong>
              </div>
            </div>

            {serviceMessage && (
              <div className={`alert ${serviceMessage.toLowerCase().includes('success') ? 'alert-success' : 'alert-danger'}`}>
                {serviceMessage}
              </div>
            )}

            <div className="studio-grid">
              <div className="studio-panel">
                <div className="studio-panel-header">
                  <h3>{editingServiceId ? 'Update Service' : 'Add New Service'}</h3>
                  <p>Create a polished freelancer listing. Private services stay visible only to you until approval.</p>
                </div>

                <form className="studio-form" onSubmit={handleServiceSubmit}>
                  <div className="studio-form-grid">
                    <div className="form-group">
                      <label>Display Name</label>
                      <input name="name" value={serviceForm.name} onChange={handleServiceFormChange} placeholder="Your public freelancer name" required />
                    </div>
                    <div className="form-group">
                      <label>Role Title</label>
                      <input name="roleTitle" value={serviceForm.roleTitle} onChange={handleServiceFormChange} placeholder="Full Stack Developer" required />
                    </div>
                    <div className="form-group">
                      <label>Category</label>
                      <input name="category" value={serviceForm.category} onChange={handleServiceFormChange} placeholder="Development, Design, Marketing..." required />
                    </div>
                    <div className="form-group">
                      <label>Hourly Rate</label>
                      <input type="number" min="0" step="0.01" name="hourlyRate" value={serviceForm.hourlyRate} onChange={handleServiceFormChange} placeholder="45" required />
                    </div>
                    <div className="form-group">
                      <label>Location</label>
                      <input name="location" value={serviceForm.location} onChange={handleServiceFormChange} placeholder="Muscat, Oman" />
                    </div>
                    <div className="form-group">
                      <label>Completed Jobs</label>
                      <input type="number" min="0" name="completedJobs" value={serviceForm.completedJobs} onChange={handleServiceFormChange} placeholder="0" />
                    </div>
                    <div className="form-group">
                      <label>Skills</label>
                      <input name="skills" value={serviceForm.skills} onChange={handleServiceFormChange} placeholder="React, Node.js, UI Design" />
                    </div>
                    <div className="form-group">
                      <label>Languages</label>
                      <input name="languages" value={serviceForm.languages} onChange={handleServiceFormChange} placeholder="English, Arabic" />
                    </div>
                    <div className="form-group">
                      <label>Response Time</label>
                      <input name="responseTime" value={serviceForm.responseTime} onChange={handleServiceFormChange} placeholder="~ 1 hour" />
                    </div>
                    <div className="form-group">
                      <label>Member Since</label>
                      <input name="memberSince" value={serviceForm.memberSince} onChange={handleServiceFormChange} placeholder="Mar 2026" />
                    </div>
                  </div>

                  <div className="form-group">
                    <label>About Service</label>
                    <textarea
                      name="about"
                      value={serviceForm.about}
                      onChange={handleServiceFormChange}
                      rows="5"
                      placeholder="Describe the value you deliver, your workflow, and what clients can expect."
                    />
                  </div>

                  <div className="studio-actions">
                    <button type="submit" className="btn-save" disabled={serviceLoading}>
                      {editingServiceId ? <><FaSave /> Save Service</> : <><FaPlus /> Add Service</>}
                    </button>
                    {editingServiceId && (
                      <button type="button" className="btn-ghost" onClick={resetServiceForm}>
                        Cancel Edit
                      </button>
                    )}
                  </div>
                </form>
              </div>

              <div className="studio-panel">
                <div className="studio-panel-header">
                  <h3>Your Services</h3>
                  <p>Private services stay hidden from the public catalog until your freelancer account is approved by admin.</p>
                </div>

                {serviceLoading ? (
                  <div className="studio-empty">Loading your freelancer services...</div>
                ) : serviceItems.length === 0 ? (
                  <div className="studio-empty">You have not added any freelancer services yet.</div>
                ) : (
                  <div className="studio-service-list">
                    {serviceItems.map((item) => (
                      <div key={item._id} className="studio-service-card">
                        <div className="studio-service-top">
                          <div>
                            <h4>{item.name}</h4>
                            <p>{item.roleTitle}</p>
                          </div>
                          <span className={`visibility-pill ${(item.publicVisibility || 'public') === 'public' ? 'public' : 'private'}`}>
                            {(item.publicVisibility || 'public') === 'public' ? 'Public' : 'Private'}
                          </span>
                        </div>

                        <div className="studio-service-meta">
                          <span>{item.category}</span>
                          <span>${item.hourlyRate}/hr</span>
                          <span>{item.location || 'Remote'}</span>
                        </div>

                        <p className="studio-service-about">{item.about || 'No description added yet.'}</p>

                        <div className="studio-skill-list">
                          {(item.skills || []).slice(0, 5).map((skill, index) => (
                            <span key={index}>{skill}</span>
                          ))}
                        </div>

                        <div className="studio-card-actions">
                          <button type="button" className="btn-inline edit" onClick={() => handleEditService(item)}>
                            <FaPencilAlt /> Edit
                          </button>
                          <button type="button" className="btn-inline delete" onClick={() => handleDeleteService(item._id)}>
                            <FaTrash /> Delete
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;
