import React from "react";
import { useNavigate } from "react-router-dom";
import "./Phases.css";
import { FaRocket, FaCheckCircle, FaClipboardCheck, FaArrowLeft, FaArrowRight, FaHome } from "react-icons/fa";

function Phase7() {
  const navigate = useNavigate();

  return (
    <div className="phase-container">
      <div className="phase-header">
        <h1 className="phase-title">Phase 7: Launch Preparation</h1>
        <p className="phase-subtitle">
          Get ready for the big day. Ensure everything is in place for a smooth and successful product launch, from technical checks to PR.
        </p>
      </div>

      <div className="phase-content">
        {/* Objectives Card */}
        <div className="phase-card">
          <div className="card-icon icon-objectives">
            <FaRocket />
          </div>
          <h3 className="card-title">Key Objectives</h3>
          <ul className="card-list">
            <li>Finalize product for release.</li>
            <li>Prepare customer support channels.</li>
            <li>Plan the launch event.</li>
            <li>Generate pre-launch hype.</li>
          </ul>
        </div>

        {/* Action Items Card */}
        <div className="phase-card">
          <div className="card-icon icon-actions">
            <FaCheckCircle />
          </div>
          <h3 className="card-title">Action Items</h3>
          <ul className="card-list">
            <li>Conduct final beta testing.</li>
            <li>Write a press release.</li>
            <li>Create a launch day checklist.</li>
            <li>Set up analytics tracking.</li>
          </ul>
        </div>

        {/* Resources Card */}
        <div className="phase-card">
          <div className="card-icon icon-resources">
            <FaClipboardCheck />
          </div>
          <h3 className="card-title">Resources</h3>
          <ul className="card-list">
            <li><a href="#">Product Launch Checklist</a></li>
            <li><a href="#">Press Release Template</a></li>
            <li><a href="#">Customer Support Guide</a></li>
            <li><a href="#">Analytics Setup Guide</a></li>
          </ul>
        </div>
      </div>

      <div className="phase-navigation">
        <button className="nav-btn btn-home" onClick={() => navigate("/roadmap")}>
          <FaHome /> Roadmap
        </button>
        
        <div style={{ display: 'flex', gap: '15px' }}>
          <button className="nav-btn btn-back" onClick={() => navigate("/phase6")}>
            <FaArrowLeft /> Previous
          </button>
          <button className="nav-btn btn-next" onClick={() => navigate("/phase8")}>
            Next Phase <FaArrowRight />
          </button>
        </div>
      </div>
    </div>
  );
}

export default Phase7;
