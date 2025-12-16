import React from "react";
import { useNavigate } from "react-router-dom";
import "./Phases.css";
import { FaBullhorn, FaHashtag, FaAd, FaArrowLeft, FaArrowRight, FaHome } from "react-icons/fa";

function Phase6() {
  const navigate = useNavigate();

  return (
    <div className="phase-container">
      <div className="phase-header">
        <h1 className="phase-title">Phase 6: Marketing Strategy</h1>
        <p className="phase-subtitle">
          Create a buzz around your product. Develop a strong brand identity and reach your target audience effectively through various channels.
        </p>
      </div>

      <div className="phase-content">
        {/* Objectives Card */}
        <div className="phase-card">
          <div className="card-icon icon-objectives">
            <FaBullhorn />
          </div>
          <h3 className="card-title">Key Objectives</h3>
          <ul className="card-list">
            <li>Build brand awareness.</li>
            <li>Define marketing channels.</li>
            <li>Create a content strategy.</li>
            <li>Acquire early adopters.</li>
          </ul>
        </div>

        {/* Action Items Card */}
        <div className="phase-card">
          <div className="card-icon icon-actions">
            <FaHashtag />
          </div>
          <h3 className="card-title">Action Items</h3>
          <ul className="card-list">
            <li>Set up social media profiles.</li>
            <li>Create a content calendar.</li>
            <li>Launch an email marketing campaign.</li>
            <li>Optimize website for SEO.</li>
          </ul>
        </div>

        {/* Resources Card */}
        <div className="phase-card">
          <div className="card-icon icon-resources">
            <FaAd />
          </div>
          <h3 className="card-title">Resources</h3>
          <ul className="card-list">
            <li><a href="#">Social Media Marketing Guide</a></li>
            <li><a href="#">SEO Checklist</a></li>
            <li><a href="#">Content Calendar Template</a></li>
            <li><a href="#">Email Marketing Tools</a></li>
          </ul>
        </div>
      </div>

      <div className="phase-navigation">
        <button className="nav-btn btn-home" onClick={() => navigate("/roadmap")}>
          <FaHome /> Roadmap
        </button>
        
        <div style={{ display: 'flex', gap: '15px' }}>
          <button className="nav-btn btn-back" onClick={() => navigate("/phase5")}>
            <FaArrowLeft /> Previous
          </button>
          <button className="nav-btn btn-next" onClick={() => navigate("/phase7")}>
            Next Phase <FaArrowRight />
          </button>
        </div>
      </div>
    </div>
  );
}

export default Phase6;
