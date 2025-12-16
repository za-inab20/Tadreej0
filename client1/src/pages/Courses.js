import React, { useState } from "react";
import "./Courses.css";
import { FaSearch, FaStar, FaBookOpen, FaClock, FaChalkboardTeacher } from "react-icons/fa";

const coursesData = [
  {
    id: 1,
    title: "Complete React Developer Course 2025",
    instructor: "John Doe",
    rating: 4.8,
    reviews: 1200,
    price: 49.99,
    duration: "40h",
    category: "Development",
    level: "Beginner"
  },
  {
    id: 2,
    title: "Digital Marketing Masterclass",
    instructor: "Sarah Smith",
    rating: 4.7,
    reviews: 850,
    price: 39.99,
    duration: "25h",
    category: "Marketing",
    level: "Intermediate"
  },
  {
    id: 3,
    title: "UI/UX Design Fundamentals",
    instructor: "Lisa Wang",
    rating: 4.9,
    reviews: 2000,
    price: 59.99,
    duration: "30h",
    category: "Design",
    level: "Beginner"
  },
  {
    id: 4,
    title: "Startup Business Planning 101",
    instructor: "Michael Brown",
    rating: 4.6,
    reviews: 500,
    price: 29.99,
    duration: "15h",
    category: "Business",
    level: "Beginner"
  },
  {
    id: 5,
    title: "Advanced Node.js & Microservices",
    instructor: "Ahmed Ali",
    rating: 4.8,
    reviews: 300,
    price: 69.99,
    duration: "50h",
    category: "Development",
    level: "Advanced"
  },
  {
    id: 6,
    title: "Copywriting for Conversions",
    instructor: "Emily Davis",
    rating: 4.7,
    reviews: 600,
    price: 34.99,
    duration: "10h",
    category: "Writing",
    level: "Intermediate"
  }
];

const categories = ["All", "Development", "Design", "Marketing", "Business", "Writing"];

function Courses() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  const filteredCourses = coursesData.filter((course) => {
    const matchesSearch = course.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          course.instructor.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "All" || course.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="courses-container">
      <div className="courses-header">
        <h1 className="courses-title">Explore Top Courses</h1>
        <p className="courses-subtitle">
          Master new skills with our curated collection of courses designed for entrepreneurs and creators.
        </p>
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
        {filteredCourses.length > 0 ? (
          filteredCourses.map((course) => (
            <div key={course.id} className="course-card">
              <div className="course-thumbnail">
                <FaBookOpen />
                <span className="course-badge">{course.level}</span>
              </div>
              
              <div className="course-body">
                <h3 className="course-title">{course.title}</h3>
                <div className="course-instructor">
                  <FaChalkboardTeacher style={{ marginRight: "6px" }} />
                  {course.instructor}
                </div>
                
                <div style={{ display: "flex", alignItems: "center", gap: "15px", fontSize: "0.85rem", color: "#6b7280", marginBottom: "15px" }}>
                  <span style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                    <FaClock /> {course.duration}
                  </span>
                  <span style={{ display: "flex", alignItems: "center", gap: "4px" }}>
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
          <div style={{ gridColumn: "1 / -1", textAlign: "center", padding: "40px", color: "#6b7280" }}>
            <h3>No courses found matching your criteria.</h3>
          </div>
        )}
      </div>
    </div>
  );
}

export default Courses;
