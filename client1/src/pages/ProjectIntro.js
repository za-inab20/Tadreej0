import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { api } from "../utils/api";
import { useT } from "../context/LangContext";
import "./ProjectIntro.css";

const PHASE_NAMES = [
  "Idea Generation", "Business Planning", "Market Research",
  "Funding & Resources", "Product Development", "Marketing Strategy",
  "Launch Preparation", "Growth & Scaling",
];

function userKey(userId, base) {
  return userId ? `${base}_${userId}` : base;
}

async function fetchCatalogData() {
  try {
    const [cRes, fRes] = await Promise.all([
      api.get("/api/catalog/courses"),
      api.get("/api/catalog/freelancers"),
    ]);
    return {
      courses: Array.isArray(cRes.data) ? cRes.data : [],
      freelancers: Array.isArray(fRes.data) ? fRes.data : [],
    };
  } catch {
    return { courses: [], freelancers: [] };
  }
}


async function generateRoadmap(idea, courses, freelancers) {
  const courseSummary = courses.slice(0, 10)
    .map((c) => `- "${c.title}" by ${c.instructor} (${c.category})`).join("\n");
  const freelancerSummary = freelancers.slice(0, 10)
    .map((f) => `- ${f.name}: ${f.roleTitle} (${f.category}, $${f.hourlyRate}/hr)`).join("\n");

  const systemPrompt = `You are a startup advisor. Given a startup idea, generate a personalized 8-phase roadmap.
Return ONLY valid JSON in this exact shape (no markdown, no extra text):
{
  "phases": [
    {
      "title": "Phase title",
      "description": "2-3 sentence description tailored to the idea",
      "objectives": ["objective 1", "objective 2", "objective 3"],
      "actions": ["action 1", "action 2", "action 3"],
      "recommendedCourses": ["exact course title if relevant, else empty"],
      "recommendedFreelancers": ["freelancer name + role if relevant, else empty"]
    }
  ]
}
The 8 phases must follow this order: ${PHASE_NAMES.join(", ")}.
Use the provided platform resources when they fit the phase.`;

  const userMsg = `Startup idea: ${idea}

Available courses on the platform:
${courseSummary || "None available"}

Available freelancers on the platform:
${freelancerSummary || "None available"}

Generate the 8-phase roadmap as JSON.`;

  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.REACT_APP_OPENAI_KEY}`,
    },
    body: JSON.stringify({
      model: "gpt-3.5-turbo",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userMsg },
      ],
      temperature: 0.7,
      max_tokens: 2000,
    }),
  });

  if (!response.ok) throw new Error("OpenAI request failed");
  const data = await response.json();
  const raw = data.choices?.[0]?.message?.content || "";
  return JSON.parse(raw.replace(/```json|```/g, "").trim());
}

function ProjectIntro() {
  const t = useT();
  const { user } = useSelector((state) => state.users);
  const userId = user?._id || user?.email || null;

  const IDEA_KEY = userKey(userId, "tadreej_project_idea");
  const ROADMAP_KEY = userKey(userId, "tadreej_ai_roadmap");

  const [projectDesc, setProjectDesc] = useState(
    () => localStorage.getItem(IDEA_KEY) || ""
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async () => {
    const trimmed = projectDesc.trim();
    if (!trimmed) { alert("Please describe your project idea"); return; }
    setLoading(true);
    setError("");
    try {
      const { courses, freelancers } = await fetchCatalogData();
      const roadmap = await generateRoadmap(trimmed, courses, freelancers);
      localStorage.setItem(IDEA_KEY, trimmed);
      localStorage.setItem(ROADMAP_KEY, JSON.stringify(roadmap));
      navigate("/roadmap");
    } catch {
      setError("{t.roadmapError}");
      setLoading(false);
    }
  };

  const handleSkip = () => {
    const trimmed = projectDesc.trim();
    if (trimmed) localStorage.setItem(IDEA_KEY, trimmed);
    localStorage.removeItem(ROADMAP_KEY);
    navigate("/roadmap");
  };

  return (
    <div className="project-intro-wrapper">
      <div className="project-intro-card">
        <h2 className="intro-title">{t.tellUsTitle}</h2>
        <p className="intro-subtitle">
          {t.tellUsSubtitle}
        </p>

        <textarea
          className="project-textarea"
          rows="8"
          placeholder={t.ideaPlaceholder}
          value={projectDesc}
          onChange={(e) => setProjectDesc(e.target.value)}
          disabled={loading}
        />

        {error && (
          <div style={{ color: "#dc2626", marginBottom: "16px", fontSize: "14px", textAlign: "center" }}>
            {error}
            <button
              onClick={handleSkip}
              style={{ marginLeft: "10px", background: "none", border: "none", color: "#4f46e5", cursor: "pointer", textDecoration: "underline", fontSize: "14px" }}
            >
              Continue without AI
            </button>
          </div>
        )}

        <button className="btn-continue" onClick={handleSubmit} disabled={loading}>
          {loading ? (
            <span style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "10px" }}>
              <span style={{ width: "18px", height: "18px", border: "3px solid rgba(255,255,255,0.4)", borderTopColor: "#fff", borderRadius: "50%", display: "inline-block", animation: "spin 0.8s linear infinite" }} />
              {t.buildingRoadmap}
            </span>
          ) : t.continueRoadmap}
        </button>

        {!loading && (
          <button onClick={handleSkip} style={{ marginTop: "12px", width: "100%", background: "none", border: "none", color: "#94a3b8", cursor: "pointer", fontSize: "14px" }}>
            {t.skipAI}
          </button>
        )}
      </div>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}

export default ProjectIntro;
