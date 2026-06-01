import React, { useState } from "react";
import { Terminal, Award } from "lucide-react";
import ResumeJDSelector from "./components/ResumeJDSelector";
import InterviewPanel from "./components/InterviewPanel";
import AnalyticsReport from "./components/AnalyticsReport";
import "./styles/components.css";

function App() {
  const [view, setView] = useState("selector"); // "selector" | "interview" | "report"
  const [interviewConfig, setInterviewConfig] = useState(null);
  const [interviewResults, setInterviewResults] = useState(null);

  const handleStartInterview = (config) => {
    setInterviewConfig(config);
    setView("interview");
  };

  const handleInterviewComplete = (results) => {
    setInterviewResults(results);
    setView("report");
  };

  const handleRestart = () => {
    setInterviewConfig(null);
    setInterviewResults(null);
    setView("selector");
  };

  return (
    <div className="app-container">
      {/* Visual Navigation Header */}
      <header className="header">
        <div className="logo-section">
          <div className="logo-icon">H</div>
          <div>
            <h1 className="app-title" style={{ fontSize: "1.35rem", margin: 0, fontWeight: 800 }}>
              Hack2Hire
            </h1>
            <span style={{ fontSize: "0.75rem", color: "var(--text-muted)", display: "block", marginTop: "-2px" }}>
              AI Interview Platform
            </span>
          </div>
        </div>

        <div style={{ display: "flex", gap: "1rem", alignItems: "center" }}>
          <span className="badge-hackathon">
            <Terminal size={12} style={{ marginRight: "4px", verticalAlign: "middle" }} />
            Hackathon Live
          </span>
        </div>
      </header>

      {/* Main Multi-state Router content wrapper */}
      <main style={{ flex: 1, display: "flex", width: "100%", justifyContent: "center" }}>
        {view === "selector" && (
          <ResumeJDSelector onStartInterview={handleStartInterview} />
        )}
        
        {view === "interview" && (
          <InterviewPanel 
            config={interviewConfig} 
            onInterviewComplete={handleInterviewComplete} 
          />
        )}
        
        {view === "report" && (
          <AnalyticsReport 
            results={interviewResults} 
            onRestart={handleRestart} 
          />
        )}
      </main>

      {/* Branding Footer */}
      <footer style={{ marginTop: "3rem", padding: "1.5rem 0", borderTop: "1px solid var(--border-color)", textAlign: "center", fontSize: "0.8rem", color: "var(--text-muted)" }}>
        <p>© 2026 Hack2Hire AI Interview Simulator. Engineered for elite technical mock evaluations.</p>
      </footer>
    </div>
  );
}

export default App;
