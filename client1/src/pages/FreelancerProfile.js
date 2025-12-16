import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./FreelancerProfile.css";
import { FaStar, FaUserCircle, FaMapMarkerAlt, FaClock, FaCheckCircle, FaArrowLeft } from "react-icons/fa";

// Dummy data (same as in Freelancers.js for consistency)
const freelancersData = [
  {
    id: 1,
    name: "Ahmed Ali",
    role: "Full Stack Developer",
    rating: 4.9,
    reviews: 120,
    rate: 45,
    skills: ["React", "Node.js", "MongoDB", "Express", "Redux", "AWS"],
    category: "Development",
    location: "Cairo, Egypt",
    joined: "Jan 2023",
    about: "I am a passionate Full Stack Developer with over 5 years of experience in building scalable web applications. I specialize in the MERN stack and have a proven track record of delivering high-quality code on time. I love solving complex problems and turning ideas into reality.",
    completedJobs: 45
  },
  {
    id: 2,
    name: "Sarah Smith",
    role: "UI/UX Designer",
    rating: 4.8,
    reviews: 85,
    rate: 55,
    skills: ["Figma", "Adobe XD", "Prototyping", "User Research", "Wireframing"],
    category: "Design",
    location: "London, UK",
    joined: "Mar 2022",
    about: "Creative UI/UX Designer focused on creating intuitive and engaging user experiences. I believe that good design is not just about how things look, but how they work. I have worked with startups and established companies to improve their product usability.",
    completedJobs: 32
  },
  {
    id: 3,
    name: "Mohamed Hassan",
    role: "Digital Marketer",
    rating: 4.7,
    reviews: 60,
    rate: 35,
    skills: ["SEO", "Google Ads", "Content Strategy", "Social Media", "Analytics"],
    category: "Marketing",
    location: "Dubai, UAE",
    joined: "Jun 2023",
    about: "Results-driven Digital Marketer with expertise in SEO and PPC campaigns. I help businesses increase their online visibility and drive targeted traffic to their websites. Let's grow your brand together!",
    completedJobs: 28
  },
  {
    id: 4,
    name: "Emily Davis",
    role: "Content Writer",
    rating: 4.9,
    reviews: 200,
    rate: 30,
    skills: ["Copywriting", "Blog Writing", "Editing", "SEO Writing", "Creative Writing"],
    category: "Writing",
    location: "New York, USA",
    joined: "Nov 2021",
    about: "Versatile Content Writer with a knack for storytelling. Whether you need blog posts, website copy, or marketing materials, I can craft compelling content that resonates with your audience and drives engagement.",
    completedJobs: 150
  },
  {
    id: 5,
    name: "John Doe",
    role: "Mobile App Developer",
    rating: 4.6,
    reviews: 45,
    rate: 60,
    skills: ["Flutter", "Dart", "Firebase", "iOS", "Android"],
    category: "Development",
    location: "Toronto, Canada",
    joined: "Feb 2024",
    about: "Mobile App Developer specializing in cross-platform development using Flutter. I build beautiful, high-performance apps for both iOS and Android. I am committed to writing clean, maintainable code.",
    completedJobs: 18
  },
  {
    id: 6,
    name: "Lisa Wang",
    role: "Graphic Designer",
    rating: 4.8,
    reviews: 95,
    rate: 40,
    skills: ["Photoshop", "Illustrator", "Branding", "Logo Design", "Print Design"],
    category: "Design",
    location: "Singapore",
    joined: "Aug 2022",
    about: "Visual storyteller and Graphic Designer. I help brands communicate their message through impactful visuals. From logo design to marketing collateral, I ensure your brand stands out from the crowd.",
    completedJobs: 65
  }
];

function FreelancerProfile() {
  const { id } = useParams();
  const navigate = useNavigate();
  const freelancer = freelancersData.find(f => f.id === parseInt(id));

  if (!freelancer) {
    return <div className="profile-container"><h2>Freelancer not found</h2></div>;
  }

  return (
    <div className="profile-container">
      <button className="btn-back-link" onClick={() => navigate("/freelancers")} style={{ background: 'none', border: 'none', color: '#6b7280', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '5px', marginBottom: '20px', fontSize: '1rem' }}>
        <FaArrowLeft /> Back to Freelancers
      </button>

      <div className="profile-header-card">
        <div className="profile-avatar">
          <FaUserCircle />
        </div>
        <div className="profile-info">
          <h1 className="profile-name">{freelancer.name}</h1>
          <p className="profile-role">{freelancer.role}</p>
          
          <div className="profile-stats">
            <div className="stat-item">
              <FaStar style={{ color: "#fbbf24" }} />
              <span className="stat-value">{freelancer.rating}</span>
              <span>({freelancer.reviews} reviews)</span>
            </div>
            <div className="stat-item">
              <FaMapMarkerAlt />
              <span>{freelancer.location}</span>
            </div>
            <div className="stat-item">
              <FaCheckCircle style={{ color: "#10b981" }} />
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
              {freelancer.skills.map((skill, index) => (
                <span key={index} className="skill-badge">{skill}</span>
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
              <p className="review-text">"Great work! Delivered on time and exceeded expectations. Highly recommended."</p>
            </div>
            <div className="review-item">
              <div className="review-header">
                <span className="reviewer-name">Startup Co.</span>
                <span className="review-date">1 month ago</span>
              </div>
              <div style={{ display: 'flex', gap: '2px', marginBottom: '5px', color: '#fbbf24' }}>
                <FaStar /><FaStar /><FaStar /><FaStar /><FaStar />
              </div>
              <p className="review-text">"Very professional and easy to communicate with. Will definitely hire again."</p>
            </div>
          </div>
        </div>

        <div className="right-column">
          <div className="sidebar-card">
            <h3 className="section-title" style={{ fontSize: '1.2rem' }}>Information</h3>
            <div className="info-row">
              <span className="info-label">Hourly Rate</span>
              <span className="info-value">${freelancer.rate}/hr</span>
            </div>
            <div className="info-row">
              <span className="info-label">Response Time</span>
              <span className="info-value">~ 1 hour</span>
            </div>
            <div className="info-row">
              <span className="info-label">Member Since</span>
              <span className="info-value">{freelancer.joined}</span>
            </div>
            <div className="info-row">
              <span className="info-label">Languages</span>
              <span className="info-value">English, Arabic</span>
            </div>
          </div>

          <div className="sidebar-card">
            <h3 className="section-title" style={{ fontSize: '1.2rem' }}>Certifications</h3>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
              <FaCheckCircle style={{ color: "#4f46e5" }} />
              <span>Top Rated Seller</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <FaCheckCircle style={{ color: "#4f46e5" }} />
              <span>Identity Verified</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default FreelancerProfile;
