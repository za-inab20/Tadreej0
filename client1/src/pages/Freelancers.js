import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Freelancers.css";
import { FaSearch, FaStar, FaUserCircle, FaCheckCircle } from "react-icons/fa";

const freelancersData = [
  {
    id: 1,
    name: "Ahmed Ali",
    role: "Full Stack Developer",
    rating: 4.9,
    reviews: 120,
    rate: 45,
    skills: ["React", "Node.js", "MongoDB"],
    category: "Development"
  },
  {
    id: 2,
    name: "Sarah Smith",
    role: "UI/UX Designer",
    rating: 4.8,
    reviews: 85,
    rate: 55,
    skills: ["Figma", "Adobe XD", "Prototyping"],
    category: "Design"
  },
  {
    id: 3,
    name: "Mohamed Hassan",
    role: "Digital Marketer",
    rating: 4.7,
    reviews: 60,
    rate: 35,
    skills: ["SEO", "Google Ads", "Content Strategy"],
    category: "Marketing"
  },
  {
    id: 4,
    name: "Emily Davis",
    role: "Content Writer",
    rating: 4.9,
    reviews: 200,
    rate: 30,
    skills: ["Copywriting", "Blog Writing", "Editing"],
    category: "Writing"
  },
  {
    id: 5,
    name: "John Doe",
    role: "Mobile App Developer",
    rating: 4.6,
    reviews: 45,
    rate: 60,
    skills: ["Flutter", "Dart", "Firebase"],
    category: "Development"
  },
  {
    id: 6,
    name: "Lisa Wang",
    role: "Graphic Designer",
    rating: 4.8,
    reviews: 95,
    rate: 40,
    skills: ["Photoshop", "Illustrator", "Branding"],
    category: "Design"
  }
];

const categories = ["All", "Development", "Design", "Marketing", "Writing"];

function Freelancers() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  const filteredFreelancers = freelancersData.filter((freelancer) => {
    const matchesSearch = freelancer.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          freelancer.role.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "All" || freelancer.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="freelancers-page">
      <div className="freelancers-container">
        <div className="freelancers-header">
          <h1 className="freelancers-title">Find Top Freelancers</h1>
          <p className="freelancers-subtitle">
            Connect with expert professionals to help you build and grow your startup.
          </p>
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

        <div className="freelancers-grid">
          {filteredFreelancers.length > 0 ? (
            filteredFreelancers.map((freelancer) => (
              <div key={freelancer.id} className="freelancer-card">
                <div className="card-cover"></div>
                
                <div className="card-content">
                  <div className="profile-wrapper">
                    <div className="profile-img">
                      <FaUserCircle />
                    </div>
                    <div className="verified-badge-wrapper">
                      <FaCheckCircle className="verified-badge" title="Verified" />
                    </div>
                  </div>

                  <div className="freelancer-info">
                    <h3 className="freelancer-name">{freelancer.name}</h3>
                    <p className="freelancer-role">{freelancer.role}</p>
                    
                    <div className="rating-badge">
                      <FaStar className="star-icon" />
                      <span>{freelancer.rating}</span>
                      <span className="review-count">({freelancer.reviews})</span>
                    </div>
                  </div>

                  <div className="card-stats">
                    <div className="stat-item">
                      <span className="stat-value">${freelancer.rate}</span>
                      <span className="stat-label">/hr</span>
                    </div>
                    <div className="stat-divider"></div>
                    <div className="stat-item">
                      <span className="stat-value">{freelancer.reviews}+</span>
                      <span className="stat-label">Projects</span>
                    </div>
                  </div>
                  
                  <div className="skills-container">
                    {freelancer.skills.slice(0, 3).map((skill, index) => (
                      <span key={index} className="skill-tag">{skill}</span>
                    ))}
                  </div>

                  <button className="view-profile-btn" onClick={() => navigate(`/freelancer/${freelancer.id}`)}>
                    View Profile
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div style={{ gridColumn: "1 / -1", textAlign: "center", padding: "40px", color: "#6b7280" }}>
              <h3>No freelancers found matching your criteria.</h3>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Freelancers;
