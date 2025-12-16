import React, { useEffect } from "react";
import "./roadmap.css";
import AOS from "aos";
import "aos/dist/aos.css";
import { useNavigate } from "react-router-dom";
import { useUserAuth } from "../context/UserAuthContext";

import idea from "../assets/roadmap/idea.png";
import learning from "../assets/roadmap/learning.png";
import roadmapImg from "../assets/roadmap/roadmap.png";
import stages from "../assets/roadmap/stages.png";
import freelancer from "../assets/roadmap/freelancer.png";
import ai from "../assets/roadmap/ai.png";
import match from "../assets/roadmap/match.png";
import notify from "../assets/roadmap/notify.png";

export default function Roadmap() {
  const navigate = useNavigate();
  const { isLoggedIn } = useUserAuth();

  const roadmapData = [
    { title: "Idea Generation", path: "/phase1", desc: "Define and refine your project idea.", img: idea, color: "#f8b400" },
    { title: "Business Planning", path: "/phase2", desc: "Create a strong business plan and model.", img: learning, color: "#ff6b6b" },
    { title: "Market Research", path: "/phase3", desc: "Analyze the market and competitors.", img: roadmapImg, color: "#6bc1ff" },
    { title: "Funding & Resources", path: "/phase4", desc: "Secure funding and required resources.", img: stages, color: "#9b5de5" },
    { title: "Product Development", path: "/phase5", desc: "Build and test your product.", img: freelancer, color: "#00bbf9" },
    { title: "Marketing Strategy", path: "/phase6", desc: "Prepare marketing and branding strategies.", img: ai, color: "#ff5e78" },
    { title: "Launch Preparation", path: "/phase7", desc: "Prepare everything for product launch.", img: match, color: "#f4a261" },
    { title: "Growth & Scaling", path: "/phase8", desc: "Scale and grow your startup.", img: notify, color: "#2a9d8f" }
  ];

  useEffect(() => {
    // AOS.init({ duration: 1000, offset: 120 });

    const progressLine = document.getElementById("timelineProgress");

    const updateLine = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const scrollPercent = (scrollTop / docHeight) * 100;
      if (progressLine) progressLine.style.height = `${scrollPercent}%`;
    };

    window.addEventListener("scroll", updateLine);
    return () => window.removeEventListener("scroll", updateLine);
  }, []);

  return (
    <div className="timeline-container">
      <h2 className="text-center mb-5">Tadreej Journey Roadmap</h2>

      <div className="timeline-wrapper">
        <div className="timeline-line"></div>
        <div className="timeline-progress" id="timelineProgress"></div>

        {roadmapData.map((step, index) => (
          <div
            key={index}
            className={`timeline-item ${index % 2 === 0 ? "right" : "left"}`}
            onClick={() => isLoggedIn ? navigate(step.path) : navigate("/login")}
            style={{ cursor: "pointer" }}
          >
            <div className="content" style={{ borderColor: step.color }}>
              <div className="text-content">
                <h3 style={{ color: step.color }}>{step.title}</h3>
                <p>{step.desc}</p>
              </div>
              <img src={step.img} alt={step.title} className="roadmap-img" />
            </div>

            <span
              className="timeline-circle"
              style={{ backgroundColor: step.color }}
            >
              {index + 1}
            </span>
          </div>
        ))}
      </div>

      <h2 className="text-center mt-5">Your Success Starts Here!</h2>
    </div>
  );
}
