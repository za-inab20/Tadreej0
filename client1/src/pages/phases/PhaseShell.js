import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import {
  FaArrowLeft,
  FaArrowRight,
  FaCheck,
  FaCheckCircle,
  FaHome,
  FaLock,
  FaTrophy,
} from "react-icons/fa";
import { useT } from "../../context/LangContext";
import "./PhaseShell.css";

function userKey(userId, base) {
  return userId ? `${base}_${userId}` : base;
}

function getAiPhase(phaseIndex, roadmapKey) {
  try {
    const raw = localStorage.getItem(roadmapKey);
    if (!raw) return null;
    const data = JSON.parse(raw);
    return data?.phases?.[phaseIndex] || null;
  } catch {
    return null;
  }
}

function loadTaskState(tasksKey, phaseIndex) {
  try {
    const raw = localStorage.getItem(tasksKey);
    const all = raw ? JSON.parse(raw) : {};
    return all[phaseIndex] || {};
  } catch {
    return {};
  }
}

function saveTaskState(tasksKey, phaseIndex, state) {
  try {
    const raw = localStorage.getItem(tasksKey);
    const all = raw ? JSON.parse(raw) : {};
    all[phaseIndex] = state;
    localStorage.setItem(tasksKey, JSON.stringify(all));
  } catch {}
}

function isPhaseCompleted(completedKey, idx) {
  try {
    return (JSON.parse(localStorage.getItem(completedKey)) || []).includes(idx);
  } catch {
    return false;
  }
}

function markPhaseCompleted(completedKey, idx, done) {
  try {
    const list = JSON.parse(localStorage.getItem(completedKey)) || [];
    const next = done
      ? [...new Set([...list, idx])]
      : list.filter((i) => i !== idx);
    localStorage.setItem(completedKey, JSON.stringify(next));
  } catch {}
}

function ProgressRing({ pct, color, size = 56 }) {
  const r = (size - 8) / 2;
  const circ = 2 * Math.PI * r;
  const offset = circ - (pct / 100) * circ;
  return (
    <svg
      width={size}
      height={size}
      style={{ transform: "rotate(-90deg)", flexShrink: 0 }}
    >
      <circle
        cx={size / 2}
        cy={size / 2}
        r={r}
        fill="none"
        stroke="#e2e8f0"
        strokeWidth={5}
      />
      <circle
        cx={size / 2}
        cy={size / 2}
        r={r}
        fill="none"
        stroke={color}
        strokeWidth={5}
        strokeDasharray={circ}
        strokeDashoffset={offset}
        strokeLinecap="round"
        style={{ transition: "stroke-dashoffset 0.5s ease" }}
      />
      <text
        x="50%"
        y="50%"
        dominantBaseline="central"
        textAnchor="middle"
        style={{
          transform: "rotate(90deg)",
          transformOrigin: "50% 50%",
          fill: color,
          fontSize: "11px",
          fontWeight: 700,
        }}
      >
        {pct}%
      </text>
    </svg>
  );
}

function TaskItem({ task, done, onToggle, accent }) {
  return (
    <div
      className={`ps-task-item ${done ? "done" : ""}`}
      onClick={onToggle}
      style={{ "--accent": accent }}
    >
      <span className={`ps-task-check ${done ? "checked" : ""}`}>
        {done && <FaCheck style={{ fontSize: "11px" }} />}
      </span>
      <span className="ps-task-label">{task}</span>
    </div>
  );
}

function NoteEditor({ noteKey, accent }) {
  const [note, setNote] = useState(() => localStorage.getItem(noteKey) || "");
  const [saved, setSaved] = useState(false);
  const timerRef = useRef(null);

  const handleChange = (e) => {
    const val = e.target.value;
    setNote(val);
    setSaved(false);
    clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      localStorage.setItem(noteKey, val);
      setSaved(true);
    }, 800);
  };

  return (
    <div className="ps-note-wrap">
      <div className="ps-note-header">
        <span>📝 My Notes</span>
        {saved && (
          <span style={{ fontSize: "12px", color: "#10b981" }}>Saved</span>
        )}
      </div>
      <textarea
        className="ps-note-area"
        style={{ "--accent": accent }}
        placeholder="Jot down your thoughts, ideas, or action notes here..."
        value={note}
        onChange={handleChange}
        rows={4}
      />
    </div>
  );
}

function ConfettiPop() {
  return (
    <div className="ps-confetti-wrap" aria-hidden>
      {Array.from({ length: 28 }).map((_, i) => (
        <span
          key={i}
          className="ps-confetti-dot"
          style={{
            "--x": `${Math.random() * 100}%`,
            "--delay": `${Math.random() * 0.4}s`,
            "--size": `${6 + Math.random() * 8}px`,
            backgroundColor: [
              "#f8b400",
              "#4f46e5",
              "#10b981",
              "#ff5e78",
              "#00bbf9",
            ][i % 5],
          }}
        />
      ))}
    </div>
  );
}

