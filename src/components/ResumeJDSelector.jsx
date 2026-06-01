import React, { useState } from "react";
import { Briefcase, FileText, Key, Play, Upload, Check } from "lucide-react";

// Predefined high-quality templates for swift testing
const TEMPLATES = {
  frontend: {
    label: "Frontend Engineer",
    resume: `SKILLS: React.js, Redux Toolkit, JavaScript (ES6+), HTML5, CSS3, TailwindCSS, TypeScript, Webpack, Vitest, Performance Profiling.
EXPERIENCE: Senior Frontend Developer @ TechSolutions (3 Years)
- Built a real-time analytics dashboard rendering 10,000 active table rows using grid virtualization, reducing memory leakage by 40%.
- Optimized Critical Rendering Path and Core Web Vitals, bringing LCP down from 3.2s to 1.4s.
- Led migration of monolithic SPA to modular micro-frontends using Webpack Module Federation.`,
    jd: `ROLE: Senior Frontend Engineer
REQUIREMENTS:
- Proficient in React, JavaScript internals, DOM lifecycle, and CSS layout engines.
- Strong knowledge of web performance metrics, asset versioning, and browser caching.
- Experience with micro-frontend architectures, module federation, and scalable state management.`
  },
  backend: {
    label: "Backend Developer",
    resume: `SKILLS: Node.js, Express, Python, PostgreSQL, MongoDB, Redis, Kafka, Docker, Kubernetes, AWS, REST APIs, System Design.
EXPERIENCE: Backend Systems Engineer @ CloudStream (4 Years)
- Designed highly-concurrent transactional payment gateways with distributed lock mechanisms using Redis, securing 99.99% transaction reliability.
- Set up read replicas and sharding on PostgreSQL, decreasing slow query overhead under heavy peaks.
- Orchestrated 12 microservices deploying through Kafka messaging system, maintaining eventual consistency.`,
    jd: `ROLE: Lead Backend Engineer
REQUIREMENTS:
- Expertise in API architecture, caching strategies (Redis), and distributed system consistency patterns.
- Strong foundation in ACID transactions, concurrency models, and database query optimization.
- Experience handling system scaling during heavy spikes (e.g. flash sales, event queuing).`
  },
  fullstack: {
    label: "Full-Stack Developer",
    resume: `SKILLS: MERN Stack (MongoDB, Express, React, Node.js), JavaScript, Next.js, PostgreSQL, WebSockets, JWT, OAuth2, OWASP Security.
EXPERIENCE: Fullstack Engineer @ WebCorp (3 Years)
- Developed secure real-time collaboration editor using WebSockets and Node backend, mitigating CSRF and XSS attacks.
- Configured multi-region AWS cloud setup with GeoDNS routing, reducing physical network latency for global European/US customer bases.
- Handled end-to-end user auth flows utilizing HTTP-only cookie JWTs and Role-Based Access Controls (RBAC).`,
    jd: `ROLE: Senior Fullstack Engineer
REQUIREMENTS:
- Deep experience across modern client runtimes (React) and backend stacks (Node/Express).
- Solid knowledge of full client-server lifecycle, WebSocket scaling, and secure authentication.
- Familiarity with OWASP security practices, cross-origin communication, and physical latency reduction.`
  },
  datascience: {
    label: "Data Scientist / AI Engineer",
    resume: `SKILLS: Python, PyTorch, Scikit-learn, Pandas, NumPy, LLMs, Transformers, Pinecone Vector DB, RAG Pipelines, MLOps, SQL.
EXPERIENCE: ML & AI Engineer @ DeepAnalytics (3 Years)
- Deployed Retrieval-Augmented Generation (RAG) system handling 1,500 queries/min using HNSW indexing in Pinecone, maintaining sub-100ms similarity search latency.
- Developed pipelines to combat high-dimensional overfitting (Curse of Dimensionality) on small-sample datasets (500 features, 1,000 samples).
- Built backpropagation deep neural networks, diagnosing gradient explosion issues with residual links and batch normalization.`,
    jd: `ROLE: Machine Learning & AI Architect
REQUIREMENTS:
- Advanced expertise in Python, PyTorch, LLM integration, and MLOps deployment.
- Proficient in handling high-dimensional data pipelines, regularization (L1/L2), and evaluation metrics (Precision/Recall).
- Experience with RAG pipelines, vector indexes, hallucination moderation, and neural network mathematical mechanics.`
  }
};

