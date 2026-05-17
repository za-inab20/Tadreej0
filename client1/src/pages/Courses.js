import React, { useEffect, useMemo, useState } from 'react';
import './Courses.css';
import { FaSearch, FaStar, FaBookOpen, FaClock, FaChalkboardTeacher } from 'react-icons/fa';
import { api } from '../utils/api';
import { useT } from '../context/LangContext';
import { defaultCourses } from '../data/defaultCatalog';

const tokenize = (str) =>
  (str || '').toLowerCase().replace(/[^a-z0-9\s]/g, '').split(/\s+/).filter(Boolean);

const fuzzyScore = (query, target) => {
  const qTokens = tokenize(query);
  const tTokens = tokenize(target);
  if (!qTokens.length) return 1;
  let score = 0;
  for (const q of qTokens) {
    for (const t of tTokens) {
      if (t.includes(q) || q.includes(t)) { score += 2; continue; }
      let matches = 0;
      const len = Math.min(q.length, t.length);
      for (let i = 0; i < len; i++) if (q[i] === t[i]) matches++;
      if (matches / Math.max(q.length, t.length) > 0.6) score += 1;
    }
  }
  return score;
};

function Courses() {
  const t = useT();
  const [courses, setCourses] = useState(defaultCourses);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await api.get('/api/catalog/courses');
        if (Array.isArray(response.data) && response.data.length > 0) {
          setCourses(response.data);
        }
        setError('');
      } catch (err) {
        setError('{t.localDataWarning}');
      } finally {
        setLoading(false);
      }
    };
    fetchCourses();
  }, []);

  const categories = useMemo(
    () => ['All', ...new Set(courses.map((c) => c.category).filter(Boolean))],
    [courses]
  );

  const filteredCourses = useMemo(() => {
    const categoryFiltered = courses.filter(
      (c) => selectedCategory === 'All' || c.category === selectedCategory
    );
    if (!searchTerm.trim()) return categoryFiltered;

    return categoryFiltered
      .map((course) => {
        const haystack = [course.title, course.instructor, course.category, course.description]
          .filter(Boolean)
          .join(' ');
        return { course, score: fuzzyScore(searchTerm, haystack) };
      })
      .filter(({ score }) => score > 0)
      .sort((a, b) => b.score - a.score)
      .map(({ course }) => course);
  }, [courses, searchTerm, selectedCategory]);

  return (
    <div className="courses-container">
      <div className="courses-header">
        <h1 className="courses-title">{t.exploreCoursesTitle}</h1>
        <p className="courses-subtitle">
          {t.exploreCoursesSubtitle}
        </p>
        {error && <p style={{ color: '#b45309', marginTop: '12px' }}>{error}</p>}
      </div>

      <div className="filters-section">
        <div className="search-box">
          <FaSearch className="search-icon" />
          <input
            type="text"
            placeholder={t.searchCourses}
            className="search-input"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="category-filter">
          <select
            className="category-select"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
          >
            {categories.map((cat) => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="courses-grid">
        {loading ? (
          <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '40px', color: '#6b7280' }}>
            <h3>{t.loadingCourses}</h3>
          </div>
        ) : filteredCourses.length > 0 ? (
          filteredCourses.map((course) => (
            <div key={course._id || course.id} className="course-card">
              <div className="course-thumbnail">
                <FaBookOpen />
                <span className="course-badge">{course.level}</span>
              </div>
              <div className="course-body">
                <h3 className="course-title">{course.title}</h3>
                <div className="course-instructor">
                  <FaChalkboardTeacher style={{ marginRight: '6px' }} />
                  {course.instructor}
                </div>
                <p style={{ color: '#4b5563', minHeight: '50px' }}>
                  {course.description || 'Build practical skills with this course.'}
                </p>
                <div style={{ display: 'flex', alignItems: 'center', gap: '15px', fontSize: '0.85rem', color: '#6b7280', marginBottom: '15px' }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <FaClock /> {course.duration}
                  </span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <FaStar className="star-icon" /> {course.rating} ({course.reviews})
                  </span>
                </div>
                <div className="course-meta">
                  <span className="course-price">${course.price}</span>
                </div>
                <button className="enroll-btn">{t.enrollNow}</button>
              </div>
            </div>
          ))
        ) : (
          <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '40px', color: '#6b7280' }}>
            <h3>{t.noCoursesFound}</h3>
          </div>
        )}
      </div>
    </div>
  );
}

export default Courses;
