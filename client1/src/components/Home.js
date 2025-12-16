import React from "react";
import { useNavigate } from "react-router-dom";
import homeImg from "../assets/home.png";
import "./Home.css";

function Home() {
  const navigate = useNavigate();

  return (
    <div className="home-container">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-content">
          <h1 className="hero-title">
            Welcome to <span className="highlight">Tadreej</span>
          </h1>
          
          <p className="hero-description">
            Tadreej helps you turn your ideas into real startup projects through guided steps and smart tools.
          </p>

          <div className="hero-image-container">
            <img
              src={homeImg}
              alt="Tadreej Platform"
              className="hero-image"
            />
          </div>

          <button
            className="cta-button"
            onClick={() => navigate("/login")}
          >
            Start Your Journey
          </button>
        </div>
      </section>
    </div>
  );
}

export default Home;
