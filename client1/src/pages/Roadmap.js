import React, { useEffect, useMemo, useState } from "react";
import "./roadmap.css";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { useUserAuth } from "../context/UserAuthContext";
import { useT } from "../context/LangContext";
import { FaCheckCircle } from "react-icons/fa";

import ideaImg from "../assets/roadmap/idea.png";
import learning from "../assets/roadmap/learning.png";
import roadmapImg from "../assets/roadmap/roadmap.png";
import stages from "../assets/roadmap/stages.png";
import freelancerImg from "../assets/roadmap/freelancer.png";
import ai from "../assets/roadmap/ai.png";
import match from "../assets/roadmap/match.png";
import notify from "../assets/roadmap/notify.png";

const phaseImages = [ideaImg, learning, roadmapImg, stages, freelancerImg, ai, match, notify];
const phaseColors = ["#f8b400","#ff6b6b","#6bc1ff","#9b5de5","#00bbf9","#ff5e78","#f4a261","#2a9d8f"];
const phasePaths  = ["/phase1","/phase2","/phase3","/phase4","/phase5","/phase6","/phase7","/phase8"];
const phaseTitles = ["Idea Generation","Business Planning","Market Research","Funding & Resources","Product Development","Marketing Strategy","Launch Preparation","Growth & Scaling"];
const defaultDescs = [
  "Define and refine your project idea.",
  "Create a strong business plan and model.",
  "Analyze the market and competitors.",
  "Secure funding and required resources.",
  "Build and test your product.",
  "Prepare marketing and branding strategies.",
  "Prepare everything for product launch.",
  "Scale and grow your startup.",
];

function userKey(userId, base) {
  return userId ? `${base}_${userId}` : base;
}

export default function Roadmap() {
  const navigate = useNavigate();
  const t = useT();
  const { isLoggedIn } = useUserAuth();
  const { user } = useSelector((state) => state.users);
  const userId = user?._id || user?.email || null;

  const ROADMAP_KEY   = userKey(userId, "tadreej_ai_roadmap");
  const COMPLETED_KEY = userKey(userId, "tadreej_completed_phases");
  const IDEA_KEY      = userKey(userId, "tadreej_project_idea");

  const [aiRoadmap, setAiRoadmap] = useState(null);
  const [completed, setCompleted] = useState([]);
  const [startupIdea, setStartupIdea] = useState("");

  useEffect(() => {
    try {
      const stored = localStorage.getItem(ROADMAP_KEY);
      if (stored) setAiRoadmap(JSON.parse(stored));
      setCompleted(JSON.parse(localStorage.getItem(COMPLETED_KEY)) || []);
      setStartupIdea(localStorage.getItem(IDEA_KEY) || "");
    } catch {
      setAiRoadmap(null);
    }
  }, [userId, ROADMAP_KEY, COMPLETED_KEY, IDEA_KEY]);

  useEffect(() => {
    const progressLine = document.getElementById("timelineProgress");
    const updateLine = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (progressLine) progressLine.style.height = `${(scrollTop / docHeight) * 100}%`;
    };
    window.addEventListener("scroll", updateLine);
    return () => window.removeEventListener("scroll", updateLine);
  }, []);

  const roadmapData = useMemo(() => {
    return Array.from({ length: 8 }).map((_, idx) => {
      const aiPhase = aiRoadmap?.phases?.[idx];
      return {
        title: aiPhase?.title || phaseTitles[idx],
        desc:  aiPhase?.description || defaultDescs[idx],
        img:   phaseImages[idx],
        color: phaseColors[idx],
        path:  phasePaths[idx],
        idx,
      };
    });
  }, [aiRoadmap]);

  const completedCount = completed.length;

  const handleClick = (step) => {
    if (!isLoggedIn) { navigate("/login"); return; }
    navigate(step.path);
  };

  return (
    <div className="timeline-container">
      <div style={{ textAlign: "center", marginBottom: "8px" }}>
        <h2 style={{ marginBottom: "8px" }}>
          {startupIdea
            ? `${t.yourJourney}: ${startupIdea.length > 55 ? startupIdea.slice(0, 55) + "…" : startupIdea}`
            : t.roadmapTitle}
        </h2>
        {aiRoadmap && (
          <p style={{ color: "#6b7280", fontSize: "14px", marginBottom: "4px" }}>
            ✨ AI-personalized roadmap
          </p>
        )}
        <div style={{ display: "inline-flex", alignItems: "center", gap: "8px", background: "#f0fdf4", border: "1px solid #86efac", borderRadius: "20px", padding: "6px 16px", fontSize: "13px", color: "#15803d", fontWeight: 700 }}>
          <FaCheckCircle />
          {completedCount}/8 {t.phasesComplete}
        </div>
      </div>

      <div className="timeline-wrapper" style={{ marginTop: "32px" }}>
        <div className="timeline-line"></div>
        <div className="timeline-progress" id="timelineProgress"></div>

        {roadmapData.map((step) => {
          const done = completed.includes(step.idx);
          return (
            <div
              key={step.idx}
              className={`timeline-item ${step.idx % 2 === 0 ? "right" : "left"}`}
              onClick={() => handleClick(step)}
              style={{ cursor: "pointer" }}
            >
              <div
                className="content"
                style={{ borderColor: step.color, "--accent-color": step.color, opacity: done ? 0.82 : 1, position: "relative", overflow: "hidden" }}
              >
                {done && (
                  <div style={{ position: "absolute", top: "12px", right: "14px", background: "#dcfce7", color: "#15803d", borderRadius: "20px", padding: "3px 10px", fontSize: "11px", fontWeight: 700, display: "flex", alignItems: "center", gap: "4px" }}>
                    <FaCheckCircle style={{ fontSize: "10px" }} />{t.done}
                  </div>
                )}
                <div className="text-content">
                  <h3 style={{ marginBottom: "6px" }}>{step.title}</h3>
                  <p style={{ marginBottom: "10px" }}>{step.desc}</p>
                  <span style={{ fontSize: "12px", fontWeight: 700, color: step.color, display: "inline-flex", alignItems: "center", gap: "5px" }}>
                    {done ? t.reviewPhase : t.startPhase}
                  </span>
                </div>
                <img src={step.img} alt={step.title} className="roadmap-img" />
              </div>
              <span className="timeline-circle" style={{ backgroundColor: done ? "#10b981" : step.color }}>
                {done ? <FaCheckCircle style={{ fontSize: "14px" }} /> : step.idx + 1}
              </span>
            </div>
          );
        })}
      </div>

      {completedCount === 8 ? (
        <div style={{ textAlign: "center", marginTop: "48px", padding: "32px", background: "linear-gradient(135deg,#f0fdf4,#dcfce7)", borderRadius: "24px", border: "2px solid #86efac" }}>
          <div style={{ fontSize: "48px", marginBottom: "12px" }}>🏆</div>
          <h2 style={{ color: "#15803d", margin: "0 0 8px" }}>{t.journeyComplete}</h2>
          <p style={{ color: "#166534" }}>{t.journeyCompleteMsg}</p>
        </div>
      ) : (
        <h2 className="text-center mt-5">Your Success Starts Here!</h2>
      )}
    </div>
  );
}
