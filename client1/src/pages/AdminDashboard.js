import React, { useEffect, useMemo, useState } from 'react';
import { useLang } from '../context/LangContext';
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

const LABELS = {
  en: {
    dashboard: 'Admin Dashboard',
    dashDesc: 'Manage users, courses, freelancer services, approvals, and reports.',
    refresh: 'Refresh Data',
    overview: 'Overview', users: 'Users', courses: 'Courses',
    freelancers: 'Freelancers', reports: 'Reports',
    totalUsers: 'Total Users', admins: 'Admins',
    pendingApprovals: 'Pending Approvals', freelancerServices: 'Freelancer Services',
    recentUsers: 'Recent Users', recentCourses: 'Recent Courses',
    recentFreelancers: 'Recent Freelancer Services',
    name: 'Name', email: 'Email', role: 'Role', freelancerApproval: 'Freelancer Approval',
    joined: 'Joined', actions: 'Actions',
    approve: 'Approve', reject: 'Reject',
    addCourse: 'Add Course', updateCourse: 'Update Course',
    courseTitle: 'Course Title', instructor: 'Instructor', category: 'Category',
    level: 'Level', price: 'Price', duration: 'Duration', rating: 'Rating',
    reviewCount: 'Review Count', description: 'Description',
    saveCourse: 'Save Course', cancelEdit: 'Cancel Edit', courseLink: 'Course Link (optional)',
    course: 'Course', actions2: 'Actions',
    addService: 'Add Freelancer Service', updateService: 'Update Freelancer Service',
    freelancerName: 'Freelancer Name', roleTitle: 'Role Title',
    hourlyRate: 'Hourly Rate', location: 'Location', completedJobs: 'Completed Jobs',
    skills: 'Skills (comma separated)', languages: 'Languages',
    responseTime: 'Response Time', memberSince: 'Member Since',
    aboutService: 'About Freelancer Service', profileUrl: 'Profile URL (optional)',

    saveService: 'Save Service',
    owner: 'Owner', source: 'Source', visibility: 'Visibility', rate: 'Rate',
    reportsCenter: 'Reports Center',
    reportsDesc: 'Download monthly, six-month, and quarterly reports.',
    downloadMonthly: 'Download Monthly CSV', downloadSixMonth: 'Download Six-Month CSV',
    downloadQuarterly: 'Download Quarterly CSV',
    monthlyReport: 'Monthly Report', currentMonth: 'Current month',
    newUsers: 'New Users', newCourses: 'New Courses', newFreelancers: 'New Freelancer Services',
    approvedFreelancers: 'Approved Freelancer Accounts',
    publicFreelancers: 'Public Freelancer Services', pendingApprovalsLabel: 'Pending Approvals',
    sixMonthTrend: 'Six-Month Trend',
    sixMonthDesc: 'Track platform growth over the last six months.',
    month: 'Month', freelancerApprovals: 'Freelancer Approvals',
    quarterlyReport: 'Quarterly Summary Report',
    quarterlyDesc: 'Aggregated data for the last four quarters.',
    quarter: 'Quarter', totalNewUsers: 'Total New Users', totalNewCourses: 'Total New Courses',
    totalNewFreelancers: 'Total New Freelancers', totalApprovals: 'Total Approvals',
    notFreelancer: 'Not freelancer', adminListing: 'Admin listing',
    waitingApproval: 'freelancer account waiting for approval.',
    waitingApprovals: 'freelancer accounts waiting for approval.',
    approveInstant: 'Approving a freelancer user instantly publishes all of their saved services.',
    csv: 'CSV',
  },
  ar: {
    dashboard: 'لوحة تحكم الأدمن',
    dashDesc: 'إدارة المستخدمين والكورسات وخدمات الفريلانسر والموافقات والتقارير.',
    refresh: 'تحديث البيانات',
    overview: 'نظرة عامة', users: 'المستخدمون', courses: 'الكورسات',
    freelancers: 'الفريلانسر', reports: 'التقارير',
    totalUsers: 'إجمالي المستخدمين', admins: 'الأدمن',
    pendingApprovals: 'طلبات معلّقة', freelancerServices: 'خدمات الفريلانسر',
    recentUsers: 'أحدث المستخدمين', recentCourses: 'أحدث الكورسات',
    recentFreelancers: 'أحدث خدمات الفريلانسر',
    name: 'الاسم', email: 'البريد', role: 'الدور', freelancerApproval: 'موافقة الفريلانسر',
    joined: 'تاريخ التسجيل', actions: 'الإجراءات',
    approve: 'موافقة', reject: 'رفض',
    addCourse: 'إضافة كورس', updateCourse: 'تحديث الكورس',
    courseTitle: 'عنوان الكورس', instructor: 'المدرّب', category: 'التصنيف',
    level: 'المستوى', price: 'السعر', duration: 'المدة', rating: 'التقييم',
    reviewCount: 'عدد المراجعات', description: 'الوصف',
    saveCourse: 'حفظ الكورس', cancelEdit: 'إلغاء التعديل', courseLink: 'رابط الكورس (اختياري)',
    course: 'الكورس', actions2: 'الإجراءات',
    addService: 'إضافة خدمة فريلانسر', updateService: 'تحديث خدمة الفريلانسر',
    freelancerName: 'اسم الفريلانسر', roleTitle: 'المسمى الوظيفي',
    hourlyRate: 'السعر بالساعة', location: 'الموقع', completedJobs: 'المشاريع المنجزة',
    skills: 'المهارات (مفصولة بفاصلة)', languages: 'اللغات',
    responseTime: 'وقت الاستجابة', memberSince: 'عضو منذ',
    aboutService: 'نبذة عن الخدمة', profileUrl: 'رابط البروفايل (اختياري)',

    saveService: 'حفظ الخدمة',
    owner: 'المالك', source: 'المصدر', visibility: 'الظهور', rate: 'السعر',
    reportsCenter: 'مركز التقارير',
    reportsDesc: 'تحميل تقارير شهرية وستة أشهر وربع سنوية.',
    downloadMonthly: 'تحميل CSV الشهري', downloadSixMonth: 'تحميل CSV ستة أشهر',
    downloadQuarterly: 'تحميل CSV الربع سنوي',
    monthlyReport: 'التقرير الشهري', currentMonth: 'الشهر الحالي',
    newUsers: 'مستخدمون جدد', newCourses: 'كورسات جديدة', newFreelancers: 'خدمات فريلانسر جديدة',
    approvedFreelancers: 'حسابات فريلانسر معتمدة',
    publicFreelancers: 'خدمات الفريلانسر العامة', pendingApprovalsLabel: 'الطلبات المعلّقة',
    sixMonthTrend: 'اتجاه ستة أشهر',
    sixMonthDesc: 'تتبع نمو المنصة خلال الأشهر الستة الماضية.',
    month: 'الشهر', freelancerApprovals: 'موافقات الفريلانسر',
    quarterlyReport: 'ملخص التقرير الربع سنوي',
    quarterlyDesc: 'بيانات مجمّعة لآخر أربعة أرباع.',
    quarter: 'الربع', totalNewUsers: 'إجمالي المستخدمين الجدد', totalNewCourses: 'إجمالي الكورسات الجديدة',
    totalNewFreelancers: 'إجمالي الفريلانسر الجدد', totalApprovals: 'إجمالي الموافقات',
    notFreelancer: 'ليس فريلانسر', adminListing: 'إدراج الأدمن',
    waitingApproval: 'حساب فريلانسر ينتظر الموافقة.',
    waitingApprovals: 'حسابات فريلانسر تنتظر الموافقة.',
    approveInstant: 'الموافقة على حساب الفريلانسر تنشر جميع خدماته فوراً.',
    csv: 'CSV',
  },
};

