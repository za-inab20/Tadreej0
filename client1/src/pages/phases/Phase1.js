import React from "react";
import { useNavigate } from "react-router-dom";
import "./Phases.css";
import { FaLightbulb, FaTasks, FaTools, FaArrowLeft, FaArrowRight, FaHome } from "react-icons/fa";

function Phase1() {
  const navigate = useNavigate();

  return (
    <div className="phase-container">
      <div className="phase-header">
        <h1 className="phase-title">Phase 1: Idea Generation</h1>
        <p className="phase-subtitle">
          Every great startup begins with a spark. In this phase, you will identify problems, brainstorm solutions, and validate your initial concepts.
        </p>
      </div>

      <div className="phase-content">
        {/* Objectives Card */}
        <div className="phase-card">
          <div className="card-icon icon-objectives">
            <FaLightbulb />
          </div>
          <h3 className="card-title">Key Objectives</h3>
          <ul className="card-list">
            <li>Identify a problem worth solving.</li>
            <li>Brainstorm potential solutions.</li>
            <li>Conduct initial market research.</li>
            <li>Define your target audience.</li>
          </ul>
        </div>

        {/* Action Items Card */}
        <div className="phase-card">
          <div className="card-icon icon-actions">
            <FaTasks />
          </div>
          <h3 className="card-title">Action Items</h3>
          <ul className="card-list">
            <li>Write down 10 startup ideas.</li>
            <li>Interview 5 potential customers.</li>
            <li>Create a lean canvas model.</li>
            <li>Analyze 3 competitors.</li>
          </ul>
        </div>

        {/* Resources Card */}
        <div className="phase-card">
          <div className="card-icon icon-resources">
            <FaTools />
          </div>
          <h3 className="card-title">Resources</h3>
          <ul className="card-list">
            <li><a href="#">How to Brainstorm Ideas</a></li>
            <li><a href="#">Lean Canvas Template</a></li>
            <li><a href="#">Market Research Guide</a></li>
            <li><a href="#">Customer Interview Script</a></li>
          </ul>
        </div>
      </div>

      <div className="phase-navigation">
        <button className="nav-btn btn-home" onClick={() => navigate("/roadmap")}>
          <FaHome /> Roadmap
        </button>
        
        <div style={{ display: 'flex', gap: '15px' }}>
          <button className="nav-btn btn-back" disabled style={{ opacity: 0.5, cursor: 'not-allowed' }}>
            <FaArrowLeft /> Previous
          </button>
          <button className="nav-btn btn-next" onClick={() => navigate("/phase2")}>
            Next Phase <FaArrowRight />
          </button>
        </div>
      </div>
    </div>
  );
}

export default Phase1;