export default function PhaseShell({ phaseIndex, accentColor, defaultData }) {
  const t = useT();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.users);
  const userId = user?._id || user?.email || null;

  const ROADMAP_KEY = userKey(userId, "tadreej_ai_roadmap");
  const COMPLETED_KEY = userKey(userId, "tadreej_completed_phases");
  const TASKS_KEY = userKey(userId, "tadreej_phase_tasks");
  const NOTE_KEY = userKey(userId, `tadreej_note_${phaseIndex}`);

  const aiPhase = getAiPhase(phaseIndex, ROADMAP_KEY);
  const phase = aiPhase
    ? {
        title: aiPhase.title || defaultData.title,
        subtitle: aiPhase.description || defaultData.subtitle,
        objectives: aiPhase.objectives?.length
          ? aiPhase.objectives
          : defaultData.objectives,
        actions: aiPhase.actions?.length
          ? aiPhase.actions
          : defaultData.actions,
        courses: aiPhase.recommendedCourses?.filter(Boolean) || [],
        freelancers: aiPhase.recommendedFreelancers?.filter(Boolean) || [],
      }
    : defaultData;

  const allTasks = [...(phase.objectives || []), ...(phase.actions || [])];

  const [taskState, setTaskState] = useState(() =>
    loadTaskState(TASKS_KEY, phaseIndex),
  );
  const [showCelebration, setShowCelebration] = useState(false);
  const [alreadyDone] = useState(() =>
    isPhaseCompleted(COMPLETED_KEY, phaseIndex),
  );
  const celebratedRef = useRef(false);

  const completedCount = allTasks.filter((_, i) => taskState[i]).length;
  const pct = allTasks.length
    ? Math.round((completedCount / allTasks.length) * 100)
    : 0;
  const allDone = pct === 100;

  useEffect(() => {
    if (allDone && !celebratedRef.current && !alreadyDone) {
      celebratedRef.current = true;
      markPhaseCompleted(COMPLETED_KEY, phaseIndex, true);
      setShowCelebration(true);
      setTimeout(() => setShowCelebration(false), 3200);
    }
  }, [allDone, phaseIndex, alreadyDone, COMPLETED_KEY]);

  const toggleTask = (idx) => {
    setTaskState((prev) => {
      const next = { ...prev, [idx]: !prev[idx] };
      saveTaskState(TASKS_KEY, phaseIndex, next);
      return next;
    });
  };

  const prevPath = phaseIndex > 0 ? `/phase${phaseIndex}` : null;
  const nextPath = phaseIndex < 7 ? `/phase${phaseIndex + 2}` : null;

  return (
    <div className="ps-container">
      {showCelebration && <ConfettiPop />}

      <div className="ps-hero" style={{ "--accent": accentColor }}>
        <div className="ps-hero-inner">
          <div className="ps-badge" style={{ background: accentColor }}>
            Phase {phaseIndex + 1}
          </div>
          <h1 className="ps-title">{phase.title}</h1>
          <p className="ps-subtitle">{phase.subtitle}</p>
          {alreadyDone && (
            <div className="ps-done-pill">
              <FaCheckCircle /> Completed
            </div>
          )}
        </div>
        <div className="ps-progress-block">
          <ProgressRing pct={pct} color={accentColor} size={72} />
          <div>
            <div className="ps-prog-label">
              {completedCount}/{allTasks.length} {t.tasksDone}
            </div>
            <div className="ps-prog-sub">
              {allDone
                ? t.phaseComplete
                : `${allTasks.length - completedCount} ${t.remaining}`}
            </div>
          </div>
        </div>
      </div>

      <div className="ps-body">
        <div className="ps-main">
          <section className="ps-section">
            <div
              className="ps-section-head"
              style={{ "--accent": accentColor }}
            >
              <span className="ps-section-icon">🎯</span>
              <h2>Objectives</h2>
              <span className="ps-section-count">
                {phase.objectives?.filter((_, i) => taskState[i]).length || 0}/
                {phase.objectives?.length || 0}
              </span>
            </div>
            <div className="ps-task-list">
              {(phase.objectives || []).map((obj, i) => (
                <TaskItem
                  key={i}
                  task={obj}
                  done={!!taskState[i]}
                  onToggle={() => toggleTask(i)}
                  accent={accentColor}
                />
              ))}
            </div>
          </section>

          <section className="ps-section">
            <div
              className="ps-section-head"
              style={{ "--accent": accentColor }}
            >
              <span className="ps-section-icon">⚡</span>
              <h2>Action Items</h2>
              <span className="ps-section-count">
                {phase.actions?.filter(
                  (_, i) => taskState[(phase.objectives?.length || 0) + i],
                ).length || 0}
                /{phase.actions?.length || 0}
              </span>
            </div>
            <div className="ps-task-list">
              {(phase.actions || []).map((action, i) => {
                const globalIdx = (phase.objectives?.length || 0) + i;
                return (
                  <TaskItem
                    key={i}
                    task={action}
                    done={!!taskState[globalIdx]}
                    onToggle={() => toggleTask(globalIdx)}
                    accent={accentColor}
                  />
                );
              })}
            </div>
          </section>

          <NoteEditor noteKey={NOTE_KEY} accent={accentColor} />
        </div>

        <aside className="ps-sidebar">
          {(phase.courses?.length > 0 || phase.freelancers?.length > 0) && (
            <div className="ps-card ps-ai-card">
              <div className="ps-card-title" style={{ color: accentColor }}>
                ✨ AI Recommendations
              </div>
              {phase.courses?.length > 0 && (
                <>
                  <div className="ps-rec-label">📚 Courses</div>
                  {phase.courses.map((c, i) => (
                    <div
                      key={i}
                      className="ps-rec-item"
                      onClick={() => navigate("/courses")}
                    >
                      <span>{c}</span>
                      <FaArrowRight
                        style={{ fontSize: "10px", opacity: 0.5 }}
                      />
                    </div>
                  ))}
                </>
              )}
              {phase.freelancers?.length > 0 && (
                <>
                  <div className="ps-rec-label" style={{ marginTop: "12px" }}>
                    👤 Freelancers
                  </div>
                  {phase.freelancers.map((f, i) => (
                    <div
                      key={i}
                      className="ps-rec-item"
                      onClick={() => navigate("/freelancers")}
                    >
                      <span>{f}</span>
                      <FaArrowRight
                        style={{ fontSize: "10px", opacity: 0.5 }}
                      />
                    </div>
                  ))}
                </>
              )}
            </div>
          )}

          <div className="ps-card ps-checklist-card">
            <div className="ps-card-title" style={{ color: accentColor }}>
              📋 Progress
            </div>
            <div className="ps-phase-map">
              {Array.from({ length: 8 }).map((_, i) => {
                const done = isPhaseCompleted(COMPLETED_KEY, i);
                const active = i === phaseIndex;
                return (
                  <div
                    key={i}
                    className={`ps-phase-dot ${done ? "done" : ""} ${active ? "active" : ""}`}
                    style={{ "--accent": accentColor }}
                    onClick={() => navigate(`/phase${i + 1}`)}
                    title={`Phase ${i + 1}`}
                  >
                    {done ? <FaCheck style={{ fontSize: "9px" }} /> : i + 1}
                  </div>
                );
              })}
            </div>
            <div
              style={{
                fontSize: "12px",
                color: "#94a3b8",
                marginTop: "8px",
                textAlign: "center",
              }}
            >
              {
                Array.from({ length: 8 }).filter((_, i) =>
                  isPhaseCompleted(COMPLETED_KEY, i),
                ).length
              }
              /8 {t.phasesDone}
            </div>
          </div>

          {allDone && (
            <div
              className="ps-card ps-trophy-card"
              style={{ "--accent": accentColor }}
            >
              <FaTrophy
                style={{
                  fontSize: "28px",
                  color: accentColor,
                  marginBottom: "8px",
                }}
              />
              <strong>Phase {phaseIndex + 1} Complete!</strong>
              <p>Great work. Head to the next phase to keep building.</p>
              {nextPath && (
                <button
                  className="ps-next-cta"
                  style={{ background: accentColor }}
                  onClick={() => navigate(nextPath)}
                >
                  Next Phase →
                </button>
              )}
            </div>
          )}
        </aside>
      </div>

      <nav className="ps-nav">
        <button
          className="ps-nav-btn ghost"
          onClick={() => navigate("/roadmap")}
        >
          <FaHome /> Roadmap
        </button>
        <div style={{ display: "flex", gap: "12px" }}>
          {prevPath ? (
            <button
              className="ps-nav-btn secondary"
              onClick={() => navigate(prevPath)}
            >
              <FaArrowLeft /> Previous
            </button>
          ) : (
            <button
              className="ps-nav-btn secondary"
              disabled
              style={{ opacity: 0.35 }}
            >
              <FaLock /> Previous
            </button>
          )}
          {nextPath ? (
            <button
              className="ps-nav-btn primary"
              style={{ background: accentColor }}
              onClick={() => navigate(nextPath)}
            >
              Next Phase <FaArrowRight />
            </button>
          ) : (
            <button
              className="ps-nav-btn primary"
              style={{ background: "#10b981" }}
              onClick={() => navigate("/roadmap")}
            >
              <FaTrophy /> Finish Journey
            </button>
          )}
        </div>
      </nav>
    </div>
  );
}
