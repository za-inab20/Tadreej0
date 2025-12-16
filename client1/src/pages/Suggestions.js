import React, { useState } from "react";
import "./Suggestions.css";
import { FaHandshake, FaBullhorn, FaChartLine, FaCloud, FaGavel, FaMoneyBillWave, FaExternalLinkAlt, FaStar } from "react-icons/fa";

const suggestionsData = [
  {
    id: 1,
    title: "GrowthHacker Agency",
    category: "Marketing",
    description: "Specialized in scaling startups from zero to one. They offer comprehensive growth strategies, SEO optimization, and viral marketing campaigns tailored for new products.",
    icon: <FaBullhorn />,
    tags: ["Growth Hacking", "SEO", "Social Media"],
    rating: 4.9,
    type: "Agency"
  },
  {
    id: 2,
    title: "VentureCapital Connect",
    category: "Funding",
    description: "A network connecting early-stage startups with angel investors and venture capitalists. They provide pitch deck reviews and introduction services.",
    icon: <FaMoneyBillWave />,
    tags: ["Investment", "Seed Funding", "Networking"],
    rating: 4.7,
    type: "Platform"
  },
  {
    id: 3,
    title: "LegalStart Pro",
    category: "Legal",
    description: "Affordable legal services for startups. Handle incorporation, trademark registration, and contract drafting with automated tools and expert review.",
    icon: <FaGavel />,
    tags: ["Incorporation", "IP Protection", "Contracts"],
    rating: 4.8,
    type: "Service"
  },
  {
    id: 4,
    title: "CloudScale Solutions",
    category: "Infrastructure",
    description: "Managed cloud infrastructure services for startups. They help you set up scalable architecture on AWS/Azure/GCP with cost-optimization in mind.",
    icon: <FaCloud />,
    tags: ["DevOps", "Cloud", "Scalability"],
    rating: 4.6,
    type: "Consultancy"
  },
  {
    id: 5,
    title: "MarketInsight Analytics",
    category: "Analytics",
    description: "Deep market research and competitor analysis reports. Understand your target audience and find product-market fit faster with data-driven insights.",
    icon: <FaChartLine />,
    tags: ["Market Research", "Data Analysis", "Strategy"],
    rating: 4.5,
    type: "SaaS"
  },
  {
    id: 6,
    title: "PartnerUp Network",
    category: "Networking",
    description: "Find co-founders, mentors, and strategic partners. A community-driven platform to help you build the right team for your startup journey.",
    icon: <FaHandshake />,
    tags: ["Co-founders", "Mentorship", "Community"],
    rating: 4.8,
    type: "Community"
  }
];

const categories = ["All", "Marketing", "Funding", "Legal", "Infrastructure", "Analytics", "Networking"];

function Suggestions() {
  const [selectedCategory, setSelectedCategory] = useState("All");

  const filteredSuggestions = suggestionsData.filter((suggestion) => {
    return selectedCategory === "All" || suggestion.category === selectedCategory;
  });

  return (
    <div className="suggestions-page">
      <div className="suggestions-container">
        <div className="suggestions-header">
          <div className="header-icon">
            <FaHandshake />
          </div>
          <h1 className="suggestions-title">Growth Partners & Resources</h1>
          <p className="suggestions-subtitle">
            Now that you've completed your roadmap, connect with top-tier companies and services 
            dedicated to helping your startup scale, secure funding, and succeed in the market.
          </p>
        </div>

        <div className="filters-section">
          <div className="category-tabs">
            {categories.map((cat) => (
              <button
                key={cat}
                className={`category-tab ${selectedCategory === cat ? "active" : ""}`}
                onClick={() => setSelectedCategory(cat)}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        <div className="suggestions-grid">
          {filteredSuggestions.length > 0 ? (
            filteredSuggestions.map((suggestion) => (
              <div key={suggestion.id} className="suggestion-card">
                <div className="card-icon" style={{ color: "#4f46e5" }}>
                  {suggestion.icon}
                </div>
                <h3 className="suggestion-title">{suggestion.title}</h3>
                <span className="suggestion-category">{suggestion.category}</span>
                <p className="suggestion-description">{suggestion.description}</p>
                
                <div className="suggestion-tags">
                  {suggestion.tags.map((tag, index) => (
                    <span key={index} className="tag">{tag}</span>
                  ))}
                </div>

                <div className="suggestion-footer">
                  <div className="metric">
                    <span className="metric-label">Rating:</span>
                    <span className="metric-value" style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#f59e0b' }}>
                      <FaStar /> {suggestion.rating}
                    </span>
                  </div>
                  <div className="metric">
                    <span className="metric-label">Type:</span>
                    <span className="metric-value" style={{ color: '#4b5563' }}>
                      {suggestion.type}
                    </span>
                  </div>
                </div>

                <button className="btn-explore">
                  <FaExternalLinkAlt style={{ marginRight: '8px', fontSize: '0.9rem' }} />
                  Visit Website
                </button>
              </div>
            ))
          ) : (
            <div style={{ gridColumn: "1 / -1", textAlign: "center", padding: "40px", color: "#6b7280" }}>
              <h3>No partners found for this category.</h3>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Suggestions;
