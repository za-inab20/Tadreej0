import React, { useEffect, useMemo, useState } from 'react';
import './AdminDashboard.css';
import {
  FaBook,
  FaChartLine,
  FaCheckCircle,
  FaDownload,
  FaEdit,
  FaPlus,
  FaSave,
  FaTrash,
  FaUserShield,
  FaUsers,
  FaUserTie,
} from 'react-icons/fa';
import { useUserAuth } from '../context/UserAuthContext';
import { api, getAdminConfig } from '../utils/api';

const emptyCourseForm = {
  title: '',
  instructor: '',
  category: '',
  level: 'Beginner',
  price: '',
  duration: '',
  rating: 0,
  reviews: 0,
  description: '',
};

const emptyFreelancerForm = {
  name: '',
  roleTitle: '',
  category: '',
  hourlyRate: '',
  rating: 0,
  reviews: 0,
  completedJobs: 0,
  location: '',
  skills: '',
  languages: 'English',
  responseTime: '~ 1 hour',
  memberSince: '',
  about: '',
};

const approvalOptions = [
  { value: 'pending', label: 'Pending' },
  { value: 'approved', label: 'Approved' },
  { value: 'rejected', label: 'Rejected' },
];

const getApprovalBadgeMeta = (status) => {
  switch (status) {
    case 'approved':
      return { label: 'Approved', className: 'approved' };
    case 'rejected':
      return { label: 'Rejected', className: 'rejected' };
    case 'pending':
    default:
      return { label: 'Pending', className: 'pending' };
  }
};

