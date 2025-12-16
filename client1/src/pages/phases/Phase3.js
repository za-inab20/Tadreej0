import React from "react";
import { useNavigate } from "react-router-dom";
import "./Phases.css";
import { FaSearch, FaChartPie, FaGlobe, FaArrowLeft, FaArrowRight, FaHome } from "react-icons/fa";

function Phase3() {
  const navigate = useNavigate();

  return (
    <div className="phase-container">
      <div className="phase-header">
        <h1 className="phase-title">Phase 3: Market Research</h1>
        <p className="phase-subtitle">
          Analyze the market landscape, understand your competitors, and identify your target audience's needs to position your startup for success.
        </p>
      </div>

      <div className="phase-content">
        {/* Objectives Card */}
        <div className="phase-card">
          <div className="card-icon icon-objectives">
            <FaSearch />
          </div>
          <h3 className="card-title">Key Objectives</h3>
          <ul className="card-list">
            <li>Analyze market trends and size.</li>
            <li>Identify direct and indirect competitors.</li>
            <li>Understand customer pain points.</li>
            <li>Validate product-market fit.</li>
          </ul>
        </div>

        {/* Action Items Card */}
        <div className="phase-card">
          <div className="card-icon icon-actions">
            <FaChartPie />
          </div>
          <h3 className="card-title">Action Items</h3>
          <ul className="card-list">
            <li>Conduct a competitor analysis matrix.</li>
            <li>Survey potential customers.</li>
            <li>Analyze industry reports.</li>
            <li>Define your buyer persona.</li>
          </ul>
        </div>

        {/* Resources Card */}
        <div className="phase-card">
          <div className="card-icon icon-resources">
            <FaGlobe />
          </div>
          <h3 className="card-title">Resources</h3>
          <ul className="card-list">
            <li><a href="#">Market Research Tools</a></li>
            <li><a href="#">Competitor Analysis Template</a></li>
            <li><a href="#">Customer Survey Guide</a></li>
            <li><a href="#">Industry Analysis Reports</a></li>
          </ul>
        </div>
      </div>

      <div className="phase-navigation">
        <button className="nav-btn btn-home" onClick={() => navigate("/roadmap")}>
          <FaHome /> Roadmap
        </button>
        
        <div style={{ display: 'flex', gap: '15px' }}>
          <button className="nav-btn btn-back" onClick={() => navigate("/phase2")}>
            <FaArrowLeft /> Previous
          </button>
          <button className="nav-btn btn-next" onClick={() => navigate("/phase4")}>
            Next Phase <FaArrowRight />
          </button>
        </div>
      </div>
    </div>
  );
}

export default Phase3;
