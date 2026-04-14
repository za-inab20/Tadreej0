import React, { useEffect, useMemo, useState } from 'react';
import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';
import { FaPencilAlt, FaPlus, FaSave, FaTrash } from 'react-icons/fa';
import { api, getUserConfig } from '../utils/api';
import './Profile.css';
import './FreelancerStudio.css';

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
    description: 'Your services are visible only to you. Once admin approves your freelancer account, they become public immediately.',
    className: 'pending',
  },
  approved: {
    title: 'Approved freelancer account',
    description: 'Your services are live now. Any new service you add will appear publicly right away.',
    className: 'approved',
  },
  rejected: {
    title: 'Approval needs changes',
    description: 'Your services are still private. Update them and wait for admin approval.',
    className: 'rejected',
  },
};

const FreelancerStudio = () => {
  const { user } = useSelector((state) => state.users);
  const userConfig = useMemo(() => getUserConfig(user), [user]);
  const [serviceForm, setServiceForm] = useState(emptyServiceForm);
  const [serviceItems, setServiceItems] = useState([]);
  const [serviceLoading, setServiceLoading] = useState(false);
  const [serviceMessage, setServiceMessage] = useState('');
  const [editingServiceId, setEditingServiceId] = useState('');
  const [approvalStatus, setApprovalStatus] = useState(user?.freelancerApprovalStatus || 'pending');

  const isFreelancerAccount = user?.accountType === 'freelancer';
  const currentApprovalMeta = approvalMeta[approvalStatus] || approvalMeta.pending;
  const publicServicesCount = serviceItems.filter((item) => (item.publicVisibility || 'public') === 'public').length;
  const privateServicesCount = serviceItems.filter((item) => (item.publicVisibility || 'private') !== 'public').length;
  const visibilitySummary = approvalStatus === 'approved' ? 'Visible to everyone' : 'Private until admin approval';

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
  }, [user?._id]);

  useEffect(() => {
    if (isFreelancerAccount) {
      loadFreelancerServices();
    }
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

  if (!user?.email) {
    return <Navigate to="/login" replace />;
  }

  if (!isFreelancerAccount) {
    return <Navigate to="/profile" replace />;
  }

  return (
    <div className="profile-container full-page freelancer-studio-page">
      <div className="profile-main-content solo-layout">
        <div className="content-header studio-header">
          <div>
            <span className="studio-kicker">Freelancer workspace</span>
            <h2>Freelancer Studio</h2>
            <p>Add, update, and manage your freelancer activities and services. You can prepare everything privately before admin approval.</p>
          </div>
        </div>

        <div className={`studio-approval-card ${currentApprovalMeta.className}`}>
          <div className="studio-approval-copy">
            <span className="studio-status-label">Approval Status</span>
            <h3>{currentApprovalMeta.title}</h3>
            <p>{currentApprovalMeta.description}</p>
          </div>
          <div className="studio-approval-meta">
            <div className={`studio-approval-chip ${currentApprovalMeta.className}`}>{approvalStatus.replace('_', ' ')}</div>
            <span>{serviceItems.length} service{serviceItems.length === 1 ? '' : 's'}</span>
          </div>
        </div>

        <div className="studio-summary-grid">
          <div className="studio-summary-card">
            <span>Total Services</span>
            <strong>{serviceItems.length}</strong>
            <small>Everything you created in your private studio.</small>
          </div>
          <div className="studio-summary-card">
            <span>Current Visibility</span>
            <strong>{visibilitySummary}</strong>
            <small>{approvalStatus === 'approved' ? `${publicServicesCount} public service${publicServicesCount === 1 ? '' : 's'} live now.` : `${privateServicesCount || serviceItems.length} private service${(privateServicesCount || serviceItems.length) === 1 ? '' : 's'} hidden until approval.`}</small>
          </div>
          <div className="studio-summary-card">
            <span>Studio Readiness</span>
            <strong>{serviceItems.length > 0 ? 'Profile ready' : 'Add your first service'}</strong>
            <small>{serviceItems.length > 0 ? 'Keep your listings polished so they publish immediately after approval.' : 'Create at least one service to prepare your freelancer profile.'}</small>
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
              <p>Once admin approves your freelancer account, all private services become visible immediately to everyone.</p>
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
    </div>
  );
};

export default FreelancerStudio;
