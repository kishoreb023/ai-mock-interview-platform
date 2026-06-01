import React, { useState, useEffect, useRef } from "react";
import { Mic, MicOff, Volume2, ArrowRight, AlertTriangle, XCircle, SkipForward } from "lucide-react";
import InterviewerAvatar from "./InterviewerAvatar";
import { QUESTION_BANK } from "../data/questionBank";
import { gradeCandidateAnswer } from "../utils/gradingEngine";
import { generateQuestionWithGemini } from "../utils/geminiService";

const InterviewPanel = ({ config, onInterviewComplete }) => {
  const { role, resumeText, jdText, apiKey } = config;

  // Session settings
  const TOTAL_QUESTIONS = 5;
  const EARLY_TERMINATION_THRESHOLD = 35; // % running average
  const WARNING_THRESHOLD = 45; // % running average

  // Interview state
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [currentDifficulty, setCurrentDifficulty] = useState("easy");
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [answerText, setAnswerText] = useState("");
  const [timeTaken, setTimeTaken] = useState(0);
  const [timeLimit, setTimeLimit] = useState(60);
  const [timeLeft, setTimeLeft] = useState(60);
  const [avatarStatus, setAvatarStatus] = useState("idle"); // "idle" | "speaking" | "listening" | "grading"
  const [isDictating, setIsDictating] = useState(false);
  const [feedbackHistory, setFeedbackHistory] = useState([]); // Array of { question, answer, score, evaluation }
  const [isLoadingQuestion, setIsLoadingQuestion] = useState(true);

  // References
  const timerRef = useRef(null);
  const recognitionRef = useRef(null);
  const timeTakenRef = useRef(0);
  const spokenRef = useRef(false);

  // Initial Question load
  useEffect(() => {
    loadNextQuestion(true);
    return () => {
      stopTimer();
      stopDictation();
      if (window.speechSynthesis) window.speechSynthesis.cancel();
    };
  }, []);

  // Timer loop
  useEffect(() => {
    if (isLoadingQuestion || avatarStatus === "grading" || avatarStatus === "speaking") {
      stopTimer();
      return;
    }

    // Start timer
    stopTimer();
    setTimeLeft(timeLeft);
    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        timeTakenRef.current = timeTakenRef.current + 1;
        setTimeTaken(timeTakenRef.current);
        if (prev <= 1) {
          // Timeout! Trigger auto-submit
          stopTimer();
          handleTimeout();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => stopTimer();
  }, [currentQuestion, avatarStatus, isLoadingQuestion]);

  // Voice synthesis: speak question when it changes
  useEffect(() => {
    if (currentQuestion && !spokenRef.current) {
      speakQuestion(currentQuestion.question);
      spokenRef.current = true;
    }
  }, [currentQuestion]);

  const stopTimer = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  };

  // Text to Speech
  const speakQuestion = (text) => {
    if (!window.speechSynthesis) return;
    window.speechSynthesis.cancel(); // Stop any active speech
    
    setAvatarStatus("speaking");
    const utterance = new SpeechSynthesisUtterance(text);
    
    // Choose a professional-sounding premium English voice if available
    const voices = window.speechSynthesis.getVoices();
    const optimalVoice = voices.find(v => v.lang.startsWith("en-") && v.name.includes("Google")) || 
                         voices.find(v => v.lang.startsWith("en-")) || 
                         voices[0];
    if (optimalVoice) utterance.voice = optimalVoice;
    
    utterance.onend = () => {
      setAvatarStatus("listening");
    };
    utterance.onerror = () => {
      setAvatarStatus("listening");
    };
    
    window.speechSynthesis.speak(utterance);
  };

  // Web Speech API - Voice Dictation Recognition
  const startDictation = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("Voice speech recognition is not supported in this browser. Please use Chrome, Edge, or Safari.");
      return;
    }

    stopDictation();

    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = false;
    recognition.lang = "en-US";

    recognition.onstart = () => {
      setIsDictating(true);
    };

    recognition.onresult = (event) => {
      const transcript = event.results[event.results.length - 1][0].transcript;
      setAnswerText((prev) => (prev ? prev + " " + transcript : transcript));
    };

    recognition.onerror = (e) => {
      console.error("Speech recognition error:", e);
      setIsDictating(false);
    };

    recognition.onend = () => {
      setIsDictating(false);
    };

    recognitionRef.current = recognition;
    recognition.start();
  };

  const stopDictation = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      recognitionRef.current = null;
    }
    setIsDictating(false);
  };

  const toggleDictation = () => {
    if (isDictating) {
      stopDictation();
    } else {
      startDictation();
    }
  };

  // Dynamic question loader
  const loadNextQuestion = async (isFirst = false, forceDifficulty = null) => {
    setIsLoadingQuestion(true);
    setAvatarStatus("idle");
    setAnswerText("");
    setTimeTaken(0);
    timeTakenRef.current = 0;
    spokenRef.current = false;
    
    let difficultyToLoad = forceDifficulty || currentDifficulty;
    
    // Previous topics to prevent redundancy
    const prevTopics = feedbackHistory.flatMap(h => h.question.topics);
    
    try {
      if (apiKey && apiKey.trim() !== "") {
        // Call Gemini for dynamic interview questions aligned to Resume/JD
        setAvatarStatus("grading"); // Visual cue: AI is thinking/generating
        const newQ = await generateQuestionWithGemini(apiKey, role, difficultyToLoad, prevTopics, resumeText, jdText);
        setCurrentQuestion(newQ);
        setTimeLimit(newQ.timeLimit);
        setTimeLeft(newQ.timeLimit);
      } else {
        // Load offline local question bank matched to difficulty & category
        const pool = QUESTION_BANK[role] || QUESTION_BANK["fullstack"];
        const diffQuestions = pool.filter(q => q.difficulty === difficultyToLoad);
        
        // Exclude questions already asked
        const askedIds = feedbackHistory.map(h => h.question.id);
        let available = diffQuestions.filter(q => !askedIds.includes(q.id));
        
        // If exhausted, clear Asked constraint for this difficulty
        if (available.length === 0) {
          available = diffQuestions;
        }

        // Random pick
        const randQ = available[Math.floor(Math.random() * available.length)];
        setCurrentQuestion(randQ);
        setTimeLimit(randQ.timeLimit);
        setTimeLeft(randQ.timeLimit);
        // Add fake thinking delay to feel professional
        await new Promise(resolve => setTimeout(resolve, 800));
      }
    } catch (e) {
      console.error("Failed to load question, using standard fallback", e);
      // Absolute fallback
      const fallbackQ = {
        id: "fallback_" + Date.now(),
        difficulty: difficultyToLoad,
        category: "conceptual",
        topics: ["General Software"],
        question: `As a ${role} specialist, what technical architecture practices do you follow to ensure your solutions are scalable, easily testable, and robust against crashes?`,
        sampleAnswer: "Standard robust designs involve decoupling layers, modular coding, unit tests, error bounds, CI/CD, caching layers, and database optimization.",
        keySkills: ["System Design", "Scalability", "Reliability"],
        timeLimit: difficultyToLoad === 'easy' ? 60 : difficultyToLoad === 'medium' ? 90 : 120
      };
      setCurrentQuestion(fallbackQ);
      setTimeLimit(fallbackQ.timeLimit);
      setTimeLeft(fallbackQ.timeLimit);
    } finally {
      setIsLoadingQuestion(false);
    }
  };

  // Auto-submit on Time Limit Exceeded
  const handleTimeout = () => {
    stopDictation();
    if (window.speechSynthesis) window.speechSynthesis.cancel();
    alert("⌛ Time Limit Exceeded! Your current draft answer is being submitted automatically.");
    submitAnswer(true);
  };

  // Submit and evaluate answer
  const submitAnswer = async (isTimeout = false) => {
    stopTimer();
    stopDictation();
    if (window.speechSynthesis) window.speechSynthesis.cancel();
    setAvatarStatus("grading");

    const answerToGrade = answerText;
    const actualTimeTaken = timeTakenRef.current;

    try {
      // Call grading engine
      const evaluation = await gradeCandidateAnswer(apiKey, currentQuestion, answerToGrade, actualTimeTaken);
      
      const newFeedback = {
        question: currentQuestion,
        answer: answerToGrade || "[No answer provided / Skipped]",
        score: evaluation.score,
        timeTaken: actualTimeTaken,
        evaluation: evaluation
      };

      const updatedHistory = [...feedbackHistory, newFeedback];
      setFeedbackHistory(updatedHistory);

      // Check for early termination or completion
      const nextIndex = currentQuestionIndex + 1;
      const averageScore = updatedHistory.reduce((acc, curr) => acc + curr.score, 0) / updatedHistory.length;

      // Early Termination Rule: If 3 or more questions answered and score falls below critical threshold
      if (nextIndex >= 3 && averageScore < EARLY_TERMINATION_THRESHOLD) {
        setAvatarStatus("idle");
        alert("⚠️ Interview Terminated Early: Average scoring has fallen below the critical hiring benchmark. Proceeding to the final performance metrics.");
        onInterviewComplete({
          history: updatedHistory,
          role,
          averageScore,
          terminatedEarly: true
        });
        return;
      }

      if (nextIndex >= TOTAL_QUESTIONS) {
        // Complete interview
        setAvatarStatus("idle");
        onInterviewComplete({
          history: updatedHistory,
          role,
          averageScore,
          terminatedEarly: false
        });
      } else {
        // Adaptive routing difficulty logic
        let nextDifficulty = currentDifficulty;
        if (evaluation.difficultySuggestion === "increase") {
          if (currentDifficulty === "easy") nextDifficulty = "medium";
          else if (currentDifficulty === "medium") nextDifficulty = "hard";
        } else if (evaluation.difficultySuggestion === "decrease") {
          if (currentDifficulty === "hard") nextDifficulty = "medium";
          else if (currentDifficulty === "medium") nextDifficulty = "easy";
        }
        
        setCurrentDifficulty(nextDifficulty);
        setCurrentQuestionIndex(nextIndex);
        
        // Load next question with new routing difficulty
        await loadNextQuestion(false, nextDifficulty);
      }
    } catch (error) {
      console.error("Grading failed:", error);
      alert("An error occurred during evaluation. Please try submitting again.");
      setAvatarStatus("listening");
    }
  };

  const handleSkipQuestion = () => {
    // Grade as zero
    stopTimer();
    stopDictation();
    if (window.speechSynthesis) window.speechSynthesis.cancel();
    
    const newFeedback = {
      question: currentQuestion,
      answer: "[Question Skipped]",
      score: 0,
      timeTaken: timeTakenRef.current,
      evaluation: {
        score: 0,
        accuracy: 0,
        clarity: 0,
        depth: 0,
        relevance: 0,
        timeEfficiency: 0,
        feedback: "Question was skipped by candidate.",
        strengths: ["None"],
        weaknesses: ["Candidate skipped the question entirely"],
        difficultySuggestion: "decrease"
      }
    };
    
    const updatedHistory = [...feedbackHistory, newFeedback];
    setFeedbackHistory(updatedHistory);
    
    const nextIndex = currentQuestionIndex + 1;
    const averageScore = updatedHistory.reduce((acc, curr) => acc + curr.score, 0) / updatedHistory.length;

    if (nextIndex >= 3 && averageScore < EARLY_TERMINATION_THRESHOLD) {
      onInterviewComplete({
        history: updatedHistory,
        role,
        averageScore,
        terminatedEarly: true
      });
      return;
    }

    if (nextIndex >= TOTAL_QUESTIONS) {
      onInterviewComplete({
        history: updatedHistory,
        role,
        averageScore,
        terminatedEarly: false
      });
    } else {
      setCurrentDifficulty("easy"); // Reset/Decrease difficulty after skipped
      setCurrentQuestionIndex(nextIndex);
      loadNextQuestion(false, "easy");
    }
  };

  const handleEndInterviewEarly = () => {
    if (window.confirm("Are you sure you want to end the interview early? This will calculate your final score based on questions completed so far.")) {
      const averageScore = feedbackHistory.length > 0 
        ? feedbackHistory.reduce((acc, curr) => acc + curr.score, 0) / feedbackHistory.length 
        : 0;
      
      onInterviewComplete({
        history: feedbackHistory,
        role,
        averageScore,
        terminatedEarly: true
      });
    }
  };

  // Calculations for Visual Progress Ring
  const radius = 30;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (timeLeft / timeLimit) * circumference;

  // Running average calculation for warning banners
  const currentRunningAverage = feedbackHistory.length > 0
    ? Math.round(feedbackHistory.reduce((acc, curr) => acc + curr.score, 0) / feedbackHistory.length)
    : null;

  return (
    <div className="interview-grid">
      {/* Sidebar: Interviewer Info and Status Dials */}
      <div className="interviewer-sidebar">
        <InterviewerAvatar status={avatarStatus} />
        
        <div className="glass-panel sidebar-status-card">
          <h3 style={{ fontSize: "1.1rem" }}>Session Progress</h3>
          <div className="status-row">
            <span className="status-label">Question Progress:</span>
            <span className="status-value">{currentQuestionIndex + 1} / {TOTAL_QUESTIONS}</span>
          </div>
          <div className="status-row">
            <span className="status-label">Active Difficulty:</span>
            <span className={`difficulty-badge ${currentDifficulty}`}>
              {currentDifficulty}
            </span>
          </div>
          <div className="status-row">
            <span className="status-label">Target Role:</span>
            <span className="status-value" style={{ textTransform: "capitalize" }}>{role}</span>
          </div>
          <div className="status-row">
            <span className="status-label">Running Average:</span>
            <span className="status-value" style={{ color: currentRunningAverage >= 75 ? "var(--neon-emerald)" : currentRunningAverage < 45 ? "var(--neon-rose)" : "var(--text-primary)" }}>
              {currentRunningAverage !== null ? `${currentRunningAverage}%` : "—"}
            </span>
          </div>
        </div>
      </div>

      {/* Main Panel: Live Question, Time limit, Answer inputs */}
      <div className="glass-panel live-interviewer-panel">
        {isLoadingQuestion ? (
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: "350px", width: "100%", gap: "1rem" }}>
            <div className="status-dot active grading" style={{ width: "30px", height: "30px", animation: "pulse-wave-indigo 1.5s infinite" }}></div>
            <p style={{ color: "var(--text-secondary)", fontWeight: "500" }}>
              {apiKey ? "Generating customized technical question..." : "Accessing local expert question bank..."}
            </p>
          </div>
        ) : (
          <>
            {/* Header: Number & Clock */}
            <div className="question-header">
              <div>
                <span className="question-number">QUESTION {currentQuestionIndex + 1}</span>
                <div style={{ display: "flex", gap: "0.5rem", marginTop: "0.25rem" }}>
                  {currentQuestion?.topics.map((t, i) => (
                    <span key={i} style={{ fontSize: "0.75rem", background: "rgba(255,255,255,0.05)", padding: "0.15rem 0.5rem", borderRadius: "4px", color: "var(--text-secondary)" }}>
                      {t}
                    </span>
                  ))}
                </div>
              </div>

              {/* Progress Ring Timer */}
              <div className="timer-container" title="Strict time limit to answer this question">
                <svg className="timer-circle-svg">
                  <circle className="timer-circle-bg" cx="35" cy="35" r={radius} />
                  <circle 
                    className={`timer-circle-progress ${timeLeft < 15 ? "danger" : timeLeft < 30 ? "warning" : ""}`} 
                    cx="35" 
                    cy="35" 
                    r={radius} 
                    strokeDasharray={circumference}
                    strokeDashoffset={strokeDashoffset}
                  />
                </svg>
                <span className={`timer-text ${timeLeft < 15 ? "danger" : ""}`}>
                  {timeLeft}s
                </span>
              </div>
            </div>

            {/* Question Text */}
            <div className="question-bubble">
              {currentQuestion?.question}
            </div>

            {/* Controls */}
            <div style={{ display: "flex", gap: "1rem", marginTop: "-0.5rem" }}>
              <button 
                type="button" 
                className="btn btn-secondary" 
                style={{ padding: "0.4rem 0.8rem", borderRadius: "8px", fontSize: "0.8rem" }}
                onClick={() => speakQuestion(currentQuestion?.question)}
                disabled={avatarStatus === "speaking"}
              >
                <Volume2 size={14} />
                Repeat Question
              </button>
            </div>

            {/* Candidate Response Form */}
            <div className="form-group" style={{ marginTop: "1rem" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <label className="form-label" htmlFor="response-text">
                  Your Response
                </label>
                <span style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>
                  Character Count: {answerText.length} | Target: &gt;100 chars
                </span>
              </div>
              
              <textarea
                id="response-text"
                className="textarea-input"
                placeholder="Formulate your response here. Speak details, technical specifications, and clear conceptual explanations..."
                value={answerText}
                onChange={(e) => setAnswerText(e.target.value)}
                disabled={avatarStatus === "grading"}
                style={{ minHeight: "220px", fontSize: "1rem", lineHeight: "1.5" }}
              />

              {/* Speech to Text Dictation Button */}
              <div className="voice-dictation-control">
                <span className={`dictation-status ${isDictating ? "recording" : ""}`}>
                  {isDictating && <span className="pulse-dot-red"></span>}
                  {isDictating ? "🔴 Dictation Recording Active... Speak directly into your mic." : "🎙️ Use voice dictation to speak your interview responses."}
                </span>
                
                <button
                  type="button"
                  className={`btn ${isDictating ? "btn-danger" : "btn-indigo"}`}
                  style={{ padding: "0.5rem 1.2rem", borderRadius: "8px", fontSize: "0.85rem" }}
                  onClick={toggleDictation}
                  disabled={avatarStatus === "grading"}
                >
                  {isDictating ? <MicOff size={16} /> : <Mic size={16} />}
                  {isDictating ? "Stop Recording" : "Dictate Response"}
                </button>
              </div>
            </div>

            {/* Performance warnings: alert user if threshold limits are approaching */}
            {currentRunningAverage !== null && currentRunningAverage < WARNING_THRESHOLD && (
              <div className="warning-banner">
                <AlertTriangle size={18} />
                <span>
                  <strong>Performance Risk:</strong> Your current average score ({currentRunningAverage}%) is close to the early termination threshold ({EARLY_TERMINATION_THRESHOLD}%). Provide higher quality, deeper answers!
                </span>
              </div>
            )}

            {/* Dashboard Footer Controls */}
            <div className="action-buttons-group">
              <button
                type="button"
                className="btn btn-secondary"
                style={{ color: "var(--neon-rose)" }}
                onClick={handleEndInterviewEarly}
                disabled={avatarStatus === "grading"}
              >
                <XCircle size={16} />
                Force Quit
              </button>

              <div className="right-actions">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={handleSkipQuestion}
                  disabled={avatarStatus === "grading"}
                >
                  <SkipForward size={16} />
                  Skip (-0 points)
                </button>

                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={() => submitAnswer(false)}
                  disabled={avatarStatus === "grading" || !answerText.trim()}
                >
                  {avatarStatus === "grading" ? (
                    <>
                      <span className="status-dot active grading" style={{ width: "8px", height: "8px" }}></span>
                      Evaluating...
                    </>
                  ) : (
                    <>
                      Submit Answer
                      <ArrowRight size={16} />
                    </>
                  )}
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default InterviewPanel;
