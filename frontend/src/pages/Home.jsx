import { Link } from "react-router-dom";
import { useState } from "react";
import './Home.css';

export default function Home() {
  const [activeFeature, setActiveFeature] = useState(null);

  const features = [
    {
      id: 1,
      title: "Real-Time Collaborative Coding",
      icon: "👨‍💻👩‍💻",
      hoverDescription: "Code together simultaneously with live cursor tracking, syntax highlighting."
    },
    {
      id: 2,
      title: "Integrated Chat Section",
      icon: "💬",
      hoverDescription: "Chat while you code. Discuss ideas, share snippets, and solve problems together without switching tabs."
    },
    {
      id: 3,
      title: "Live Output Display",
      icon: "🖥️",
      hoverDescription: "See results instantly. Run code and watch the output update live as you and your team make changes."
    },
    {
      id: 4,
      title: "Personal AI Assistant",
      icon: "🤖",
      hoverDescription: "Smart coding companion. Get instant help, fix errors, and learn better ways to write code together."
    },
    {
      id: 5,
      title: "Voice Messaging",
      icon: "🎙️",
      hoverDescription: "Communicate naturally with voice messages. Record and share audio notes for clearer explanations and faster collaboration."
    },
    {
      id: 6,
      title: "File Manager",
      icon: "📁",
      hoverDescription: "Organize your projects effortlessly. Upload, manage, and share files with your team in a structured workspace."
    },
    {
  id: 7,
  title: "Video Call",
  icon: "🎥",
  hoverDescription: "Connect face-to-face with your team instantly. Start or join secure video calls with real-time audio and video communication."
}

  ];

  return (
    <div className="home-container">
      {/* Hero Section */}
      <div className="hero-section">
        <h1 className="hero-title">
          <span className="title-gradient">🚀 Real-Time Collaborative</span>
          <span className="title-gradient">Code Editor</span>
        </h1>
        <p className="hero-subtitle">
          Code together, learn together. Collaborate in real-time, share ideas, and
          boost productivity — all in one seamless platform built for developers.
        </p>
        
        {/* Auth Buttons */}
        <div className="auth-buttons">
          <Link to="/login" className="btn btn-login">
            <span className="btn-icon">🔐</span>
            Login
          </Link>
          <Link to="/signup" className="btn btn-signup">
            <span className="btn-icon">✨</span>
            Sign Up Free
          </Link>
        </div>
      </div>

      {/* Features Grid */}
      <div className="features-section">
        <h2 className="features-title">Powerful Features</h2>
        <div className="features-grid">
          {features.map((feature) => (
            <div
              key={feature.id}
              className={`feature-card ${activeFeature === feature.id ? 'active' : ''}`}
              onMouseEnter={() => setActiveFeature(feature.id)}
              onMouseLeave={() => setActiveFeature(null)}
            >
              <div className="feature-icon">{feature.icon}</div>
              <h3 className="feature-title">{feature.title}</h3>
              <div className="feature-content">
                <p className="feature-description">
                  {activeFeature === feature.id ? feature.hoverDescription : ""}
                </p>
              </div>
              <div className="feature-hover-indicator">
                {activeFeature === feature.id ? "↑" : "↓"} Hover for details
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Demo Preview */}
      <div className="demo-section">
        <div className="demo-container">
          <div className="editor-window">
            <div className="window-header">
              <div className="window-controls">
                <span className="control red"></span>
                <span className="control yellow"></span>
                <span className="control green"></span>
              </div>
              <div className="window-title">collaborative-editor.jsx</div>
            </div>
            <div className="editor-content">
              <div className="code-line">
                <span className="line-number">1</span>
                <span className="code-keyword">function</span>
                <span className="code-function"> collaborativeCoding</span>
                <span className="code-punctuation">()</span> <span className="code-punctuation">{'{'}</span>
              </div>
              <div className="code-line">
                <span className="line-number">2</span>
                <span className="code-comment">  // Real-time collaboration enabled</span>
              </div>
              <div className="code-line">
                <span className="line-number">3</span>
                <span className="code-keyword">  return</span>
                <span className="code-string"> "Build amazing things together!"</span>
              </div>
              <div className="code-line">
                <span className="line-number">4</span>
                <span className="code-punctuation">{'}'}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}