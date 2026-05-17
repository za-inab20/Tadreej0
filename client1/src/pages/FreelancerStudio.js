import React, { useEffect, useMemo, useState } from 'react';
import { useLang } from '../context/LangContext';
import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';
import { FaPencilAlt, FaPlus, FaSave, FaTrash } from 'react-icons/fa';
import { api, getUserConfig } from '../utils/api';
import './Profile.css';
import './FreelancerStudio.css';

const LABELS = {
  en: {
    workspace: 'Freelancer workspace',
    title: 'Freelancer Studio',
    subtitle: 'Add, update, and manage your freelancer activities and services. You can prepare everything privately before admin approval.',
    approvalStatus: 'Approval Status',
    totalServices: 'Total Services', totalServicesDesc: 'Everything you created in your private studio.',
    visibility: 'Current Visibility', visibilityPublic: 'Visible to everyone', visibilityPrivate: 'Private until admin approval',
    readiness: 'Studio Readiness', readyLabel: 'Profile ready', notReadyLabel: 'Add your first service',
    readyDesc: 'Keep your listings polished so they publish immediately after approval.',
    notReadyDesc: 'Create at least one service to prepare your freelancer profile.',
    publicLive: 'public service live now.', publicLivePlural: 'public services live now.',
    privatePending: 'private service hidden until approval.', privatePendingPlural: 'private services hidden until approval.',
    updateService: 'Update Service', addService: 'Add New Service',
    addDesc: 'Create a polished freelancer listing. Private services stay visible only to you until approval.',
    displayName: 'Display Name', displayNamePH: 'Your public freelancer name',
    roleTitle: 'Role Title', roleTitlePH: 'Full Stack Developer',
    category: 'Category', categoryPH: 'Development, Design, Marketing...',
    hourlyRate: 'Hourly Rate', hourlyRatePH: '45',
    location: 'Location', locationPH: 'Muscat, Oman',
    completedJobs: 'Completed Jobs',
    skills: 'Skills', skillsPH: 'React, Node.js, UI Design',
    languages: 'Languages', languagesPH: 'English, Arabic',
    responseTime: 'Response Time', responseTimePH: '~ 1 hour',
    memberSince: 'Member Since', memberSincePH: 'Mar 2026',
    aboutService: 'About Service', aboutPH: 'Describe the value you deliver, your workflow, and what clients can expect.',
    worksExhibition: 'Works Exhibition', worksPH: 'Image or video URLs separated by commas',
    saveService: 'Save Service', cancelEdit: 'Cancel Edit',
    yourServices: 'Your Services',
    servicesDesc: 'Once admin approves your freelancer account, all private services become visible immediately to everyone.',
    loading: 'Loading your freelancer services...', empty: 'You have not added any freelancer services yet.',
    public: 'Public', private: 'Private',
    edit: 'Edit', delete: 'Delete',
  },
  ar: {
    workspace: 'مساحة الفريلانسر',
    title: 'استوديو الفريلانسر',
    subtitle: 'أضف وحدّث وأدر خدماتك. يمكنك تجهيز كل شيء بشكل خاص قبل موافقة الأدمن.',
    approvalStatus: 'حالة الموافقة',
    totalServices: 'إجمالي الخدمات', totalServicesDesc: 'كل ما أنشأته في استوديوك الخاص.',
    visibility: 'الظهور الحالي', visibilityPublic: 'مرئي للجميع', visibilityPrivate: 'خاص حتى موافقة الأدمن',
    readiness: 'جاهزية الاستوديو', readyLabel: 'البروفايل جاهز', notReadyLabel: 'أضف خدمتك الأولى',
    readyDesc: 'احتفظ بقوائمك مصقولة لتُنشر فوراً بعد الموافقة.',
    notReadyDesc: 'أنشئ خدمة واحدة على الأقل لتجهيز ملفك الشخصي.',
    publicLive: 'خدمة عامة مباشرة الآن.', publicLivePlural: 'خدمات عامة مباشرة الآن.',
    privatePending: 'خدمة خاصة مخفية حتى الموافقة.', privatePendingPlural: 'خدمات خاصة مخفية حتى الموافقة.',
    updateService: 'تحديث الخدمة', addService: 'إضافة خدمة جديدة',
    addDesc: 'أنشئ قائمة فريلانسر متقنة. تبقى الخدمات الخاصة مرئية لك فقط حتى الموافقة.',
    displayName: 'الاسم المعروض', displayNamePH: 'اسمك العلني',
    roleTitle: 'المسمى الوظيفي', roleTitlePH: 'مطور متكامل',
    category: 'التصنيف', categoryPH: 'تطوير، تصميم، تسويق...',
    hourlyRate: 'السعر بالساعة', hourlyRatePH: '45',
    location: 'الموقع', locationPH: 'مسقط، عُمان',
    completedJobs: 'المشاريع المنجزة',
    skills: 'المهارات', skillsPH: 'React, Node.js, تصميم UI',
    languages: 'اللغات', languagesPH: 'الإنجليزية، العربية',
    responseTime: 'وقت الاستجابة', responseTimePH: '~ ساعة واحدة',
    memberSince: 'عضو منذ', memberSincePH: 'مارس 2026',
    aboutService: 'نبذة عن الخدمة', aboutPH: 'صف القيمة التي تقدمها وطريقة عملك.',
    worksExhibition: 'معرض الأعمال', worksPH: 'روابط الصور أو الفيديوهات مفصولة بفاصلة',
    saveService: 'حفظ الخدمة', cancelEdit: 'إلغاء التعديل',
    yourServices: 'خدماتك',
    servicesDesc: 'بمجرد موافقة الأدمن على حسابك، ستصبح جميع الخدمات الخاصة مرئية للجميع فوراً.',
    loading: 'جارٍ تحميل خدماتك...', empty: 'لم تضف أي خدمة بعد.',
    public: 'عام', private: 'خاص',
    edit: 'تعديل', delete: 'حذف',
  },
};