const emptyCourseForm = {
  title: '', instructor: '', category: '', level: 'Beginner',
  price: '', duration: '', rating: 0, reviews: 0, description: '', courseLink: '',
};

const emptyFreelancerForm = {
  name: '', roleTitle: '', category: '', hourlyRate: '', rating: 0, reviews: 0,
  completedJobs: 0, location: '', skills: '', languages: 'English',
  responseTime: '~ 1 hour', memberSince: '', about: '', profileUrl: '',
};

const approvalOptions = [
  { value: 'pending', label: 'Pending' },
  { value: 'approved', label: 'Approved' },
  { value: 'rejected', label: 'Rejected' },
];

const getApprovalBadgeMeta = (status) => {
  switch (status) {
    case 'approved': return { label: 'Approved', className: 'approved' };
    case 'rejected': return { label: 'Rejected', className: 'rejected' };
    default: return { label: 'Pending', className: 'pending' };
  }
};

const buildQuarterlyReport = (sixMonthReport) => {
  if (!sixMonthReport || sixMonthReport.length < 2) return [];
  const quarters = [];
  for (let i = 0; i < sixMonthReport.length; i += 3) {
    const chunk = sixMonthReport.slice(i, i + 3);
    if (!chunk.length) continue;
    quarters.push({
      label: `Q${Math.floor(i / 3) + 1}: ${chunk[0]?.label} – ${chunk[chunk.length - 1]?.label}`,
      users: chunk.reduce((s, r) => s + (r.users || 0), 0),
      courses: chunk.reduce((s, r) => s + (r.courses || 0), 0),
      freelancers: chunk.reduce((s, r) => s + (r.freelancers || 0), 0),
      freelancerApprovals: chunk.reduce((s, r) => s + (r.freelancerApprovals || 0), 0),
    });
  }
  return quarters;
};

