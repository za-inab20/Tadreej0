import React from "react";
import { useNavigate } from "react-router-dom";
import "./Phases.css";
import { FaMoneyBillWave, FaHandshake, FaBriefcase, FaArrowLeft, FaArrowRight, FaHome } from "react-icons/fa";

function Phase4() {
  const navigate = useNavigate();

  return (
    <div className="phase-container">
      <div className="phase-header">
        <h1 className="phase-title">Phase 4: Funding & Resources</h1>
        <p className="phase-subtitle">
          Secure the necessary capital and resources to bring your vision to life. Explore bootstrapping, investors, and grants to fuel your startup's growth.
        </p>
      </div>

      <div className="phase-content">
        {/* Objectives Card */}
        <div className="phase-card">
          <div className="card-icon icon-objectives">
            <FaMoneyBillWave />
          </div>
          <h3 className="card-title">Key Objectives</h3>
          <ul className="card-list">
            <li>Determine funding requirements.</li>
            <li>Identify potential funding sources.</li>
            <li>Prepare financial projections.</li>
            <li>Secure initial capital.</li>
          </ul>
        </div>

        {/* Action Items Card */}
        <div className="phase-card">
          <div className="card-icon icon-actions">
            <FaHandshake />
          </div>
          <h3 className="card-title">Action Items</h3>
          <ul className="card-list">
            <li>Create a compelling pitch deck.</li>
            <li>Apply for startup grants.</li>
            <li>Network with angel investors.</li>
            <li>Explore crowdfunding platforms.</li>
          </ul>
        </div>

        {/* Resources Card */}
        <div className="phase-card">
          <div className="card-icon icon-resources">
            <FaBriefcase />
          </div>
          <h3 className="card-title">Resources</h3>
          <ul className="card-list">
            <li><a href="#">Pitch Deck Templates</a></li>
            <li><a href="#">List of Startup Grants</a></li>
            <li><a href="#">Crowdfunding Guide</a></li>
            <li><a href="#">Financial Modeling Tools</a></li>
          </ul>
        </div>
      </div>

      <div className="phase-navigation">
        <button className="nav-btn btn-home" onClick={() => navigate("/roadmap")}>
          <FaHome /> Roadmap
        </button>
        
        <div style={{ display: 'flex', gap: '15px' }}>
          <button className="nav-btn btn-back" onClick={() => navigate("/phase3")}>
            <FaArrowLeft /> Previous
          </button>
          <button className="nav-btn btn-next" onClick={() => navigate("/phase5")}>
            Next Phase <FaArrowRight />
          </button>
        </div>
      </div>
    </div>
  );
}

export default Phase4;
