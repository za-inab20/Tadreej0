import React, { useEffect, useMemo, useState } from 'react';
import './Courses.css';
import { FaSearch, FaStar, FaBookOpen, FaClock, FaChalkboardTeacher } from 'react-icons/fa';
import { api } from '../utils/api';
import { defaultCourses } from '../data/defaultCatalog';

function Courses() {
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
        setError('Showing local course data because the server could not be reached.');
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  const categories = useMemo(() => ['All', ...new Set(courses.map((course) => course.category).filter(Boolean))], [courses]);

  const filteredCourses = courses.filter((course) => {
    const title = course.title || '';
    const instructor = course.instructor || '';
    const matchesSearch =
      title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      instructor.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || course.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="courses-container">
      <div className="courses-header">
        <h1 className="courses-title">Explore Top Courses</h1>
        <p className="courses-subtitle">
          Master new skills with our curated collection of courses designed for entrepreneurs and creators.
        </p>
        {error && <p style={{ color: '#b45309', marginTop: '12px' }}>{error}</p>}
      </div>

      <div className="filters-section">
        <div className="search-box">
          <FaSearch className="search-icon" />
          <input
            type="text"
            placeholder="Search for courses..."
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

      <div className="courses-grid">
        {loading ? (
          <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '40px', color: '#6b7280' }}>
            <h3>Loading courses...</h3>
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

                <p style={{ color: '#4b5563', minHeight: '50px' }}>{course.description || 'Build practical skills with this course.'}</p>

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

                <button className="enroll-btn">Enroll Now</button>
              </div>
            </div>
          ))
        ) : (
          <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '40px', color: '#6b7280' }}>
            <h3>No courses found matching your criteria.</h3>
          </div>
        )}
      </div>
    </div>
  );
}

export default Courses;
