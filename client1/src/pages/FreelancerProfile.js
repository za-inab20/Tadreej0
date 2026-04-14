import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './FreelancerProfile.css';
import {
  FaStar,
  FaUserCircle,
  FaMapMarkerAlt,
  FaCheckCircle,
  FaArrowLeft,
} from 'react-icons/fa';
import { api } from '../utils/api';
import { defaultFreelancers } from '../data/defaultCatalog';

function FreelancerProfile() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [freelancer, setFreelancer] = useState(
    defaultFreelancers.find((item) => String(item._id || item.id) === String(id)) || null
  );
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFreelancer = async () => {
      try {
        const response = await api.get(`/api/catalog/freelancers/${id}`);
        setFreelancer(response.data);
      } catch (error) {
        // Keep fallback data if server lookup fails.
      } finally {
        setLoading(false);
      }
    };

    fetchFreelancer();
  }, [id]);

  if (loading && !freelancer) {
    return <div className="profile-container"><h2>Loading freelancer...</h2></div>;
  }

  if (!freelancer) {
    return <div className="profile-container"><h2>Freelancer not found</h2></div>;
  }

  return (
    <div className="profile-container">
      <button
        className="btn-back-link"
        onClick={() => navigate('/freelancers')}
        style={{ background: 'none', border: 'none', color: '#6b7280', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '5px', marginBottom: '20px', fontSize: '1rem' }}
      >
        <FaArrowLeft /> Back to Freelancers
      </button>

      <div className="profile-header-card">
        <div className="profile-avatar">
          <FaUserCircle />
        </div>
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
              <span>{freelancer.completedJobs} Jobs Completed</span>
            </div>
          </div>

          <div className="profile-actions">
            <button className="btn-hire-now">Hire Now</button>
            <button className="btn-message">Message</button>
          </div>
        </div>
      </div>

      <div className="profile-content">
        <div className="left-column">
          <div className="content-section">
            <h3 className="section-title">About Me</h3>
            <p className="about-text">{freelancer.about}</p>
          </div>

          <div className="content-section">
            <h3 className="section-title">Skills</h3>
            <div className="skills-list">
              {(freelancer.skills || []).map((skill, index) => (
                <span key={index} className="skill-badge">
                  {skill}
                </span>
              ))}
            </div>
          </div>

          <div className="content-section">
            <h3 className="section-title">Recent Reviews</h3>
            <div className="review-item">
              <div className="review-header">
                <span className="reviewer-name">Client A.</span>
                <span className="review-date">2 weeks ago</span>
              </div>
              <div style={{ display: 'flex', gap: '2px', marginBottom: '5px', color: '#fbbf24' }}>
                <FaStar /><FaStar /><FaStar /><FaStar /><FaStar />
              </div>
              <p className="review-text">Great work, smooth communication, and strong attention to detail.</p>
            </div>
            <div className="review-item">
              <div className="review-header">
                <span className="reviewer-name">Startup Co.</span>
                <span className="review-date">1 month ago</span>
              </div>
              <div style={{ display: 'flex', gap: '2px', marginBottom: '5px', color: '#fbbf24' }}>
                <FaStar /><FaStar /><FaStar /><FaStar /><FaStar />
              </div>
              <p className="review-text">Professional execution and reliable delivery. Strong recommendation.</p>
            </div>
          </div>
        </div>

        <div className="right-column">
          <div className="sidebar-card">
            <h3 className="section-title" style={{ fontSize: '1.2rem' }}>Information</h3>
            <div className="info-row">
              <span className="info-label">Hourly Rate</span>
              <span className="info-value">${freelancer.hourlyRate ?? freelancer.rate}/hr</span>
            </div>
            <div className="info-row">
              <span className="info-label">Response Time</span>
              <span className="info-value">{freelancer.responseTime || '~ 1 hour'}</span>
            </div>
            <div className="info-row">
              <span className="info-label">Member Since</span>
              <span className="info-value">{freelancer.memberSince || 'Recently joined'}</span>
            </div>
            <div className="info-row">
              <span className="info-label">Languages</span>
              <span className="info-value">{(freelancer.languages || ['English']).join(', ')}</span>
            </div>
          </div>

          <div className="sidebar-card">
            <h3 className="section-title" style={{ fontSize: '1.2rem' }}>Certifications</h3>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
              <FaCheckCircle style={{ color: '#4f46e5' }} />
              <span>Top Rated Seller</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <FaCheckCircle style={{ color: '#4f46e5' }} />
              <span>Identity Verified</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default FreelancerProfile;
