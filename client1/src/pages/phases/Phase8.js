import React from "react";
import { useNavigate } from "react-router-dom";
import "./Phases.css";
import { FaChartLine, FaExpandArrowsAlt, FaUserPlus, FaArrowLeft, FaHome } from "react-icons/fa";

function Phase8() {
  const navigate = useNavigate();

  return (
    <div className="phase-container">
      <div className="phase-header">
        <h1 className="phase-title">Phase 8: Growth & Scaling</h1>
        <p className="phase-subtitle">
          Expand your reach and grow your business. Analyze performance data, optimize your funnel, and scale your operations to new heights.
        </p>
      </div>

      <div className="phase-content">
        {/* Objectives Card */}
        <div className="phase-card">
          <div className="card-icon icon-objectives">
            <FaChartLine />
          </div>
          <h3 className="card-title">Key Objectives</h3>
          <ul className="card-list">
            <li>Increase user retention.</li>
            <li>Grow revenue streams.</li>
            <li>Expand into new markets.</li>
            <li>Scale team and operations.</li>
          </ul>
        </div>

        {/* Action Items Card */}
        <div className="phase-card">
          <div className="card-icon icon-actions">
            <FaExpandArrowsAlt />
          </div>
          <h3 className="card-title">Action Items</h3>
          <ul className="card-list">
            <li>Analyze key performance metrics.</li>
            <li>Optimize sales and marketing funnels.</li>
            <li>Hire for key growth roles.</li>
            <li>Explore partnerships and collaborations.</li>
          </ul>
        </div>

        {/* Resources Card */}
        <div className="phase-card">
          <div className="card-icon icon-resources">
            <FaUserPlus />
          </div>
          <h3 className="card-title">Resources</h3>
          <ul className="card-list">
            <li><a href="#">Growth Hacking Strategies</a></li>
            <li><a href="#">Scaling Your Business Guide</a></li>
            <li><a href="#">Team Management Tools</a></li>
            <li><a href="#">Partnership Agreement Template</a></li>
          </ul>
        </div>
      </div>

      <div className="phase-navigation">
        <button className="nav-btn btn-home" onClick={() => navigate("/roadmap")}>
          <FaHome /> Roadmap
        </button>
        
        <div style={{ display: 'flex', gap: '15px' }}>
          <button className="nav-btn btn-back" onClick={() => navigate("/phase7")}>
            <FaArrowLeft /> Previous
          </button>
          {/* No Next button for the final phase */}
          <button className="nav-btn btn-next" disabled style={{ opacity: 0.5, cursor: 'not-allowed' }}>
            Completed
          </button>
        </div>
      </div>
    </div>
  );
}

export default Phase8;
