import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./ProjectIntro.css";

function ProjectIntro() {
  const [projectDesc, setProjectDesc] = useState("");
  const navigate = useNavigate();

  const handleSubmit = () => {
    if (!projectDesc.trim()) {
      alert("Please describe your project idea");
      return;
    }
    navigate("/roadmap");
  };

  return (
    <div className="project-intro-wrapper">
      <div className="project-intro-card">
        <h2 className="intro-title">Tell us about your project</h2>
        <p className="intro-subtitle">
          Write a short description of your business or startup idea to begin your journey.
        </p>

        <textarea
          className="project-textarea"
          rows="8"
          placeholder="Type your idea here..."
          value={projectDesc}
          onChange={(e) => setProjectDesc(e.target.value)}
        />

        <button className="btn-continue" onClick={handleSubmit}>
          Continue to Roadmap
        </button>
      </div>
    </div>
  );
}

export default ProjectIntro;