const AdminDashboard = () => {
  const { user } = useUserAuth();
  const adminConfig = useMemo(() => getAdminConfig(user), [user]);

  const [activeTab, setActiveTab] = useState('overview');
  const [overview, setOverview] = useState(null);
  const [users, setUsers] = useState([]);
  const [courses, setCourses] = useState([]);
  const [freelancers, setFreelancers] = useState([]);
  const [reports, setReports] = useState({ monthlyReport: null, sixMonthReport: [] });
  const [courseForm, setCourseForm] = useState(emptyCourseForm);
  const [freelancerForm, setFreelancerForm] = useState(emptyFreelancerForm);
  const [editingCourseId, setEditingCourseId] = useState('');
  const [editingFreelancerId, setEditingFreelancerId] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [actionMessage, setActionMessage] = useState('');

  const pendingApprovals = users.filter(
    (item) => item.accountType === 'freelancer' && item.freelancerApprovalStatus === 'pending'
  ).length;

  const downloadCsvFile = (filename, rows) => {
    const escapeCsvValue = (value) => {
      if (value === null || value === undefined) return '';
      const stringValue = String(value).replace(/"/g, '""');
      return /[",\n]/.test(stringValue) ? `"${stringValue}"` : stringValue;
    };

    const csvContent = rows
      .map((row) => row.map((value) => escapeCsvValue(value)).join(','))
      .join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  };

  const handleDownloadMonthlyReport = () => {
    if (!reports.monthlyReport) {
      setActionMessage('Monthly report is not available yet.');
      return;
    }

    const report = reports.monthlyReport;
    const rows = [
      ['Report Type', 'Monthly Report'],
      ['Period', report.label || 'Current Month'],
      [],
      ['Metric', 'Value'],
      ['New Users', report.newUsers ?? 0],
      ['New Courses', report.newCourses ?? 0],
      ['New Freelancer Services', report.newFreelancers ?? 0],
      ['Approved Freelancer Accounts', report.approvedFreelancersThisMonth ?? 0],
      ['Total Users', report.totalUsers ?? 0],
      ['Total Courses', report.totalCourses ?? 0],
      ['Total Freelancer Services', report.totalFreelancers ?? 0],
      ['Public Freelancer Services', report.totalPublicFreelancers ?? 0],
      ['Pending Freelancer Approvals', report.pendingFreelancerApprovals ?? 0],
    ];

    const safeLabel = (report.label || 'monthly-report').replace(/\s+/g, '-').toLowerCase();
    downloadCsvFile(`${safeLabel}.csv`, rows);
    setActionMessage('Monthly report CSV downloaded successfully.');
  };

  const handleDownloadSixMonthReport = () => {
    if (!reports.sixMonthReport?.length) {
      setActionMessage('Six-month report is not available yet.');
      return;
    }

    const rows = [
      ['Report Type', 'Six-Month Report'],
      [],
      ['Month', 'Users', 'Courses', 'Freelancer Services', 'Freelancer Approvals'],
      ...reports.sixMonthReport.map((row) => [
        row.label,
        row.users ?? 0,
        row.courses ?? 0,
        row.freelancers ?? 0,
        row.freelancerApprovals ?? 0,
      ]),
    ];

    downloadCsvFile('six-month-report.csv', rows);
    setActionMessage('Six-month report CSV downloaded successfully.');
  };

  useEffect(() => {
    fetchAllAdminData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchAllAdminData = async () => {
    try {
      setLoading(true);
      setError('');

      const [overviewResponse, usersResponse, coursesResponse, freelancersResponse, reportsResponse] = await Promise.all([
        api.get('/api/admin/overview', adminConfig),
        api.get('/api/admin/users', adminConfig),
        api.get('/api/admin/courses', adminConfig),
        api.get('/api/admin/freelancers', adminConfig),
        api.get('/api/admin/reports', adminConfig),
      ]);

      setOverview(overviewResponse.data);
      setUsers(usersResponse.data);
      setCourses(coursesResponse.data);
      setFreelancers(freelancersResponse.data);
      setReports(reportsResponse.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load admin dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const handleUserFieldChange = (id, field, value) => {
    setUsers((current) => current.map((item) => (item._id === id ? { ...item, [field]: value } : item)));
  };

  const handleQuickApproval = async (targetUser, status) => {
    try {
      await api.put(
        `/api/admin/users/${targetUser._id}`,
        {
          uname: targetUser.uname,
          email: targetUser.email,
          role: targetUser.role,
          accountType: 'freelancer',
          freelancerApprovalStatus: status,
        },
        adminConfig
      );
      setActionMessage(`Freelancer account marked as ${status}.`);
      fetchAllAdminData();
    } catch (err) {
      setActionMessage(err.response?.data?.message || 'Failed to update freelancer approval.');
    }
  };

  const handleSaveUser = async (targetUser) => {
    try {
      await api.put(
        `/api/admin/users/${targetUser._id}`,
        {
          uname: targetUser.uname,
          email: targetUser.email,
          role: targetUser.role,
          accountType: targetUser.accountType,
          freelancerApprovalStatus:
            targetUser.accountType === 'freelancer'
              ? targetUser.freelancerApprovalStatus || 'pending'
              : 'not_requested',
        },
        adminConfig
      );
      setActionMessage('User updated successfully.');
      fetchAllAdminData();
    } catch (err) {
      setActionMessage(err.response?.data?.message || 'Failed to update user.');
    }
  };

  const handleDeleteUser = async (id) => {
    if (!window.confirm('Delete this user?')) return;

    try {
      await api.delete(`/api/admin/users/${id}`, adminConfig);
      setUsers((current) => current.filter((item) => item._id !== id));
      setActionMessage('User deleted successfully.');
      fetchAllAdminData();
    } catch (err) {
      setActionMessage(err.response?.data?.message || 'Failed to delete user.');
    }
  };

  const handleCourseSubmit = async (event) => {
    event.preventDefault();

    const payload = {
      ...courseForm,
      price: Number(courseForm.price),
      rating: Number(courseForm.rating),
      reviews: Number(courseForm.reviews),
    };

    try {
      if (editingCourseId) {
        await api.put(`/api/admin/courses/${editingCourseId}`, payload, adminConfig);
        setActionMessage('Course updated successfully.');
      } else {
        await api.post('/api/admin/courses', payload, adminConfig);
        setActionMessage('Course created successfully.');
      }

      setCourseForm(emptyCourseForm);
      setEditingCourseId('');
      fetchAllAdminData();
    } catch (err) {
      setActionMessage(err.response?.data?.message || 'Failed to save course.');
    }
  };

  const handleEditCourse = (course) => {
    setActiveTab('courses');
    setEditingCourseId(course._id);
    setCourseForm({
      title: course.title || '',
      instructor: course.instructor || '',
      category: course.category || '',
      level: course.level || 'Beginner',
      price: course.price ?? '',
      duration: course.duration || '',
      rating: course.rating ?? 0,
      reviews: course.reviews ?? 0,
      description: course.description || '',
    });
  };

  const handleDeleteCourse = async (id) => {
    if (!window.confirm('Delete this course?')) return;

    try {
      await api.delete(`/api/admin/courses/${id}`, adminConfig);
      setCourses((current) => current.filter((item) => item._id !== id));
      setActionMessage('Course deleted successfully.');
    } catch (err) {
      setActionMessage(err.response?.data?.message || 'Failed to delete course.');
    }
  };

  const handleFreelancerSubmit = async (event) => {
    event.preventDefault();

    const payload = {
      ...freelancerForm,
      hourlyRate: Number(freelancerForm.hourlyRate),
      rating: Number(freelancerForm.rating),
      reviews: Number(freelancerForm.reviews),
      completedJobs: Number(freelancerForm.completedJobs),
    };

    try {
      if (editingFreelancerId) {
        await api.put(`/api/admin/freelancers/${editingFreelancerId}`, payload, adminConfig);
        setActionMessage('Freelancer updated successfully.');
      } else {
        await api.post('/api/admin/freelancers', payload, adminConfig);
        setActionMessage('Freelancer created successfully.');
      }

      setFreelancerForm(emptyFreelancerForm);
      setEditingFreelancerId('');
      fetchAllAdminData();
    } catch (err) {
      setActionMessage(err.response?.data?.message || 'Failed to save freelancer.');
    }
  };

  const handleEditFreelancer = (freelancer) => {
    setActiveTab('freelancers');
    setEditingFreelancerId(freelancer._id);
    setFreelancerForm({
      name: freelancer.name || '',
      roleTitle: freelancer.roleTitle || '',
      category: freelancer.category || '',
      hourlyRate: freelancer.hourlyRate ?? '',
      rating: freelancer.rating ?? 0,
      reviews: freelancer.reviews ?? 0,
      completedJobs: freelancer.completedJobs ?? 0,
      location: freelancer.location || '',
      skills: Array.isArray(freelancer.skills) ? freelancer.skills.join(', ') : '',
      languages: Array.isArray(freelancer.languages) ? freelancer.languages.join(', ') : 'English',
      responseTime: freelancer.responseTime || '~ 1 hour',
      memberSince: freelancer.memberSince || '',
      about: freelancer.about || '',
    });
  };

  const handleDeleteFreelancer = async (id) => {
    if (!window.confirm('Delete this freelancer service?')) return;

    try {
      await api.delete(`/api/admin/freelancers/${id}`, adminConfig);
      setFreelancers((current) => current.filter((item) => item._id !== id));
      setActionMessage('Freelancer deleted successfully.');
    } catch (err) {
      setActionMessage(err.response?.data?.message || 'Failed to delete freelancer.');
    }
  };

  const tabs = [
    { key: 'overview', label: 'Overview', icon: <FaChartLine /> },
    { key: 'users', label: 'Users', icon: <FaUsers /> },
    { key: 'courses', label: 'Courses', icon: <FaBook /> },
    { key: 'freelancers', label: 'Freelancers', icon: <FaUserTie /> },
    { key: 'reports', label: 'Reports', icon: <FaChartLine /> },
  ];

  if (loading) return <div className="admin-loading">Loading admin dashboard...</div>;
  if (error) return <div className="admin-error">{error}</div>;

  return (
    <div className="admin-dashboard">
      <div className="admin-container">
        <div className="admin-header">
          <div>
            <h1>Admin Dashboard</h1>
            <p>Manage users, courses, freelancer services, approvals, and monthly or six-month reports.</p>
          </div>
          <button className="refresh-btn" onClick={fetchAllAdminData}>Refresh Data</button>
        </div>

        {actionMessage && <div className="admin-alert">{actionMessage}</div>}

        <div className="tab-bar">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              className={`tab-btn ${activeTab === tab.key ? 'active' : ''}`}
              onClick={() => setActiveTab(tab.key)}
            >
              {tab.icon} {tab.label}
            </button>
          ))}
        </div>

        {activeTab === 'overview' && (
          <div className="admin-section">
            <div className="metrics-grid">
              <div className="metric-card">
                <FaUsers />
                <h3>Total Users</h3>
                <strong>{overview?.metrics?.usersCount ?? 0}</strong>
              </div>
              <div className="metric-card">
                <FaUserShield />
                <h3>Admins</h3>
                <strong>{overview?.metrics?.adminsCount ?? 0}</strong>
              </div>
              <div className="metric-card">
                <FaBook />
                <h3>Courses</h3>
                <strong>{overview?.metrics?.coursesCount ?? 0}</strong>
              </div>
              <div className="metric-card">
                <FaUserTie />
                <h3>Freelancer Services</h3>
                <strong>{overview?.metrics?.freelancersCount ?? 0}</strong>
              </div>
              <div className="metric-card">
                <FaCheckCircle />
                <h3>Pending Approvals</h3>
                <strong>{overview?.metrics?.pendingFreelancerApprovals ?? pendingApprovals}</strong>
              </div>
            </div>

            <div className="overview-grid">
              <div className="panel-card">
                <h3>Recent Users</h3>
                {overview?.recentUsers?.map((item) => (
                  <div key={item._id} className="list-row compact">
                    <div>
                      <strong>{item.uname}</strong>
                      <p>{item.email}</p>
                    </div>
                    <span className={`role-badge ${item.role === 'admin' ? 'admin' : 'user'}`}>{item.role}</span>
                  </div>
                ))}
              </div>

              <div className="panel-card">
                <h3>Recent Courses</h3>
                {overview?.recentCourses?.map((item) => (
                  <div key={item._id} className="list-row compact">
                    <div>
                      <strong>{item.title}</strong>
                      <p>{item.instructor}</p>
                    </div>
                    <span className="pill">{item.category}</span>
                  </div>
                ))}
              </div>

              <div className="panel-card">
                <h3>Recent Freelancer Services</h3>
                {overview?.recentFreelancers?.map((item) => (
                  <div key={item._id} className="list-row compact">
                    <div>
                      <strong>{item.name}</strong>
                      <p>{item.roleTitle}</p>
                    </div>
                    <span className={`status-pill ${(item.publicVisibility || 'public') === 'public' ? 'public' : 'private'}`}>
                      {item.publicVisibility || 'public'}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'users' && (
          <div className="admin-section">
            <div className="admin-note">
              <strong>{pendingApprovals}</strong> freelancer account{pendingApprovals === 1 ? '' : 's'} waiting for approval.
              Approving a freelancer user instantly publishes all of their saved services.
            </div>
            <div className="table-card">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Account Type</th>
                    <th>Freelancer Approval</th>
                    <th>Role</th>
                    <th>Joined</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((targetUser) => (
                    <tr key={targetUser._id}>
                      <td>
                        <input
                          className="table-input"
                          value={targetUser.uname || ''}
                          onChange={(e) => handleUserFieldChange(targetUser._id, 'uname', e.target.value)}
                        />
                      </td>
                      <td>
                        <input
                          className="table-input"
                          value={targetUser.email || ''}
                          onChange={(e) => handleUserFieldChange(targetUser._id, 'email', e.target.value)}
                        />
                      </td>
                      <td>
                        <select
                          className="table-input"
                          value={targetUser.accountType || 'user'}
                          onChange={(e) => handleUserFieldChange(targetUser._id, 'accountType', e.target.value)}
                        >
                          <option value="user">User</option>
                          <option value="freelancer">Freelancer</option>
                        </select>
                      </td>
                      <td>
                        {targetUser.accountType === 'freelancer' ? (() => {
                          const approvalMeta = getApprovalBadgeMeta(targetUser.freelancerApprovalStatus || 'pending');

                          return (
                            <div className="approval-cell">
                              <span className={`request-status-badge ${approvalMeta.className}`}>
                                {approvalMeta.label}
                              </span>
                              <select
                                className={`table-input approval-select ${approvalMeta.className}`}
                                value={targetUser.freelancerApprovalStatus || 'pending'}
                                onChange={(e) => handleUserFieldChange(targetUser._id, 'freelancerApprovalStatus', e.target.value)}
                              >
                                {approvalOptions.map((option) => (
                                  <option key={option.value} value={option.value}>
                                    {option.label}
                                  </option>
                                ))}
                              </select>
                              <div className="approval-action-row">
                                <button
                                  className="mini-approve-btn"
                                  onClick={() => handleQuickApproval(targetUser, 'approved')}
                                  title="Approve freelancer account"
                                >
                                  Approve
                                </button>
                                <button
                                  className="mini-reject-btn"
                                  onClick={() => handleQuickApproval(targetUser, 'rejected')}
                                  title="Reject freelancer account"
                                >
                                  Reject
                                </button>
                              </div>
                            </div>
                          );
                        })() : (
                          <span className="muted-text">Not freelancer</span>
                        )}
                      </td>
                      <td>
                        <select
                          className="table-input"
                          value={targetUser.role || 'user'}
                          onChange={(e) => handleUserFieldChange(targetUser._id, 'role', e.target.value)}
                        >
                          <option value="user">User</option>
                          <option value="admin">Admin</option>
                        </select>
                      </td>
                      <td>{new Date(targetUser.createdAt).toLocaleDateString()}</td>
                      <td>
                        <div className="action-row">
                          <button className="icon-btn save" onClick={() => handleSaveUser(targetUser)} title="Save user">
                            <FaSave />
                          </button>
                          <button className="icon-btn delete" onClick={() => handleDeleteUser(targetUser._id)} title="Delete user">
                            <FaTrash />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'courses' && (
          <div className="admin-section two-column">
            <div className="panel-card">
              <h3>{editingCourseId ? 'Update Course' : 'Add Course'}</h3>
              <form className="admin-form" onSubmit={handleCourseSubmit}>
                <input value={courseForm.title} onChange={(e) => setCourseForm({ ...courseForm, title: e.target.value })} placeholder="Course title" />
                <input value={courseForm.instructor} onChange={(e) => setCourseForm({ ...courseForm, instructor: e.target.value })} placeholder="Instructor" />
                <div className="form-grid">
                  <input value={courseForm.category} onChange={(e) => setCourseForm({ ...courseForm, category: e.target.value })} placeholder="Category" />
                  <select value={courseForm.level} onChange={(e) => setCourseForm({ ...courseForm, level: e.target.value })}>
                    <option value="Beginner">Beginner</option>
                    <option value="Intermediate">Intermediate</option>
                    <option value="Advanced">Advanced</option>
                  </select>
                  <input type="number" min="0" step="0.01" value={courseForm.price} onChange={(e) => setCourseForm({ ...courseForm, price: e.target.value })} placeholder="Price" />
                  <input value={courseForm.duration} onChange={(e) => setCourseForm({ ...courseForm, duration: e.target.value })} placeholder="Duration" />
                  <input type="number" min="0" max="5" step="0.1" value={courseForm.rating} onChange={(e) => setCourseForm({ ...courseForm, rating: e.target.value })} placeholder="Rating" />
                  <input type="number" min="0" value={courseForm.reviews} onChange={(e) => setCourseForm({ ...courseForm, reviews: e.target.value })} placeholder="Reviews" />
                </div>
                <textarea value={courseForm.description} onChange={(e) => setCourseForm({ ...courseForm, description: e.target.value })} placeholder="Description" rows="5" />
                <div className="action-row wide">
                  <button type="submit" className="primary-btn">
                    {editingCourseId ? <><FaSave /> Save Course</> : <><FaPlus /> Add Course</>}
                  </button>
                  {editingCourseId && (
                    <button type="button" className="secondary-btn" onClick={() => { setEditingCourseId(''); setCourseForm(emptyCourseForm); }}>
                      Cancel Edit
                    </button>
                  )}
                </div>
              </form>
            </div>

            <div className="table-card">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Course</th>
                    <th>Category</th>
                    <th>Price</th>
                    <th>Level</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {courses.map((course) => (
                    <tr key={course._id}>
                      <td>
                        <strong>{course.title}</strong>
                        <div className="muted-text">{course.instructor}</div>
                      </td>
                      <td>{course.category}</td>
                      <td>${course.price}</td>
                      <td>{course.level}</td>
                      <td>
                        <div className="action-row">
                          <button className="icon-btn edit" onClick={() => handleEditCourse(course)} title="Edit course">
                            <FaEdit />
                          </button>
                          <button className="icon-btn delete" onClick={() => handleDeleteCourse(course._id)} title="Delete course">
                            <FaTrash />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'freelancers' && (
          <div className="admin-section two-column">
            <div className="panel-card">
              <h3>{editingFreelancerId ? 'Update Freelancer Service' : 'Add Freelancer Service'}</h3>
              <form className="admin-form" onSubmit={handleFreelancerSubmit}>
                <input value={freelancerForm.name} onChange={(e) => setFreelancerForm({ ...freelancerForm, name: e.target.value })} placeholder="Freelancer name" />
                <input value={freelancerForm.roleTitle} onChange={(e) => setFreelancerForm({ ...freelancerForm, roleTitle: e.target.value })} placeholder="Role title" />
                <div className="form-grid">
                  <input value={freelancerForm.category} onChange={(e) => setFreelancerForm({ ...freelancerForm, category: e.target.value })} placeholder="Category" />
                  <input type="number" min="0" step="0.01" value={freelancerForm.hourlyRate} onChange={(e) => setFreelancerForm({ ...freelancerForm, hourlyRate: e.target.value })} placeholder="Hourly rate" />
                  <input value={freelancerForm.location} onChange={(e) => setFreelancerForm({ ...freelancerForm, location: e.target.value })} placeholder="Location" />
                  <input type="number" min="0" value={freelancerForm.completedJobs} onChange={(e) => setFreelancerForm({ ...freelancerForm, completedJobs: e.target.value })} placeholder="Completed jobs" />
                  <input value={freelancerForm.skills} onChange={(e) => setFreelancerForm({ ...freelancerForm, skills: e.target.value })} placeholder="Skills (comma separated)" />
                  <input value={freelancerForm.languages} onChange={(e) => setFreelancerForm({ ...freelancerForm, languages: e.target.value })} placeholder="Languages" />
                </div>
                <textarea value={freelancerForm.about} onChange={(e) => setFreelancerForm({ ...freelancerForm, about: e.target.value })} placeholder="About freelancer service" rows="5" />
                <div className="action-row wide">
                  <button type="submit" className="primary-btn">
                    {editingFreelancerId ? <><FaSave /> Save Service</> : <><FaPlus /> Add Service</>}
                  </button>
                  {editingFreelancerId && (
                    <button type="button" className="secondary-btn" onClick={() => { setEditingFreelancerId(''); setFreelancerForm(emptyFreelancerForm); }}>
                      Cancel Edit
                    </button>
                  )}
                </div>
              </form>
            </div>

            <div className="table-card">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Owner</th>
                    <th>Source</th>
                    <th>Visibility</th>
                    <th>Rate</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {freelancers.map((freelancer) => (
                    <tr key={freelancer._id}>
                      <td>
                        <strong>{freelancer.name}</strong>
                        <div className="muted-text">{freelancer.roleTitle}</div>
                      </td>
                      <td>
                        {freelancer.ownerName ? (
                          <>
                            <strong>{freelancer.ownerName}</strong>
                            <div className="muted-text">{freelancer.ownerEmail}</div>
                          </>
                        ) : (
                          <span className="muted-text">Admin listing</span>
                        )}
                      </td>
                      <td>
                        <span className="pill">{freelancer.sourceType || 'admin'}</span>
                      </td>
                      <td>
                        <span className={`status-pill ${(freelancer.publicVisibility || 'public') === 'public' ? 'public' : 'private'}`}>
                          {freelancer.publicVisibility || 'public'}
                        </span>
                      </td>
                      <td>${freelancer.hourlyRate}</td>
                      <td>
                        <div className="action-row">
                          <button className="icon-btn edit" onClick={() => handleEditFreelancer(freelancer)} title="Edit freelancer service">
                            <FaEdit />
                          </button>
                          <button className="icon-btn delete" onClick={() => handleDeleteFreelancer(freelancer._id)} title="Delete freelancer service">
                            <FaTrash />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'reports' && (
          <div className="admin-section">
            <div className="report-toolbar">
              <div>
                <h2>Reports Center</h2>
                <p>Download monthly and six-month reports including freelancer approval activity.</p>
              </div>
              <div className="action-row report-actions">
                <button className="primary-btn download-btn" onClick={handleDownloadMonthlyReport}>
                  <FaDownload /> Download Monthly CSV
                </button>
                <button className="secondary-btn download-btn" onClick={handleDownloadSixMonthReport}>
                  <FaDownload /> Download Six-Month CSV
                </button>
              </div>
            </div>

            <div className="overview-grid report-grid">
              <div className="panel-card">
                <div className="panel-header">
                  <div>
                    <h3>Monthly Report</h3>
                    <p>{reports?.monthlyReport?.label || 'Current month'}</p>
                  </div>
                  <button className="secondary-btn inline-download-btn" onClick={handleDownloadMonthlyReport}>
                    <FaDownload /> CSV
                  </button>
                </div>
                <div className="report-lines">
                  <p><strong>New Users:</strong> {reports?.monthlyReport?.newUsers ?? 0}</p>
                  <p><strong>New Courses:</strong> {reports?.monthlyReport?.newCourses ?? 0}</p>
                  <p><strong>New Freelancer Services:</strong> {reports?.monthlyReport?.newFreelancers ?? 0}</p>
                  <p><strong>Approved Freelancer Accounts:</strong> {reports?.monthlyReport?.approvedFreelancersThisMonth ?? 0}</p>
                  <p><strong>Public Freelancer Services:</strong> {reports?.monthlyReport?.totalPublicFreelancers ?? 0}</p>
                  <p><strong>Pending Approvals:</strong> {reports?.monthlyReport?.pendingFreelancerApprovals ?? 0}</p>
                </div>
              </div>

              <div className="table-card full-width">
                <div className="panel-header">
                  <div>
                    <h3>Six-Month Trend</h3>
                    <p>Track platform growth and freelancer approval flow over the last six months.</p>
                  </div>
                  <button className="secondary-btn inline-download-btn" onClick={handleDownloadSixMonthReport}>
                    <FaDownload /> CSV
                  </button>
                </div>
                <table className="admin-table compact-table">
                  <thead>
                    <tr>
                      <th>Month</th>
                      <th>Users</th>
                      <th>Courses</th>
                      <th>Freelancer Services</th>
                      <th>Freelancer Approvals</th>
                    </tr>
                  </thead>
                  <tbody>
                    {reports?.sixMonthReport?.map((row) => (
                      <tr key={row.label}>
                        <td>{row.label}</td>
                        <td>{row.users}</td>
                        <td>{row.courses}</td>
                        <td>{row.freelancers}</td>
                        <td>{row.freelancerApprovals ?? 0}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
