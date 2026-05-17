import React from "react";
import { useNavigate } from "react-router-dom";
import homeImg from "../assets/home.png";
import "./Home.css";
import { useT } from "../context/LangContext";

function Home() {
  const navigate = useNavigate();
  const t = useT();

  return (
    <div className="home-container">
      <section className="hero-section">
        <div className="hero-content">
          <h1 className="hero-title">
            {t.heroTitle} <span className="highlight">Tadreej</span>
          </h1>
          <p className="hero-description">{t.heroDesc}</p>
          <div className="hero-image-container">
            <img src={homeImg} alt="Tadreej Platform" className="hero-image" />
          </div>
          <button className="cta-button" onClick={() => navigate("/login")}>
            {t.startJourney}
          </button>
        </div>
      </section>
    </div>
  );
}

export default Home;
