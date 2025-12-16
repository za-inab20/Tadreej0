import React from "react";
import { useNavigate } from "react-router-dom";
import "./Phases.css";
import { FaChartLine, FaFileContract, FaUsers, FaArrowLeft, FaArrowRight, FaHome } from "react-icons/fa";

function Phase2() {
  const navigate = useNavigate();

  return (
    <div className="phase-container">
      <div className="phase-header">
        <h1 className="phase-title">Phase 2: Business Planning</h1>
        <p className="phase-subtitle">
          Turn your idea into a structured plan. Define your business model, revenue streams, and operational strategy to build a solid foundation.
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
            <li>Develop a comprehensive business plan.</li>
            <li>Define your unique value proposition.</li>
            <li>Structure your revenue model.</li>
            <li>Plan your initial budget.</li>
          </ul>
        </div>

        {/* Action Items Card */}
        <div className="phase-card">
          <div className="card-icon icon-actions">
            <FaFileContract />
          </div>
          <h3 className="card-title">Action Items</h3>
          <ul className="card-list">
            <li>Draft your mission and vision statements.</li>
            <li>Complete a SWOT analysis.</li>
            <li>Register your business name.</li>
            <li>Set up a business bank account.</li>
          </ul>
        </div>

        {/* Resources Card */}
        <div className="phase-card">
          <div className="card-icon icon-resources">
            <FaUsers />
          </div>
          <h3 className="card-title">Resources</h3>
          <ul className="card-list">
            <li><a href="#">Business Plan Template</a></li>
            <li><a href="#">Guide to Legal Structures</a></li>
            <li><a href="#">Financial Projection Tools</a></li>
            <li><a href="#">SWOT Analysis Worksheet</a></li>
          </ul>
        </div>
      </div>

      <div className="phase-navigation">
        <button className="nav-btn btn-home" onClick={() => navigate("/roadmap")}>
          <FaHome /> Roadmap
        </button>
        
        <div style={{ display: 'flex', gap: '15px' }}>
          <button className="nav-btn btn-back" onClick={() => navigate("/phase1")}>
            <FaArrowLeft /> Previous
          </button>
          <button className="nav-btn btn-next" onClick={() => navigate("/phase3")}>
            Next Phase <FaArrowRight />
          </button>
        </div>
      </div>
    </div>
  );
}

export default Phase2;
