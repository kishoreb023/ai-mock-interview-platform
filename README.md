 # 🎙️ Hack2Hire: AI-Powered Mock Interview Platform

### An Adaptive, Intelligent, and Time-Constrained Technical Interview Simulator

## 🎥 Demo Video

**Live Project Demonstration:**

https://drive.google.com/file/d/1Fo-3cqtfb_xowDXmQT7Kbv4uEoQCwTw5/view?usp=drivesdk

---

## 📌 Problem Statement

In today's competitive hiring landscape, candidates often struggle with real interviews despite having strong technical skills. Common challenges include:

* Lack of realistic interview practice
* Unstructured and subjective feedback
* No measurement of performance under time pressure
* Difficulty adapting to varying interview complexity
* No clear indicator of interview readiness

This project solves these problems by providing an AI-powered mock interview platform that simulates real-world technical interviews, dynamically adapts question difficulty, evaluates performance objectively, and generates actionable feedback.

---

## 🚀 Project Overview

The AI-Powered Mock Interview Platform acts as an intelligent interviewer that:

* Analyzes candidate resumes
* Evaluates job descriptions
* Generates relevant interview questions
* Adapts interview difficulty dynamically
* Enforces strict time constraints
* Performs objective scoring
* Generates interview readiness reports
* Provides hiring recommendations

The platform simulates the behavior of an experienced technical interviewer and evaluates candidates based on both technical knowledge and interview performance.

---

## ✨ Key Features

### 📄 Resume & JD Analysis

* Upload Resume (PDF/TXT)
* Upload or select Job Description
* Extract technical skills automatically
* Match candidate skills against role requirements
* Identify skill gaps and strengths

### 🤖 AI Interview Engine

* Generates technical interview questions
* Role-specific questioning
* Technical, conceptual, and scenario-based questions
* Context-aware questioning based on Resume and JD

### 🔄 Dynamic Difficulty Adaptation

The system automatically adjusts interview difficulty:

* Easy → Medium → Hard for strong performers
* Hard → Medium → Easy for weak performers

Rules:

* Score ≥ 75% → Increase Difficulty
* Score < 40% → Reduce Difficulty

This simulates how real interviewers adapt their questioning strategy.

### ⏱️ Strict Time Management

Response time limits:

| Difficulty | Time Limit  |
| ---------- | ----------- |
| Easy       | 60 seconds  |
| Medium     | 90 seconds  |
| Hard       | 120 seconds |

Features:

* Live countdown timer
* Automatic timeout detection
* Time-efficiency scoring
* Late-answer penalties

### 🛑 Early Interview Termination

To simulate real-world screening:

* Running average monitored continuously
* Interview terminates if average score falls below 35% after 3+ questions
* Warning displayed below 45%

This prevents unnecessary interview continuation for consistently poor performance.

### 📊 Comprehensive Analytics Dashboard

The platform evaluates:

* Accuracy
* Clarity
* Depth
* Relevance
* Time Efficiency

Outputs include:

* Final Readiness Score
* Hiring Recommendation
* Strengths Analysis
* Weakness Analysis
* Improvement Suggestions
* Interview Transcript

---

## 🏆 Readiness Score Categories

| Score    | Recommendation             |
| -------- | -------------------------- |
| 85 - 100 | 🏆 Hire With Distinction   |
| 70 - 84  | ✅ Recommended Hire         |
| 50 - 69  | ⚠️ Consider for Retraining |
| Below 50 | ❌ Do Not Hire              |

---

## 🧠 AI Evaluation Logic

Each answer is evaluated using:

### Technical Accuracy

Measures correctness of concepts and implementation details.

### Clarity

Measures communication effectiveness.

### Depth

Measures understanding beyond surface-level answers.

### Relevance

Measures alignment with the question.

### Time Efficiency

Measures response speed relative to allocated time.

Final scores are aggregated into a single Interview Readiness Score.

---

## 🎤 Voice Interaction Features

### Speech Synthesis

* AI interviewer reads questions aloud
* Human-like interview experience

### Speech Recognition

* Voice-based answer submission
* Hands-free interview mode

---

## 🛠️ Technology Stack

### Frontend

* React 19
* Vite
* Vanilla CSS
* Lucide React Icons

### AI Layer

* Google Gemini 2.5 Flash API
* Custom Prompt Engineering

### Offline Evaluation Engine

* Keyword Matching
* Semantic Scoring
* Timing Analysis
* Syntax Evaluation

### Browser APIs

* Web Speech Synthesis API
* Web Speech Recognition API

---

## 📂 Project Structure

```text
src/

├── components/
│   ├── ResumeJDSelector.jsx
│   ├── InterviewPanel.jsx
│   ├── InterviewerAvatar.jsx
│   └── AnalyticsReport.jsx
│
├── data/
│   └── questionBank.js
│
├── utils/
│   ├── geminiService.js
│   └── gradingEngine.js
│
├── styles/
│   ├── index.css
│   └── components.css
│
├── App.jsx
└── main.jsx
```

---

## ⚙️ Installation

### Clone Repository

```bash
git clone <repository-url>
cd ai-interview
```

### Install Dependencies

```bash
npm install
```

### Run Development Server

```bash
npm run dev
```

### Build Production Version

```bash
npm run build
```

---

## 🧪 Testing Adaptive Logic

### Test Difficulty Promotion

1. Select Frontend Engineer preset
2. Start Interview
3. Answer in detail using technical terminology
4. Score above 75%
5. Observe difficulty increase

### Test Difficulty Downgrade

1. Submit short or weak answers
2. Score below 40%
3. Observe difficulty reduction

### Test Time Penalty

1. Allow timer to expire
2. Submit late answer
3. Observe reduced Time Efficiency score

### Test Early Termination

1. Skip multiple questions
2. Keep average below 35%
3. Observe automatic interview termination

---

## 📈 Output Deliverables

The platform generates:

* Final Interview Readiness Score
* Skill-wise Performance Breakdown
* Strengths & Weaknesses Analysis
* Hiring Recommendation
* Personalized Improvement Plan
* Complete Interview Transcript
* Exportable Markdown Report

---

## 🎯 Hackathon Objectives Achieved

✅ Resume Analysis

✅ Job Description Analysis

✅ AI Interview Question Generation

✅ Dynamic Difficulty Adaptation

✅ Time-Constrained Responses

✅ Early Interview Termination

✅ Objective Scoring Mechanism

✅ Readiness Score Generation

✅ Hiring Recommendation

✅ Detailed Feedback Report

---

## 👨‍💻 Developed For

Hack2Hire: AI-Powered Interview Hackathon

Built to simulate real-world technical interview environments using adaptive AI, intelligent evaluation systems, and performance analytics.

---

### Demo Video

https://drive.google.com/file/d/1Fo-3cqtfb_xowDXmQT7Kbv4uEoQCwTw5/view?usp=drivesdk
