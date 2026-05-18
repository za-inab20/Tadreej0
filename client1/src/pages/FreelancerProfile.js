import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import './FreelancerProfile.css';
import { useT } from '../context/LangContext';
import {
  FaStar,
  FaUserCircle,
  FaMapMarkerAlt,
  FaCheckCircle,
  FaArrowLeft,
  FaImages,
  FaPlay,
  FaTimes,
} from 'react-icons/fa';
import { api, getUserConfig } from '../utils/api';
import { defaultFreelancers } from '../data/defaultCatalog';

function StarPicker({ value, onChange }) {
  const [hovered, setHovered] = useState(0);
  return (
    <div style={{ display: 'flex', gap: '4px', cursor: 'pointer' }}>
      {[1, 2, 3, 4, 5].map((star) => (
        <FaStar
          key={star}
          style={{ fontSize: '22px', color: star <= (hovered || value) ? '#fbbf24' : '#d1d5db', transition: '0.15s' }}
          onMouseEnter={() => setHovered(star)}
          onMouseLeave={() => setHovered(0)}
          onClick={() => onChange(star)}
        />
      ))}
    </div>
  );
}

function MediaModal({ src, onClose }) {
  const isVideo = /\.(mp4|webm|ogg|mov)$/i.test(src);
  return (
    <div
      style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.82)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
      onClick={onClose}
    >
      <button onClick={onClose} style={{ position: 'absolute', top: '20px', right: '24px', background: 'none', border: 'none', color: '#fff', fontSize: '28px', cursor: 'pointer' }}>
        <FaTimes />
      </button>
      {isVideo ? (
        <video src={src} controls autoPlay style={{ maxWidth: '90vw', maxHeight: '85vh', borderRadius: '12px' }} onClick={(e) => e.stopPropagation()} />
      ) : (
        <img src={src} alt="Work" style={{ maxWidth: '90vw', maxHeight: '85vh', borderRadius: '12px', objectFit: 'contain' }} onClick={(e) => e.stopPropagation()} />
      )}
    </div>
  );
}

