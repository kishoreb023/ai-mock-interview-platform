import React, { useState } from "react";
import { CheckCircle2, AlertTriangle, RefreshCw, ClipboardCopy, Award, BookOpen, ChevronDown, ChevronUp } from "lucide-react";

const AnalyticsReport = ({ results, onRestart }) => {
  const { history, role, averageScore, terminatedEarly } = results;
  const [expandedIndex, setExpandedIndex] = useState(null);
  const [copied, setCopied] = useState(false);

  // Compute overall skill scores by averaging across questions
  const totalQuestions = history.length;
  const computeAverageMetric = (key) => {
    if (totalQuestions === 0) return 0;
    const sum = history.reduce((acc, curr) => acc + (curr.evaluation?.[key] || 0), 0);
    return Math.round(sum / totalQuestions);
  };

  const accuracy = computeAverageMetric("accuracy");
  const clarity = computeAverageMetric("clarity");
  const depth = computeAverageMetric("depth");
  const relevance = computeAverageMetric("relevance");
  const timeEfficiency = computeAverageMetric("timeEfficiency");

  // Overall Score rounded
  const finalScore = Math.round(averageScore);

  // Hiring indicators
  const getHiringDecision = () => {
    if (terminatedEarly && finalScore < 35) {
      return {
        label: "Do Not Hire (Early Termination)",
        class: "poor",
        desc: "Candidate struggled to answer fundamental concepts within the time constraints, leading to system early termination. Core engineering focus is needed."
      };
    }
    if (finalScore >= 85) {
      return {
        label: "Hire With Distinction",
        class: "distinction",
        desc: "Outstanding performance! The candidate demonstrated highly advanced conceptual knowledge, rigorous accuracy, and impeccable communication depth."
      };
    }
    if (finalScore >= 70) {
      return {
        label: "Recommended Hire",
        class: "hire",
        desc: "Strong candidate. Showcased reliable skills, good relevance, and capable problem-solving depth. Well suited for the role requirements."
      };
    }
    if (finalScore >= 50) {
      return {
        label: "Consider for Retraining",
        class: "average",
        desc: "Borderline performance. Candidate understands key definitions but struggles with critical architectural execution and thorough time efficiency."
      };
    }
    return {
      label: "Do Not Hire",
      class: "poor",
      desc: "Performance fell below requirements. Showed significant gaps in accuracy, lack of conceptual depth, or excessive timeouts."
    };
  };

  const decision = getHiringDecision();

  // Aggregate strengths and weaknesses from all evaluations
  const aggregateStrengths = [
    ...new Set(history.flatMap(h => h.evaluation?.strengths || []).filter(s => s && s !== "None"))
  ].slice(0, 4);

  const aggregateWeaknesses = [
    ...new Set(history.flatMap(h => h.evaluation?.weaknesses || []).filter(w => w && w !== "None"))
  ].slice(0, 4);

  // Generate actionable tips
  const getActionableTips = () => {
    const tips = [];
    if (accuracy < 70) {
      tips.push({
        title: "Review Fundamentals & Syntax",
        desc: "Revisit official documentation, core specs, and fundamental syntax to minimize simple conceptual errors."
      });
    }
    if (depth < 70) {
      tips.push({
        title: "Build Deeper Architectural Understanding",
        desc: "Don't just memorize definitions. Study internal compilation cycles, performance profiles, memory leaks, and distributed systems."
      });
    }
    if (timeEfficiency < 75) {
      tips.push({
        title: "Practice Time-Constrained coding",
        desc: "Practice thinking aloud while explaining solutions. Use mock interfaces or timers to speed up technical explanation delivery."
      });
    }
    if (tips.length === 0) {
      tips.push({
        title: "Advanced System Design Challenges",
        desc: "You have excellent basics. Focus on high-scale distributed caching, microservice synchronization, and multi-region routing patterns."
      });
    }
    return tips;
  };

  const tips = getActionableTips();

  // Export full transcript as markdown
  const copyMarkdownTranscript = () => {
    let md = `# Interview Readiness Report - ${role.toUpperCase()} Role\n`;
    md += `**Overall Score:** ${finalScore}/100\n`;
    md += `**Hiring Recommendation:** ${decision.label}\n`;
    md += `**Session Summary:** ${terminatedEarly ? "Terminated Early" : "Completed Successfully"}\n\n`;
    
    md += `## Skills Matrix\n`;
    md += `- Accuracy: ${accuracy}%\n`;
    md += `- Clarity: ${clarity}%\n`;
    md += `- Depth: ${depth}%\n`;
    md += `- Relevance: ${relevance}%\n`;
    md += `- Time Efficiency: ${timeEfficiency}%\n\n`;

    md += `## Strengths Identified\n`;
    aggregateStrengths.forEach(s => { md += `- ${s}\n`; });
    
    md += `\n## Weaknesses to Address\n`;
    aggregateWeaknesses.forEach(w => { md += `- ${w}\n`; });

    md += `\n## Interview Question & Answer Transcript\n\n`;
    history.forEach((h, index) => {
      md += `### Question ${index + 1} [Difficulty: ${h.question.difficulty.toUpperCase()} | Score: ${h.score}/100]\n`;
      md += `* **Q:** ${h.question.question}\n`;
      md += `* **A:** ${h.answer}\n`;
      md += `* **Feedback:** ${h.evaluation?.feedback || "No feedback."}\n\n`;
    });

    navigator.clipboard.writeText(md);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // SVGs for Radial gauge progress calculations
  const rGauge = 70;
  const cGauge = 2 * Math.PI * rGauge;
  const offsetGauge = cGauge - (finalScore / 100) * cGauge;

  return (
    <div className="glass-panel analytics-dashboard">
      {/* Hero Header */}
      <div className="analytics-hero">
        {/* Radial readiness score gauge */}
        <div className="readiness-gauge-card">
          <div className="readiness-score-container">
            <svg className="gauge-svg">
              <defs>
                <linearGradient id="cyan-blue-grad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#00F2FE" />
                  <stop offset="100%" stopColor="#4FACFE" />
                </linearGradient>
              </defs>
              <circle className="gauge-bg" cx="90" cy="90" r={rGauge} />
              <circle 
                className="gauge-progress" 
                cx="90" 
                cy="90" 
                r={rGauge} 
                strokeDasharray={cGauge}
                strokeDashoffset={offsetGauge}
              />
            </svg>
            <div className="gauge-text-overlay">
              <span className="gauge-score">{finalScore}</span>
              <span className="gauge-label">Readiness</span>
            </div>
          </div>
        </div>

        {/* Readiness Description and Decision */}
        <div className="readiness-summary-card">
          <div style={{ display: "flex", gap: "1rem", alignItems: "center", flexWrap: "wrap" }}>
            <span className={`hiring-badge ${decision.class}`}>
              <Award size={16} />
              {decision.label}
            </span>
            {terminatedEarly && (
              <span className="badge-hackathon" style={{ background: "rgba(244,63,94,0.1)", color: "var(--neon-rose)", borderColor: "rgba(244,63,94,0.2)" }}>
                EARLY TERMINATION TRIGGERED
              </span>
            )}
          </div>
          
          <h2 style={{ fontSize: "2rem", marginTop: "0.5rem" }}>Hiring Readiness Index</h2>
          <p style={{ color: "var(--text-secondary)", fontSize: "1.05rem" }}>
            {decision.desc}
          </p>
        </div>
      </div>

      {/* Skills Matrix Section */}
      <div className="skills-breakdown-section" style={{ borderTop: "1px solid var(--border-color)", paddingTop: "2rem" }}>
        <h3 className="skills-title">Objective Scoring Metrics</h3>
        <div className="skills-grid">
          {/* Accuracy */}
          <div className="skill-bar-container">
            <div className="skill-bar-label">
              <span>Technical Accuracy (Decoupled Correctness)</span>
              <span>{accuracy}%</span>
            </div>
            <div className="skill-bar-track">
              <div className="skill-bar-fill accuracy" style={{ width: `${accuracy}%` }}></div>
            </div>
          </div>
          {/* Depth */}
          <div className="skill-bar-container">
            <div className="skill-bar-label">
              <span>Conceptual Depth (Detail Coverage)</span>
              <span>{depth}%</span>
            </div>
            <div className="skill-bar-track">
              <div className="skill-bar-fill depth" style={{ width: `${depth}%` }}></div>
            </div>
          </div>
          {/* Relevance */}
          <div className="skill-bar-container">
            <div className="skill-bar-label">
              <span>JD Contextual Relevance (Role Alignment)</span>
              <span>{relevance}%</span>
            </div>
            <div className="skill-bar-track">
              <div className="skill-bar-fill relevance" style={{ width: `${relevance}%` }}></div>
            </div>
          </div>
          {/* Clarity */}
          <div className="skill-bar-container">
            <div className="skill-bar-label">
              <span>Communication Clarity (Logical Structure)</span>
              <span>{clarity}%</span>
            </div>
            <div className="skill-bar-track">
              <div className="skill-bar-fill clarity" style={{ width: `${clarity}%` }}></div>
            </div>
          </div>
          {/* Time Efficiency */}
          <div className="skill-bar-container">
            <div className="skill-bar-label">
              <span>Time Efficiency (Strict Constraints)</span>
              <span>{timeEfficiency}%</span>
            </div>
            <div className="skill-bar-track">
              <div className="skill-bar-fill timeEfficiency" style={{ width: `${timeEfficiency}%` }}></div>
            </div>
          </div>
        </div>
      </div>

      {/* Strengths and Weaknesses Dashboard */}
      <div className="strengths-weaknesses-grid">
        <div className="feedback-card strengths">
          <h4 className="feedback-card-title">
            <CheckCircle2 size={18} />
            Hiring Strengths
          </h4>
          {aggregateStrengths.length > 0 ? (
            <ul className="feedback-list">
              {aggregateStrengths.map((str, idx) => (
                <li key={idx} className="feedback-item">{str}</li>
              ))}
            </ul>
          ) : (
            <p style={{ fontSize: "0.9rem", color: "var(--text-muted)", fontStyle: "italic" }}>
              Provide deeper explanations in technical areas to catalog distinct strengths.
            </p>
          )}
        </div>

        <div className="feedback-card weaknesses">
          <h4 className="feedback-card-title">
            <AlertTriangle size={18} />
            Areas for Improvement
          </h4>
          {aggregateWeaknesses.length > 0 ? (
            <ul className="feedback-list">
              {aggregateWeaknesses.map((weak, idx) => (
                <li key={idx} className="feedback-item">{weak}</li>
              ))}
            </ul>
          ) : (
            <p style={{ fontSize: "0.9rem", color: "var(--neon-emerald)", fontStyle: "italic", fontWeight: "600" }}>
              Excellent basics! No critical technical gaps recorded.
            </p>
          )}
        </div>
      </div>

      {/* Actionable recommendations card */}
      <div className="glass-panel" style={{ background: "rgba(255,255,255,0.01)", borderStyle: "dashed", padding: "1.5rem" }}>
        <h4 style={{ display: "flex", alignItems: "center", gap: "0.5rem", color: "var(--neon-cyan)", fontSize: "1.1rem", marginBottom: "0.75rem" }}>
          <BookOpen size={18} />
          Targeted Preparation Recommendations
        </h4>
        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          {tips.map((tip, idx) => (
            <div key={idx} style={{ fontSize: "0.9rem" }}>
              <strong style={{ color: "var(--text-primary)" }}>{tip.title}:</strong>
              <span style={{ color: "var(--text-secondary)", marginLeft: "0.5rem" }}>{tip.desc}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Timeline Transcripts Accordion */}
      <div className="transcript-section" style={{ borderTop: "1px solid var(--border-color)", paddingTop: "2rem" }}>
        <h3 className="skills-title">Session Question & Answer Transcripts</h3>
        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          {history.map((h, index) => (
            <div key={index} className="transcript-card">
              <div 
                className="transcript-q-row" 
                style={{ cursor: "pointer" }}
                onClick={() => setExpandedIndex(expandedIndex === index ? null : index)}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
                  <span className="transcript-q-title">Q{index + 1}: {h.question.topics[0]} ({h.question.difficulty.toUpperCase()})</span>
                  <span style={{ fontSize: "0.75rem", background: "rgba(255,255,255,0.04)", padding: "0.2rem 0.5rem", borderRadius: "4px" }}>
                    Score: <strong style={{ color: h.score >= 75 ? "var(--neon-emerald)" : h.score < 40 ? "var(--neon-rose)" : "var(--neon-amber)" }}>{h.score}/100</strong>
                  </span>
                </div>
                {expandedIndex === index ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
              </div>

              {expandedIndex === index && (
                <div style={{ marginTop: "1.25rem", animation: "fade-in 0.3s ease-out" }}>
                  <p style={{ fontSize: "0.95rem", color: "var(--text-secondary)", marginBottom: "0.5rem", fontWeight: "600" }}>Question Prompt:</p>
                  <p style={{ fontSize: "1rem", color: "var(--text-primary)", marginBottom: "1.25rem", background: "rgba(255,255,255,0.02)", padding: "0.75rem", borderRadius: "8px" }}>
                    {h.question.question}
                  </p>

                  <p style={{ fontSize: "0.95rem", color: "var(--text-secondary)", marginBottom: "0.5rem", fontWeight: "600" }}>Candidate Response:</p>
                  <div className="transcript-ans">
                    {h.answer}
                  </div>

                  <div className="transcript-metrics">
                    <span>Acc: <strong className="metric-value">{h.evaluation?.accuracy || 0}%</strong></span>
                    <span>Clarity: <strong className="metric-value">{h.evaluation?.clarity || 0}%</strong></span>
                    <span>Depth: <strong className="metric-value">{h.evaluation?.depth || 0}%</strong></span>
                    <span>Rel: <strong className="metric-value">{h.evaluation?.relevance || 0}%</strong></span>
                    <span>Time Eff: <strong className="metric-value">{h.evaluation?.timeEfficiency || 0}%</strong></span>
                    <span>Time Taken: <strong className="metric-value">{h.timeTaken}s</strong> (Limit: {h.question.timeLimit}s)</span>
                  </div>

                  {h.evaluation?.feedback && (
                    <div style={{ marginTop: "1rem", borderTop: "1px solid rgba(255,255,255,0.04)", paddingTop: "0.75rem", fontSize: "0.9rem" }}>
                      <p style={{ color: "var(--neon-cyan)", fontWeight: "600", marginBottom: "0.25rem" }}>Interviewer Feedback:</p>
                      <p style={{ color: "var(--text-secondary)" }}>{h.evaluation.feedback}</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Action Footer */}
      <div className="dashboard-actions">
        <button
          type="button"
          className="btn btn-secondary"
          onClick={copyMarkdownTranscript}
        >
          <ClipboardCopy size={16} />
          {copied ? "Copied!" : "Copy Report MD"}
        </button>

        <button
          type="button"
          className="btn btn-indigo"
          onClick={onRestart}
        >
          <RefreshCw size={16} />
          Restart Interview
        </button>
      </div>
    </div>
  );
};

export default AnalyticsReport;