const AdminDashboard = () => {
  const { user } = useUserAuth();
  const adminConfig = useMemo(() => getAdminConfig(user), [user]);
  
  const { lang } = useLang();
  const t = LABELS[lang];

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

  const quarterlyReport = useMemo(() => buildQuarterlyReport(reports.sixMonthReport), [reports.sixMonthReport]);

  const downloadCsvFile = (filename, rows) => {
    const escape = (v) => {
      if (v == null) return '';
      const s = String(v).replace(/"/g, '""');
      return /[",\n]/.test(s) ? `"${s}"` : s;
    };
    const csv = rows.map((row) => row.map(escape).join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.setAttribute('download', filename);
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  const handleDownloadMonthlyReport = () => {
    if (!reports.monthlyReport) { setActionMessage('Monthly report not available.'); return; }
    const r = reports.monthlyReport;
    downloadCsvFile(`${(r.label || 'monthly').replace(/\s+/g, '-').toLowerCase()}.csv`, [
      ['Report Type', 'Monthly Report'],
      ['Period', r.label || 'Current Month'],
      [],
      ['Metric', 'Value'],
      ['New Users', r.newUsers ?? 0],
      ['New Courses', r.newCourses ?? 0],
      ['New Freelancer Services', r.newFreelancers ?? 0],
      ['Approved Freelancer Accounts', r.approvedFreelancersThisMonth ?? 0],
      ['Total Users', r.totalUsers ?? 0],
      ['Total Courses', r.totalCourses ?? 0],
      ['Total Freelancer Services', r.totalFreelancers ?? 0],
      ['Public Freelancer Services', r.totalPublicFreelancers ?? 0],
      ['Pending Freelancer Approvals', r.pendingFreelancerApprovals ?? 0],
    ]);
    setActionMessage('Monthly report CSV downloaded.');
  };

  const handleDownloadSixMonthReport = () => {
    if (!reports.sixMonthReport?.length) { setActionMessage('Six-month report not available.'); return; }
    downloadCsvFile('six-month-report.csv', [
      ['Report Type', 'Six-Month Report'],
      [],
      ['Month', 'Users', 'Courses', 'Freelancer Services', 'Freelancer Approvals'],
      ...reports.sixMonthReport.map((row) => [row.label, row.users ?? 0, row.courses ?? 0, row.freelancers ?? 0, row.freelancerApprovals ?? 0]),
    ]);
    setActionMessage('Six-month report CSV downloaded.');
  };

  const handleDownloadQuarterlyReport = () => {
    if (!quarterlyReport.length) { setActionMessage('Quarterly report not available.'); return; }
    downloadCsvFile('quarterly-report.csv', [
      ['Report Type', 'Quarterly Report'],
      [],
      ['Quarter', 'New Users', 'New Courses', 'New Freelancers', 'Freelancer Approvals'],
      ...quarterlyReport.map((q) => [q.label, q.users, q.courses, q.freelancers, q.freelancerApprovals]),
    ]);
    setActionMessage('Quarterly report CSV downloaded.');
  };

  useEffect(() => {
    fetchAllAdminData();
  }, []);

  const fetchAllAdminData = async () => {
    try {
      setLoading(true);
      setError('');
      const [oRes, uRes, cRes, fRes, rRes] = await Promise.all([
        api.get('/api/admin/overview', adminConfig),
        api.get('/api/admin/users', adminConfig),
        api.get('/api/admin/courses', adminConfig),
        api.get('/api/admin/freelancers', adminConfig),
        api.get('/api/admin/reports', adminConfig),
      ]);
      setOverview(oRes.data);
      setUsers(uRes.data);
      setCourses(cRes.data);
      setFreelancers(fRes.data);
      setReports(rRes.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load admin dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const handleUserFieldChange = (id, field, value) => {
    setUsers((cur) => cur.map((item) => (item._id === id ? { ...item, [field]: value } : item)));
  };

  const handleQuickApproval = async (targetUser, status) => {
    try {
      await api.put(`/api/admin/users/${targetUser._id}`, {
        uname: targetUser.uname, email: targetUser.email, role: targetUser.role,
        accountType: 'freelancer', freelancerApprovalStatus: status,
      }, adminConfig);
      setActionMessage(`Freelancer account marked as ${status}.`);
      fetchAllAdminData();
    } catch (err) {
      setActionMessage(err.response?.data?.message || 'Failed to update approval.');
    }
  };

  const handleSaveUser = async (targetUser) => {
    try {
      await api.put(`/api/admin/users/${targetUser._id}`, {
        uname: targetUser.uname, email: targetUser.email, role: targetUser.role,
        accountType: targetUser.accountType,
        freelancerApprovalStatus: targetUser.accountType === 'freelancer'
          ? targetUser.freelancerApprovalStatus || 'pending'
          : 'not_requested',
      }, adminConfig);
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
      setUsers((cur) => cur.filter((item) => item._id !== id));
      setActionMessage('User deleted successfully.');
      fetchAllAdminData();
    } catch (err) {
      setActionMessage(err.response?.data?.message || 'Failed to delete user.');
    }
  };

  const handleCourseSubmit = async (event) => {
    event.preventDefault();
    const payload = { ...courseForm, price: Number(courseForm.price), rating: Number(courseForm.rating), reviews: Number(courseForm.reviews) };
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
      title: course.title || '', instructor: course.instructor || '', category: course.category || '',
      level: course.level || 'Beginner', price: course.price ?? '', duration: course.duration || '',
      rating: course.rating ?? 0, reviews: course.reviews ?? 0, description: course.description || '', courseLink: course.courseLink || '',
    });
  };

  const handleDeleteCourse = async (id) => {
    if (!window.confirm('Delete this course?')) return;
    try {
      await api.delete(`/api/admin/courses/${id}`, adminConfig);
      setCourses((cur) => cur.filter((item) => item._id !== id));
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
      name: freelancer.name || '', roleTitle: freelancer.roleTitle || '', category: freelancer.category || '',
      hourlyRate: freelancer.hourlyRate ?? '', rating: freelancer.rating ?? 0, reviews: freelancer.reviews ?? 0,
      completedJobs: freelancer.completedJobs ?? 0, location: freelancer.location || '',
      skills: Array.isArray(freelancer.skills) ? freelancer.skills.join(', ') : '',
      languages: Array.isArray(freelancer.languages) ? freelancer.languages.join(', ') : 'English',
      responseTime: freelancer.responseTime || '~ 1 hour', memberSince: freelancer.memberSince || '',
      about: freelancer.about || '', profileUrl: freelancer.profileUrl || '',
    });
  };

  const handleDeleteFreelancer = async (id) => {
    if (!window.confirm('Delete this freelancer service?')) return;
    try {
      await api.delete(`/api/admin/freelancers/${id}`, adminConfig);
      setFreelancers((cur) => cur.filter((item) => item._id !== id));
      setActionMessage('Freelancer deleted successfully.');
    } catch (err) {
      setActionMessage(err.response?.data?.message || 'Failed to delete freelancer.');
    }
  };

  const tabs = [
    { key: 'overview', label: t.overview, icon: <FaChartLine /> },
    { key: 'users', label: t.users, icon: <FaUsers /> },
    { key: 'courses', label: t.courses, icon: <FaBook /> },
    { key: 'freelancers', label: t.freelancers, icon: <FaUserTie /> },
    { key: 'reports', label: t.reports, icon: <FaChartLine /> },
  ];

  if (loading) return <div className="admin-loading">Loading admin dashboard...</div>;
  if (error) return <div className="admin-error">{error}</div>;

  return (
    <div className="admin-dashboard" dir={lang === 'ar' ? 'rtl' : 'ltr'}>
      <div className="admin-container">
        <div className="admin-header">
          <div>
            <h1>{t.dashboard}</h1>
            <p>{t.dashDesc}</p>
          </div>
          <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
            
            <button className="refresh-btn" onClick={fetchAllAdminData}>{t.refresh}</button>
          </div>
        </div>

        {actionMessage && <div className="admin-alert">{actionMessage}</div>}

        <div className="tab-bar">
          {tabs.map((tab) => (
            <button key={tab.key} className={`tab-btn ${activeTab === tab.key ? 'active' : ''}`} onClick={() => setActiveTab(tab.key)}>
              {tab.icon} {tab.label}
            </button>
          ))}
        </div>

        {activeTab === 'overview' && (
          <div className="admin-section">
            <div className="metrics-grid">
              <div className="metric-card"><FaUsers /><h3>{t.totalUsers}</h3><strong>{overview?.metrics?.usersCount ?? 0}</strong></div>
              <div className="metric-card"><FaUserShield /><h3>{t.admins}</h3><strong>{overview?.metrics?.adminsCount ?? 0}</strong></div>
              <div className="metric-card"><FaBook /><h3>{t.courses}</h3><strong>{overview?.metrics?.coursesCount ?? 0}</strong></div>
              <div className="metric-card"><FaUserTie /><h3>{t.freelancerServices}</h3><strong>{overview?.metrics?.freelancersCount ?? 0}</strong></div>
              <div className="metric-card"><FaCheckCircle /><h3>{t.pendingApprovals}</h3><strong>{overview?.metrics?.pendingFreelancerApprovals ?? pendingApprovals}</strong></div>
            </div>

            <div className="overview-grid">
              <div className="panel-card">
                <h3>{t.recentUsers}</h3>
                {overview?.recentUsers?.map((item) => (
                  <div key={item._id} className="list-row compact">
                    <div><strong>{item.uname}</strong><p>{item.email}</p></div>
                    <span className={`role-badge ${item.role === 'admin' ? 'admin' : 'user'}`}>{item.role}</span>
                  </div>
                ))}
              </div>
              <div className="panel-card">
                <h3>{t.recentCourses}</h3>
                {overview?.recentCourses?.map((item) => (
                  <div key={item._id} className="list-row compact">
                    <div><strong>{item.title}</strong><p>{item.instructor}</p></div>
                    <span className="pill">{item.category}</span>
                  </div>
                ))}
              </div>
              <div className="panel-card">
                <h3>{t.recentFreelancers}</h3>
                {overview?.recentFreelancers?.map((item) => (
                  <div key={item._id} className="list-row compact">
                    <div><strong>{item.name}</strong><p>{item.roleTitle}</p></div>
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
              <strong>{pendingApprovals}</strong> {pendingApprovals === 1 ? t.waitingApproval : t.waitingApprovals}{' '}
              {t.approveInstant}
            </div>
            <div className="table-card">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>{t.name}</th>
                    <th>{t.email}</th>
                    <th>{t.role}</th>
                    <th>{t.freelancerApproval}</th>
                    <th>{t.joined}</th>
                    <th>{t.actions}</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((targetUser) => (
                    <tr key={targetUser._id}>
                      <td>
                        <input className="table-input" value={targetUser.uname || ''} onChange={(e) => handleUserFieldChange(targetUser._id, 'uname', e.target.value)} />
                      </td>
                      <td>
                        <input className="table-input" value={targetUser.email || ''} onChange={(e) => handleUserFieldChange(targetUser._id, 'email', e.target.value)} />
                      </td>
                      <td>
                        <select className="table-input" value={targetUser.role || 'user'} onChange={(e) => handleUserFieldChange(targetUser._id, 'role', e.target.value)}>
                          <option value="user">User</option>
                          <option value="admin">Admin</option>
                        </select>
                        {targetUser.accountType === 'freelancer' && (
                          <span style={{ display: 'block', fontSize: '11px', color: '#6b7280', marginTop: '2px' }}>Freelancer</span>
                        )}
                      </td>
                      <td>
                        {targetUser.accountType === 'freelancer' ? (() => {
                          const meta = getApprovalBadgeMeta(targetUser.freelancerApprovalStatus || 'pending');
                          return (
                            <div className="approval-cell">
                              <span className={`request-status-badge ${meta.className}`}>{meta.label}</span>
                              <select
                                className={`table-input approval-select ${meta.className}`}
                                value={targetUser.freelancerApprovalStatus || 'pending'}
                                onChange={(e) => handleUserFieldChange(targetUser._id, 'freelancerApprovalStatus', e.target.value)}
                              >
                                {approvalOptions.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
                              </select>
                              <div className="approval-action-row">
                                <button className="mini-approve-btn" onClick={() => handleQuickApproval(targetUser, 'approved')}>{t.approve}</button>
                                <button className="mini-reject-btn" onClick={() => handleQuickApproval(targetUser, 'rejected')}>{t.reject}</button>
                              </div>
                            </div>
                          );
                        })() : <span className="muted-text">{t.notFreelancer}</span>}
                      </td>
                      <td>{new Date(targetUser.createdAt).toLocaleDateString()}</td>
                      <td>
                        <div className="action-row">
                          <button className="icon-btn save" onClick={() => handleSaveUser(targetUser)} title="Save user"><FaSave /></button>
                          <button className="icon-btn delete" onClick={() => handleDeleteUser(targetUser._id)} title="Delete user"><FaTrash /></button>
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
              <h3>{editingCourseId ? t.updateCourse : t.addCourse}</h3>
              <form className="admin-form" onSubmit={handleCourseSubmit}>
                <div className="form-field">
                  <label>{t.courseTitle}</label>
                  <input value={courseForm.title} onChange={(e) => setCourseForm({ ...courseForm, title: e.target.value })} />
                </div>
                <div className="form-field">
                  <label>{t.instructor}</label>
                  <input value={courseForm.instructor} onChange={(e) => setCourseForm({ ...courseForm, instructor: e.target.value })} />
                </div>
                <div className="form-grid">
                  <div className="form-field">
                    <label>{t.category}</label>
                    <input value={courseForm.category} onChange={(e) => setCourseForm({ ...courseForm, category: e.target.value })} />
                  </div>
                  <div className="form-field">
                    <label>{t.level}</label>
                    <select value={courseForm.level} onChange={(e) => setCourseForm({ ...courseForm, level: e.target.value })}>
                      <option value="Beginner">Beginner</option>
                      <option value="Intermediate">Intermediate</option>
                      <option value="Advanced">Advanced</option>
                    </select>
                  </div>
                  <div className="form-field">
                    <label>{t.price}</label>
                    <input type="number" min="0" step="0.01" value={courseForm.price} onChange={(e) => setCourseForm({ ...courseForm, price: e.target.value })} />
                  </div>
                  <div className="form-field">
                    <label>{t.duration}</label>
                    <input value={courseForm.duration} onChange={(e) => setCourseForm({ ...courseForm, duration: e.target.value })} />
                  </div>
                  <div className="form-field">
                    <label>{t.rating}</label>
                    <input type="number" min="0" max="5" step="0.1" value={courseForm.rating} onChange={(e) => setCourseForm({ ...courseForm, rating: e.target.value })} />
                  </div>
                  <div className="form-field">
                    <label>{t.reviewCount}</label>
                    <input type="number" min="0" value={courseForm.reviews} onChange={(e) => setCourseForm({ ...courseForm, reviews: e.target.value })} />
                  </div>
                </div>
                <div className="form-field">
                  <label>{t.description}</label>
                  <textarea value={courseForm.description} onChange={(e) => setCourseForm({ ...courseForm, description: e.target.value })} rows="5" />
                </div>
                <div className="form-field">
                  <label>{t.courseLink}</label>
                  <input type="url" value={courseForm.courseLink} onChange={(e) => setCourseForm({ ...courseForm, courseLink: e.target.value })} placeholder="https://..." />
                </div>
                <div className="action-row wide">
                  <button type="submit" className="primary-btn">
                    {editingCourseId ? <><FaSave /> {t.saveCourse}</> : <><FaPlus /> {t.addCourse}</>}
                  </button>
                  {editingCourseId && (
                    <button type="button" className="secondary-btn" onClick={() => { setEditingCourseId(''); setCourseForm(emptyCourseForm); }}>
                      {t.cancelEdit}
                    </button>
                  )}
                </div>
              </form>
            </div>

            <div className="table-card">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>{t.course}</th>
                    <th>{t.category}</th>
                    <th>{t.price}</th>
                    <th>{t.level}</th>
                    <th>{t.actions2}</th>
                  </tr>
                </thead>
                <tbody>
                  {courses.map((course) => (
                    <tr key={course._id}>
                      <td><strong>{course.title}</strong><div className="muted-text">{course.instructor}</div></td>
                      <td>{course.category}</td>
                      <td>${course.price}</td>
                      <td>{course.level}</td>
                      <td>
                        <div className="action-row">
                          <button className="icon-btn edit" onClick={() => handleEditCourse(course)} title="Edit"><FaEdit /></button>
                          <button className="icon-btn delete" onClick={() => handleDeleteCourse(course._id)} title="Delete"><FaTrash /></button>
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
              <h3>{editingFreelancerId ? t.updateService : t.addService}</h3>
              <form className="admin-form" onSubmit={handleFreelancerSubmit}>
                <div className="form-field">
                  <label>{t.freelancerName}</label>
                  <input value={freelancerForm.name} onChange={(e) => setFreelancerForm({ ...freelancerForm, name: e.target.value })} />
                </div>
                <div className="form-field">
                  <label>{t.roleTitle}</label>
                  <input value={freelancerForm.roleTitle} onChange={(e) => setFreelancerForm({ ...freelancerForm, roleTitle: e.target.value })} />
                </div>
                <div className="form-grid">
                  <div className="form-field">
                    <label>{t.category}</label>
                    <input value={freelancerForm.category} onChange={(e) => setFreelancerForm({ ...freelancerForm, category: e.target.value })} />
                  </div>
                  <div className="form-field">
                    <label>{t.hourlyRate}</label>
                    <input type="number" min="0" step="0.01" value={freelancerForm.hourlyRate} onChange={(e) => setFreelancerForm({ ...freelancerForm, hourlyRate: e.target.value })} />
                  </div>
                  <div className="form-field">
                    <label>{t.location}</label>
                    <input value={freelancerForm.location} onChange={(e) => setFreelancerForm({ ...freelancerForm, location: e.target.value })} />
                  </div>
                  <div className="form-field">
                    <label>{t.completedJobs}</label>
                    <input type="number" min="0" value={freelancerForm.completedJobs} onChange={(e) => setFreelancerForm({ ...freelancerForm, completedJobs: e.target.value })} />
                  </div>
                  <div className="form-field">
                    <label>{t.skills}</label>
                    <input value={freelancerForm.skills} onChange={(e) => setFreelancerForm({ ...freelancerForm, skills: e.target.value })} />
                  </div>
                  <div className="form-field">
                    <label>{t.languages}</label>
                    <input value={freelancerForm.languages} onChange={(e) => setFreelancerForm({ ...freelancerForm, languages: e.target.value })} />
                  </div>
                </div>
                <div className="form-field">
                  <label>{t.profileUrl}</label>
                  <input type="url" value={freelancerForm.profileUrl} onChange={(e) => setFreelancerForm({ ...freelancerForm, profileUrl: e.target.value })} placeholder="https://..." />
                </div>
                <div className="form-field">
                  <label>{t.aboutService}</label>
                  <textarea value={freelancerForm.about} onChange={(e) => setFreelancerForm({ ...freelancerForm, about: e.target.value })} rows="5" />
                </div>
                <div className="action-row wide">
                  <button type="submit" className="primary-btn">
                    {editingFreelancerId ? <><FaSave /> {t.saveService}</> : <><FaPlus /> {t.addService}</>}
                  </button>
                  {editingFreelancerId && (
                    <button type="button" className="secondary-btn" onClick={() => { setEditingFreelancerId(''); setFreelancerForm(emptyFreelancerForm); }}>
                      {t.cancelEdit}
                    </button>
                  )}
                </div>
              </form>
            </div>

            <div className="table-card">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>{t.name}</th>
                    <th>{t.owner}</th>
                    <th>{t.source}</th>
                    <th>{t.visibility}</th>
                    <th>{t.rate}</th>
                    <th>{t.actions2}</th>
                  </tr>
                </thead>
                <tbody>
                  {freelancers.map((freelancer) => (
                    <tr key={freelancer._id}>
                      <td><strong>{freelancer.name}</strong><div className="muted-text">{freelancer.roleTitle}</div></td>
                      <td>
                        {freelancer.ownerName ? (
                          <><strong>{freelancer.ownerName}</strong><div className="muted-text">{freelancer.ownerEmail}</div></>
                        ) : (
                          <span className="muted-text">{t.adminListing}</span>
                        )}
                      </td>
                      <td><span className="pill">{freelancer.sourceType || 'admin'}</span></td>
                      <td>
                        <span className={`status-pill ${(freelancer.publicVisibility || 'public') === 'public' ? 'public' : 'private'}`}>
                          {freelancer.publicVisibility || 'public'}
                        </span>
                      </td>
                      <td>${freelancer.hourlyRate}</td>
                      <td>
                        <div className="action-row">
                          <button className="icon-btn edit" onClick={() => handleEditFreelancer(freelancer)} title="Edit"><FaEdit /></button>
                          <button className="icon-btn delete" onClick={() => handleDeleteFreelancer(freelancer._id)} title="Delete"><FaTrash /></button>
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
                <h2>{t.reportsCenter}</h2>
                <p>{t.reportsDesc}</p>
              </div>
              <div className="action-row report-actions">
                <button className="primary-btn download-btn" onClick={handleDownloadMonthlyReport}><FaDownload /> {t.downloadMonthly}</button>
                <button className="secondary-btn download-btn" onClick={handleDownloadSixMonthReport}><FaDownload /> {t.downloadSixMonth}</button>
                <button className="secondary-btn download-btn" onClick={handleDownloadQuarterlyReport}><FaDownload /> {t.downloadQuarterly}</button>
              </div>
            </div>

            <div className="overview-grid report-grid">
              <div className="panel-card">
                <div className="panel-header">
                  <div><h3>{t.monthlyReport}</h3><p>{reports?.monthlyReport?.label || t.currentMonth}</p></div>
                  <button className="secondary-btn inline-download-btn" onClick={handleDownloadMonthlyReport}><FaDownload /> {t.csv}</button>
                </div>
                <div className="report-lines">
                  <p><strong>{t.newUsers}:</strong> {reports?.monthlyReport?.newUsers ?? 0}</p>
                  <p><strong>{t.newCourses}:</strong> {reports?.monthlyReport?.newCourses ?? 0}</p>
                  <p><strong>{t.newFreelancers}:</strong> {reports?.monthlyReport?.newFreelancers ?? 0}</p>
                  <p><strong>{t.approvedFreelancers}:</strong> {reports?.monthlyReport?.approvedFreelancersThisMonth ?? 0}</p>
                  <p><strong>{t.publicFreelancers}:</strong> {reports?.monthlyReport?.totalPublicFreelancers ?? 0}</p>
                  <p><strong>{t.pendingApprovalsLabel}:</strong> {reports?.monthlyReport?.pendingFreelancerApprovals ?? 0}</p>
                </div>
              </div>

              <div className="table-card full-width">
                <div className="panel-header">
                  <div><h3>{t.sixMonthTrend}</h3><p>{t.sixMonthDesc}</p></div>
                  <button className="secondary-btn inline-download-btn" onClick={handleDownloadSixMonthReport}><FaDownload /> {t.csv}</button>
                </div>
                <table className="admin-table compact-table">
                  <thead>
                    <tr>
                      <th>{t.month}</th>
                      <th>{t.newUsers}</th>
                      <th>{t.courses}</th>
                      <th>{t.freelancerServices}</th>
                      <th>{t.freelancerApprovals}</th>
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

              <div className="table-card full-width">
                <div className="panel-header">
                  <div><h3>{t.quarterlyReport}</h3><p>{t.quarterlyDesc}</p></div>
                  <button className="secondary-btn inline-download-btn" onClick={handleDownloadQuarterlyReport}><FaDownload /> {t.csv}</button>
                </div>
                <table className="admin-table compact-table">
                  <thead>
                    <tr>
                      <th>{t.quarter}</th>
                      <th>{t.totalNewUsers}</th>
                      <th>{t.totalNewCourses}</th>
                      <th>{t.totalNewFreelancers}</th>
                      <th>{t.totalApprovals}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {quarterlyReport.map((q) => (
                      <tr key={q.label}>
                        <td>{q.label}</td>
                        <td>{q.users}</td>
                        <td>{q.courses}</td>
                        <td>{q.freelancers}</td>
                        <td>{q.freelancerApprovals}</td>
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