const ResumeJDSelector = ({ onStartInterview }) => {
  const [role, setRole] = useState("frontend");
  const [resumeText, setResumeText] = useState(TEMPLATES.frontend.resume);
  const [jdText, setJdText] = useState(TEMPLATES.frontend.jd);
  const [apiKey, setApiKey] = useState("");
  const [isParsing, setIsParsing] = useState(false);
  const [parsedFileName, setParsedFileName] = useState("");

  const handleTemplateSelect = (selectedRole) => {
    setRole(selectedRole);
    setResumeText(TEMPLATES[selectedRole].resume);
    setJdText(TEMPLATES[selectedRole].jd);
  };

  const handleResumeUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    setIsParsing(true);
    setParsedFileName(file.name);
    
    // Simulate real-world resume parser extracting technical text
    setTimeout(() => {
      const extension = file.name.split('.').pop().toLowerCase();
      let mockParsedText = "";
      
      if (extension === 'pdf') {
        mockParsedText = `[PARSED RESUME: ${file.name}]\nNAME: John Candidate\nROLE RELEVANCE: Tech Role Specialist\nSKILLS EXTRACTED: React.js, Node.js, Express, JavaScript, SQL, Git, REST APIs, Tailwind CSS.\nEXPERIENCE: Systems Engineer (2 years). Engineered custom responsive widgets and optimized query index paths.`;
      } else {
        mockParsedText = `[PARSED RESUME: ${file.name}]\nNAME: Jane Developer\nSKILLS: Python, Pandas, Scikit-learn, SQL, Docker, AWS, Git.\nEXPERIENCE: Data Analyst (3 years). Built automation pipelines and compiled comparative evaluation metrics.`;
      }
      
      setResumeText(mockParsedText);
      setIsParsing(false);
    }, 1200);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!resumeText.trim() || !jdText.trim()) return;
    
    onStartInterview({
      role,
      resumeText,
      jdText,
      apiKey: apiKey.trim()
    });
  };

  return (
    <div className="glass-panel" style={{ width: "100%" }}>
      <h2 style={{ fontSize: "1.8rem", marginBottom: "0.5rem" }}>Interview Initialization</h2>
      <p style={{ color: "var(--text-secondary)", marginBottom: "2rem" }}>
        Configure your mock interview by choosing a preset role or loading your customized resume and job description.
      </p>

      <form onSubmit={handleSubmit}>
        {/* Quick presets tab bar */}
        <div className="quick-templates">
          <div className="quick-templates-title">Choose Technical Role Preset</div>
          <div className="template-buttons">
            {Object.entries(TEMPLATES).map(([key, value]) => (
              <button
                key={key}
                type="button"
                className={`btn-template ${role === key ? "active" : ""}`}
                onClick={() => handleTemplateSelect(key)}
              >
                {value.label}
              </button>
            ))}
          </div>
        </div>

        {/* Inputs */}
        <div className="grid-two-cols">
          {/* Resume Upload and Paste */}
          <div className="form-group">
            <label className="form-label">
              <FileText size={18} />
              Candidate Resume
            </label>
            <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              <label className="upload-dropzone">
                <Upload size={24} />
                <span className="upload-title">
                  {isParsing ? "Extracting skills..." : parsedFileName ? `Uploaded: ${parsedFileName}` : "Upload Resume (PDF/TXT)"}
                </span>
                <span className="upload-desc">Simulated parser extracts core technical tokens</span>
                <input 
                  type="file" 
                  accept=".pdf,.txt" 
                  onChange={handleResumeUpload} 
                  style={{ display: "none" }}
                  disabled={isParsing}
                />
              </label>
              
              <textarea
                className="textarea-input"
                placeholder="Or paste resume plain text here..."
                value={resumeText}
                onChange={(e) => setResumeText(e.target.value)}
                required
              />
            </div>
          </div>

          {/* Job Description Paste */}
          <div className="form-group">
            <label className="form-label">
              <Briefcase size={18} />
              Job Description (JD)
            </label>
            <textarea
              className="textarea-input"
              placeholder="Paste the target job description requirements here..."
              value={jdText}
              onChange={(e) => setJdText(e.target.value)}
              style={{ minHeight: "295px" }}
              required
            />
          </div>
        </div>

        {/* Optional Gemini API settings panel */}
        <div className="form-group" style={{ marginTop: "2rem", borderTop: "1px solid var(--border-color)", paddingTop: "1.5rem" }}>
          <label className="form-label">
            <Key size={18} />
            Gemini API Key (Optional)
          </label>
          <div style={{ display: "flex", gap: "1rem", alignItems: "center" }}>
            <input
              type="password"
              className="text-input"
              placeholder="AIzaSy..."
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              style={{ flex: 1 }}
            />
            <span style={{ fontSize: "0.75rem", color: "var(--text-muted)", maxWidth: "250px", textAlign: "left", lineHeight: "1.3" }}>
              {apiKey ? "🟢 API active. Real AI Interviewer will dynamically generate & grade your questions!" : "ℹ️ Empty. Platform will launch the High-Fidelity offline hybrid rules engine."}
            </span>
          </div>
        </div>

        {/* Start button */}
        <div style={{ marginTop: "2.5rem", display: "flex", justifyContent: "flex-end" }}>
          <button
            type="submit"
            className="btn btn-primary"
            disabled={isParsing || !resumeText.trim() || !jdText.trim()}
          >
            <Play size={18} />
            Initialize Interview Simulator
          </button>
        </div>
      </form>
    </div>
  );
};

export default ResumeJDSelector;
