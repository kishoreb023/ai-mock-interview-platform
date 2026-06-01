import React from "react";
import { Mic, CheckCircle2, AlertCircle } from "lucide-react";

const InterviewerAvatar = ({ status }) => {
  // status: "idle" | "speaking" | "listening" | "grading"
  
  const getStatusText = () => {
    switch (status) {
      case "speaking":
        return "Speaking...";
      case "listening":
        return "Listening...";
      case "grading":
        return "Grading Response...";
      case "idle":
      default:
        return "Online";
    }
  };

  return (
    <div className="glass-panel avatar-card">
      <div className={`avatar-circle ${status === "speaking" ? "speaking" : status === "grading" ? "grading" : ""}`}>
        <img 
          src="/avatar.png" 
          alt="AI Interviewer" 
          className="avatar-img"
          onError={(e) => {
            // Fallback default avatar image path or initials
            e.target.src = "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=300&q=80";
          }}
        />
      </div>

      <div className={`avatar-status-pill ${status === "speaking" ? "speaking" : status === "grading" ? "grading" : ""}`}>
        <span className={`status-dot ${status === "speaking" ? "active" : status === "grading" ? "grading" : ""}`}></span>
        {getStatusText()}
      </div>

      {/* Voice wave bar visualizer active when speaking */}
      <div className={`voice-wave ${status === "speaking" ? "active" : ""}`}>
        <div className="wave-bar"></div>
        <div className="wave-bar"></div>
        <div className="wave-bar"></div>
        <div className="wave-bar"></div>
        <div className="wave-bar"></div>
        <div className="wave-bar"></div>
        <div className="wave-bar"></div>
      </div>
      
      {status === "listening" && (
        <div style={{ marginTop: "1rem", color: "var(--neon-rose)", display: "flex", alignItems: "center", gap: "0.5rem", fontSize: "0.85rem", fontWeight: "600" }}>
          <Mic size={16} className="pulse-dot-red" />
          <span>SPEAK NOW</span>
        </div>
      )}
    </div>
  );
};

export default InterviewerAvatar;
