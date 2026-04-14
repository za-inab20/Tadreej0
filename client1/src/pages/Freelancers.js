import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import './Freelancers.css';
import { FaArrowRight, FaCheckCircle, FaSearch, FaStar, FaUserCircle } from 'react-icons/fa';
import { api } from '../utils/api';
import { defaultFreelancers } from '../data/defaultCatalog';

function Freelancers() {
  const { user } = useSelector((state) => state.users);
  const [freelancers, setFreelancers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchFreelancers = async () => {
      try {
        const response = await api.get('/api/catalog/freelancers');
        setFreelancers(Array.isArray(response.data) ? response.data : []);
        setError('');
      } catch (err) {
        setFreelancers(defaultFreelancers);
        setError('Showing local freelancer data because the server could not be reached.');
      } finally {
        setLoading(false);
      }
    };

    fetchFreelancers();
  }, []);

  const categories = useMemo(
    () => ['All', ...new Set(freelancers.map((item) => item.category).filter(Boolean))],
    [freelancers]
  );

  const filteredFreelancers = freelancers.filter((freelancer) => {
    const normalizedSearch = searchTerm.toLowerCase();
    const matchesSearch =
      (freelancer.name || '').toLowerCase().includes(normalizedSearch) ||
      (freelancer.roleTitle || freelancer.role || '').toLowerCase().includes(normalizedSearch) ||
      (freelancer.skills || []).some((skill) => skill.toLowerCase().includes(normalizedSearch));

    const matchesCategory = selectedCategory === 'All' || freelancer.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  const isFreelancerUser = user?.accountType === 'freelancer';

  return (
    <div className="freelancers-page">
      <div className="freelancers-container">
        {isFreelancerUser && (
          <div className="freelancer-studio-banner">
            <div>
              <strong>Freelancer Studio</strong>
              <p>Manage your private and public freelancer services from your profile dashboard.</p>
            </div>
            <button className="studio-banner-btn" onClick={() => navigate('/profile')}>
              Open Studio <FaArrowRight />
            </button>
          </div>
        )}

        <div className="freelancers-header">
          <h1 className="freelancers-title">Find Top Freelancers</h1>
          <p className="freelancers-subtitle">
            Connect with expert professionals to help you build and grow your startup.
          </p>
          {error && <p style={{ color: '#b45309', marginTop: '12px' }}>{error}</p>}
        </div>

        <div className="filters-section">
          <div className="search-box">
            <FaSearch className="search-icon" />
            <input
              type="text"
              placeholder="Search by name or skill..."
              className="search-input"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="category-filter">
            <select className="category-select" value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)}>
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="freelancers-grid">
          {loading ? (
            <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '40px', color: '#6b7280' }}>
              <h3>Loading freelancers...</h3>
            </div>
          ) : filteredFreelancers.length > 0 ? (
            filteredFreelancers.map((freelancer) => (
              <div key={freelancer._id || freelancer.id} className="freelancer-card">
                <div className="card-cover"></div>

                <div className="card-content">
                  <div className="profile-wrapper">
                    <div className="profile-img">
                      <FaUserCircle />
                    </div>
                    {freelancer.verified !== false && (
                      <div className="verified-badge-wrapper">
                        <FaCheckCircle className="verified-badge" title="Verified" />
                      </div>
                    )}
                  </div>

                  <div className="freelancer-info">
                    <h3 className="freelancer-name">{freelancer.name}</h3>
                    <p className="freelancer-role">{freelancer.roleTitle || freelancer.role}</p>

                    <div className="rating-badge">
                      <FaStar className="star-icon" />
                      <span>{freelancer.rating ?? 0}</span>
                      <span className="review-count">({freelancer.reviews ?? 0})</span>
                    </div>
                  </div>

                  <div className="card-stats">
                    <div className="stat-item">
                      <span className="stat-value">${freelancer.hourlyRate ?? freelancer.rate}</span>
                      <span className="stat-label">/hr</span>
                    </div>
                    <div className="stat-divider"></div>
                    <div className="stat-item">
                      <span className="stat-value">{freelancer.completedJobs ?? freelancer.reviews ?? 0}+</span>
                      <span className="stat-label">Projects</span>
                    </div>
                  </div>

                  <div className="skills-container">
                    {(freelancer.skills || []).slice(0, 3).map((skill, index) => (
                      <span key={index} className="skill-tag">
                        {skill}
                      </span>
                    ))}
                  </div>

                  <button className="view-profile-btn" onClick={() => navigate(`/freelancer/${freelancer._id || freelancer.id}`)}>
                    View Profile
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '40px', color: '#6b7280' }}>
              <h3>No public freelancers are available yet.</h3>
              <p>Approved freelancer services will appear here automatically.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Freelancers;