const emptyServiceForm = {
  name: '', roleTitle: '', category: '', hourlyRate: '', location: '',
  skills: '', languages: 'English', responseTime: '~ 1 hour',
  memberSince: '', completedJobs: 0, about: '', worksExhibition: '',
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
  const { lang } = useLang();
  const t = LABELS[lang];

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
  const visibilitySummary = approvalStatus === 'approved' ? t.visibilityPublic : t.visibilityPrivate;

  const resetServiceForm = () => {
    setServiceForm({
      ...emptyServiceForm,
      name: user?.uname || '',
      memberSince: new Date().toLocaleString('en-US', { month: 'short', year: 'numeric' }),
    });
    setEditingServiceId('');
  };

  useEffect(() => { resetServiceForm(); }, [user?._id]);

  useEffect(() => {
    if (isFreelancerAccount) loadFreelancerServices();
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
    const worksArr = serviceForm.worksExhibition
      ? serviceForm.worksExhibition.split(',').map((s) => s.trim()).filter(Boolean)
      : [];
    const payload = {
      ...serviceForm,
      hourlyRate: Number(serviceForm.hourlyRate),
      completedJobs: Number(serviceForm.completedJobs || 0),
      worksExhibition: worksArr,
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
      worksExhibition: Array.isArray(item.worksExhibition) ? item.worksExhibition.join(', ') : '',
    });
    setServiceMessage('Editing selected service.');
  };

  const handleDeleteService = async (id) => {
    if (!window.confirm('Delete this freelancer service?')) return;
    try {
      await api.delete(`/api/catalog/my/freelancers/${id}`, userConfig);
      setServiceItems((cur) => cur.filter((item) => item._id !== id));
      setServiceMessage('Freelancer service deleted successfully.');
      if (editingServiceId === id) resetServiceForm();
    } catch (error) {
      setServiceMessage(error.response?.data?.message || 'Failed to delete freelancer service.');
    }
  };

  if (!user?.email) return <Navigate to="/login" replace />;
  if (!isFreelancerAccount) return <Navigate to="/profile" replace />;

  return (
    <div className="profile-container full-page freelancer-studio-page" dir={lang === 'ar' ? 'rtl' : 'ltr'}>
      <div className="profile-main-content solo-layout">
        <div className="content-header studio-header">
          <div>
            <span className="studio-kicker">{t.workspace}</span>
            <h2>{t.title}</h2>
            <p>{t.subtitle}</p>
          </div>
          
        </div>

        <div className={`studio-approval-card ${currentApprovalMeta.className}`}>
          <div className="studio-approval-copy">
            <span className="studio-status-label">{t.approvalStatus}</span>
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
            <span>{t.totalServices}</span>
            <strong>{serviceItems.length}</strong>
            <small>{t.totalServicesDesc}</small>
          </div>
          <div className="studio-summary-card">
            <span>{t.visibility}</span>
            <strong>{visibilitySummary}</strong>
            <small>
              {approvalStatus === 'approved'
                ? `${publicServicesCount} ${publicServicesCount === 1 ? t.publicLive : t.publicLivePlural}`
                : `${privateServicesCount || serviceItems.length} ${(privateServicesCount || serviceItems.length) === 1 ? t.privatePending : t.privatePendingPlural}`}
            </small>
          </div>
          <div className="studio-summary-card">
            <span>{t.readiness}</span>
            <strong>{serviceItems.length > 0 ? t.readyLabel : t.notReadyLabel}</strong>
            <small>{serviceItems.length > 0 ? t.readyDesc : t.notReadyDesc}</small>
          </div>
        </div>

        {serviceMessage && (
          <div className={`alert ${serviceMessage.toLowerCase().includes('success') || serviceMessage.includes('Editing') ? 'alert-success' : 'alert-danger'}`}>
            {serviceMessage}
          </div>
        )}

        <div className="studio-grid">
          <div className="studio-panel">
            <div className="studio-panel-header">
              <h3>{editingServiceId ? t.updateService : t.addService}</h3>
              <p>{t.addDesc}</p>
            </div>

            <form className="studio-form" onSubmit={handleServiceSubmit}>
              <div className="studio-form-grid">
                <div className="form-group">
                  <label>{t.displayName}</label>
                  <input name="name" value={serviceForm.name} onChange={handleServiceFormChange} placeholder={t.displayNamePH} required />
                </div>
                <div className="form-group">
                  <label>{t.roleTitle}</label>
                  <input name="roleTitle" value={serviceForm.roleTitle} onChange={handleServiceFormChange} placeholder={t.roleTitlePH} required />
                </div>
                <div className="form-group">
                  <label>{t.category}</label>
                  <input name="category" value={serviceForm.category} onChange={handleServiceFormChange} placeholder={t.categoryPH} required />
                </div>
                <div className="form-group">
                  <label>{t.hourlyRate}</label>
                  <input type="number" min="0" step="0.01" name="hourlyRate" value={serviceForm.hourlyRate} onChange={handleServiceFormChange} placeholder={t.hourlyRatePH} required />
                </div>
                <div className="form-group">
                  <label>{t.location}</label>
                  <input name="location" value={serviceForm.location} onChange={handleServiceFormChange} placeholder={t.locationPH} />
                </div>
                <div className="form-group">
                  <label>{t.completedJobs}</label>
                  <input type="number" min="0" name="completedJobs" value={serviceForm.completedJobs} onChange={handleServiceFormChange} placeholder="0" />
                </div>
                <div className="form-group">
                  <label>{t.skills}</label>
                  <input name="skills" value={serviceForm.skills} onChange={handleServiceFormChange} placeholder={t.skillsPH} />
                </div>
                <div className="form-group">
                  <label>{t.languages}</label>
                  <input name="languages" value={serviceForm.languages} onChange={handleServiceFormChange} placeholder={t.languagesPH} />
                </div>
                <div className="form-group">
                  <label>{t.responseTime}</label>
                  <input name="responseTime" value={serviceForm.responseTime} onChange={handleServiceFormChange} placeholder={t.responseTimePH} />
                </div>
                <div className="form-group">
                  <label>{t.memberSince}</label>
                  <input name="memberSince" value={serviceForm.memberSince} onChange={handleServiceFormChange} placeholder={t.memberSincePH} />
                </div>
              </div>

              <div className="form-group">
                <label>{t.aboutService}</label>
                <textarea name="about" value={serviceForm.about} onChange={handleServiceFormChange} rows="5" placeholder={t.aboutPH} />
              </div>

              <div className="form-group">
                <label>{t.worksExhibition}</label>
                <input name="worksExhibition" value={serviceForm.worksExhibition} onChange={handleServiceFormChange} placeholder={t.worksPH} />
              </div>

              <div className="studio-actions">
                <button type="submit" className="btn-save" disabled={serviceLoading}>
                  {editingServiceId ? <><FaSave /> {t.saveService}</> : <><FaPlus /> {t.addService}</>}
                </button>
                {editingServiceId && (
                  <button type="button" className="btn-ghost" onClick={resetServiceForm}>{t.cancelEdit}</button>
                )}
              </div>
            </form>
          </div>

          <div className="studio-panel">
            <div className="studio-panel-header">
              <h3>{t.yourServices}</h3>
              <p>{t.servicesDesc}</p>
            </div>

            {serviceLoading ? (
              <div className="studio-empty">{t.loading}</div>
            ) : serviceItems.length === 0 ? (
              <div className="studio-empty">{t.empty}</div>
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
                        {(item.publicVisibility || 'public') === 'public' ? t.public : t.private}
                      </span>
                    </div>
                    <div className="studio-service-meta">
                      <span>{item.category}</span>
                      <span>${item.hourlyRate}/hr</span>
                      <span>{item.location || 'Remote'}</span>
                    </div>
                    <p className="studio-service-about">{item.about || 'No description added yet.'}</p>
                    <div className="studio-skill-list">
                      {(item.skills || []).slice(0, 5).map((skill, idx) => <span key={idx}>{skill}</span>)}
                    </div>
                    {Array.isArray(item.worksExhibition) && item.worksExhibition.length > 0 && (
                      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', margin: '8px 0' }}>
                        {item.worksExhibition.slice(0, 3).map((src, idx) => {
                          const isVideo = /\.(mp4|webm|ogg|mov)$/i.test(src);
                          return isVideo ? (
                            <video key={idx} src={src} style={{ width: '64px', height: '48px', objectFit: 'cover', borderRadius: '6px', border: '1px solid #e0e7ff' }} muted />
                          ) : (
                            <img key={idx} src={src} alt="" style={{ width: '64px', height: '48px', objectFit: 'cover', borderRadius: '6px', border: '1px solid #e0e7ff' }} />
                          );
                        })}
                        {item.worksExhibition.length > 3 && (
                          <span style={{ fontSize: '12px', color: '#6b7280', alignSelf: 'center' }}>+{item.worksExhibition.length - 3} more</span>
                        )}
                      </div>
                    )}
                    <div className="studio-card-actions">
                      <button type="button" className="btn-inline edit" onClick={() => handleEditService(item)}>
                        <FaPencilAlt /> {t.edit}
                      </button>
                      <button type="button" className="btn-inline delete" onClick={() => handleDeleteService(item._id)}>
                        <FaTrash /> {t.delete}
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