function FreelancerProfile() {
  const t = useT();
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.users);
  const userConfig = getUserConfig(user);

  const [freelancer, setFreelancer] = useState(
    defaultFreelancers.find((item) => String(item._id || item.id) === String(id)) || null
  );
  const [loading, setLoading] = useState(true);
  const [modalSrc, setModalSrc] = useState(null);

  const [reviewRating, setReviewRating] = useState(0);
  const [reviewComment, setReviewComment] = useState('');
  const [reviewMsg, setReviewMsg] = useState('');
  const [reviewLoading, setReviewLoading] = useState(false);

  useEffect(() => {
  console.log("Freelancer ID from URL:", id);
    const fetchFreelancer = async () => {
      try {
        const response = await api.get(`/api/catalog/freelancers/${id}`);
        setFreelancer(response.data);
      } catch (error) {
        // Keep fallback data if server lookup fails
      } finally {
        setLoading(false);
      }
    };
    fetchFreelancer();
  }, [id]);

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    if (!reviewRating) { setReviewMsg('Please select a star rating.'); return; }
    setReviewLoading(true);
    setReviewMsg('');
    try {
      const response = await api.post(`/api/catalog/freelancers/${id}/review`, { rating: reviewRating, comment: reviewComment }, userConfig);
      setFreelancer(response.data.freelancer);
      setReviewRating(0);
      setReviewComment('');
      setReviewMsg('Your review has been submitted!');
    } catch (err) {
      setReviewMsg(err.response?.data?.message || 'Failed to submit review.');
    } finally {
      setReviewLoading(false);
    }
  };

  if (loading && !freelancer) return <div className="profile-container"><h2>Loading freelancer...</h2></div>;
  if (!freelancer) return <div className="profile-container"><h2>Freelancer not found</h2></div>;

  const works = freelancer.worksExhibition || [];
  const userReviews = freelancer.userReviews || [];
  const alreadyReviewed = user && userReviews.some((r) => String(r.userId) === String(user._id));

  return (
    <div className="profile-container">
      {modalSrc && <MediaModal src={modalSrc} onClose={() => setModalSrc(null)} />}

      <button
        className="btn-back-link"
        onClick={() => navigate('/freelancers')}
        style={{ background: 'none', border: 'none', color: '#6b7280', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '5px', marginBottom: '20px', fontSize: '1rem' }}
      >
        <FaArrowLeft /> Back to Freelancers
      </button>

      <div className="profile-header-card">
        <div className="profile-avatar"><FaUserCircle /></div>
        <div className="profile-info">
          <h1 className="profile-name">{freelancer.name}</h1>
          <p className="profile-role">{freelancer.roleTitle || freelancer.role}</p>
          <div className="profile-stats">
            <div className="stat-item">
              <FaStar style={{ color: '#fbbf24' }} />
              <span className="stat-value">{freelancer.rating}</span>
              <span>({freelancer.reviews} reviews)</span>
            </div>
            <div className="stat-item">
              <FaMapMarkerAlt />
              <span>{freelancer.location}</span>
            </div>
            <div className="stat-item">
              <FaCheckCircle style={{ color: '#10b981' }} />
              <span>{freelancer.completedJobs} {t.jobsCompleted}</span>
            </div>
          </div>
          <div className="profile-actions">
            {freelancer.profileUrl ? (
              <a href={freelancer.profileUrl} target="_blank" rel="noopener noreferrer" className="btn-hire-now" style={{ textDecoration: 'none', display: 'inline-block', textAlign: 'center' }}>
                {t.viewFullProfile}
              </a>
            ) : (
              <button className="btn-hire-now">{t.hireNow}</button>
            )}
            <button className="btn-message">{t.message}</button>
          </div>
        </div>
      </div>

      <div className="profile-content">
        <div className="left-column">
          <div className="content-section">
            <h3 className="section-title">{t.aboutMe}</h3>
            <p className="about-text">{freelancer.about}</p>
          </div>

          <div className="content-section">
            <h3 className="section-title">{t.skills}</h3>
            <div className="skills-list">
              {(freelancer.skills || []).map((skill, idx) => (
                <span key={idx} className="skill-badge">{skill}</span>
              ))}
            </div>
          </div>

          {works.length > 0 && (
            <div className="content-section">
              <h3 className="section-title" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <FaImages style={{ color: '#4f46e5' }} /> {t.worksExhibition}
              </h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: '12px', marginTop: '12px' }}>
                {works.map((src, idx) => {
                  const isVideo = /\.(mp4|webm|ogg|mov)$/i.test(src);
                  return (
                    <div
                      key={idx}
                      onClick={() => setModalSrc(src)}
                      style={{ position: 'relative', borderRadius: '12px', overflow: 'hidden', cursor: 'pointer', aspectRatio: '4/3', background: '#e0e7ff', border: '1px solid #c7d2fe' }}
                    >
                      {isVideo ? (
                        <>
                          <video src={src} style={{ width: '100%', height: '100%', objectFit: 'cover' }} muted />
                          <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,0.3)' }}>
                            <FaPlay style={{ color: '#fff', fontSize: '24px' }} />
                          </div>
                        </>
                      ) : (
                        <img src={src} alt={`Work ${idx + 1}`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          <div className="content-section">
            <h3 className="section-title">{t.reviews}</h3>

            {userReviews.length > 0 ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginBottom: '24px' }}>
                {userReviews.map((rev, idx) => (
                  <div key={idx} className="review-item">
                    <div className="review-header">
                      <span className="reviewer-name">{rev.userName}</span>
                      <span className="review-date">{new Date(rev.createdAt).toLocaleDateString()}</span>
                    </div>
                    <div style={{ display: 'flex', gap: '2px', marginBottom: '5px', color: '#fbbf24' }}>
                      {[1,2,3,4,5].map((s) => <FaStar key={s} style={{ color: s <= rev.rating ? '#fbbf24' : '#d1d5db' }} />)}
                    </div>
                    {rev.comment && <p className="review-text">{rev.comment}</p>}
                  </div>
                ))}
              </div>
            ) : (
              <p style={{ color: '#9ca3af', marginBottom: '20px' }}>{t.noReviews}</p>
            )}

            {user && !alreadyReviewed && (
              <div style={{ background: '#f8faff', border: '1px solid #e0e7ff', borderRadius: '16px', padding: '20px' }}>
                <h4 style={{ marginBottom: '12px', color: '#111827' }}>{t.leaveReview}</h4>
                <form onSubmit={handleSubmitReview} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <StarPicker value={reviewRating} onChange={setReviewRating} />
                  <textarea
                    value={reviewComment}
                    onChange={(e) => setReviewComment(e.target.value)}
                    placeholder={t.reviewPlaceholder}
                    rows="3"
                    style={{ padding: '10px 14px', borderRadius: '10px', border: '1px solid #d1d5db', fontSize: '14px', resize: 'vertical', fontFamily: 'inherit' }}
                  />
                  {reviewMsg && (
                    <p style={{ color: reviewMsg.includes('submitted') ? '#059669' : '#dc2626', fontSize: '14px' }}>{reviewMsg}</p>
                  )}
                  <button
                    type="submit"
                    disabled={reviewLoading}
                    style={{ background: '#4f46e5', color: '#fff', border: 'none', borderRadius: '10px', padding: '10px 22px', fontWeight: '700', cursor: reviewLoading ? 'not-allowed' : 'pointer', alignSelf: 'flex-start' }}
                  >
                    {reviewLoading ? t.submitting : t.submitReview}
                  </button>
                </form>
              </div>
            )}
            {user && alreadyReviewed && (
              <p style={{ color: '#6b7280', fontSize: '14px' }}>{t.alreadyReviewed}</p>
            )}
            {!user && (
              <p style={{ color: '#6b7280', fontSize: '14px' }}>
                <button onClick={() => navigate('/login')} style={{ background: 'none', border: 'none', color: '#4f46e5', cursor: 'pointer', fontWeight: '600' }}>Log in</button> to leave a review.
              </p>
            )}
          </div>
        </div>

        <div className="right-column">
          <div className="sidebar-card">
            <h3 className="section-title" style={{ fontSize: '1.2rem' }}>{t.information}</h3>
            <div className="info-row">
              <span className="info-label">{t.hourlyRate}</span>
              <span className="info-value">${freelancer.hourlyRate ?? freelancer.rate}/hr</span>
            </div>
            <div className="info-row">
              <span className="info-label">{t.responseTime}</span>
              <span className="info-value">{freelancer.responseTime || '~ 1 hour'}</span>
            </div>
            <div className="info-row">
              <span className="info-label">{t.memberSince}</span>
              <span className="info-value">{freelancer.memberSince || 'Recently joined'}</span>
            </div>
            <div className="info-row">
              <span className="info-label">{t.languages}</span>
              <span className="info-value">{(freelancer.languages || ['English']).join(', ')}</span>
            </div>
          </div>

          <div className="sidebar-card">
            <h3 className="section-title" style={{ fontSize: '1.2rem' }}>{t.certifications}</h3>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
              <FaCheckCircle style={{ color: '#4f46e5' }} />
              <span>{t.topRated}</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <FaCheckCircle style={{ color: '#4f46e5' }} />
              <span>{t.identityVerified}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default FreelancerProfile;

