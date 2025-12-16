import React from "react";
import { useNavigate } from "react-router-dom";
import "./Phases.css";
import { FaCode, FaLaptopCode, FaCogs, FaArrowLeft, FaArrowRight, FaHome } from "react-icons/fa";

function Phase5() {
  const navigate = useNavigate();

  return (
    <div className="phase-container">
      <div className="phase-header">
        <h1 className="phase-title">Phase 5: Product Development</h1>
        <p className="phase-subtitle">
          Build your Minimum Viable Product (MVP). Focus on core features that solve the primary problem for your users and iterate based on feedback.
        </p>
      </div>

      <div className="phase-content">
        {/* Objectives Card */}
        <div className="phase-card">
          <div className="card-icon icon-objectives">
            <FaCode />
          </div>
          <h3 className="card-title">Key Objectives</h3>
          <ul className="card-list">
            <li>Define MVP features.</li>
            <li>Design user interface (UI) and user experience (UX).</li>
            <li>Develop the core product.</li>
            <li>Conduct alpha testing.</li>
          </ul>
        </div>

        {/* Action Items Card */}
        <div className="phase-card">
          <div className="card-icon icon-actions">
            <FaLaptopCode />
          </div>
          <h3 className="card-title">Action Items</h3>
          <ul className="card-list">
            <li>Hire developers or freelancers.</li>
            <li>Create wireframes and prototypes.</li>
            <li>Set up development environment.</li>
            <li>Run initial tests with a small group.</li>
          </ul>
        </div>

        {/* Resources Card */}
        <div className="phase-card">
          <div className="card-icon icon-resources">
            <FaCogs />
          </div>
          <h3 className="card-title">Resources</h3>
          <ul className="card-list">
            <li><a href="#">MVP Development Guide</a></li>
            <li><a href="#">UI/UX Design Tools</a></li>
            <li><a href="#">Freelancer Platforms</a></li>
            <li><a href="#">Agile Methodology Basics</a></li>
          </ul>
        </div>
      </div>

      <div className="phase-navigation">
        <button className="nav-btn btn-home" onClick={() => navigate("/roadmap")}>
          <FaHome /> Roadmap
        </button>
        
        <div style={{ display: 'flex', gap: '15px' }}>
          <button className="nav-btn btn-back" onClick={() => navigate("/phase4")}>
            <FaArrowLeft /> Previous
          </button>
          <button className="nav-btn btn-next" onClick={() => navigate("/phase6")}>
            Next Phase <FaArrowRight />
          </button>
        </div>
      </div>
    </div>
  );
}

export default Phase5;
