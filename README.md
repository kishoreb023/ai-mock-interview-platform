# 🎙️ Hack2Hire: AI-Powered Mock Interview Platform
### *An Adaptive, Immersive, and Strict Time-Constrained Technical Interview Simulator*

Welcome to the **AI-Powered Mock Interview Platform** built for the **Hack2Hire Interview Hackathon**. 

This system acts just like an elite real-world technical interviewer—it doesn't just ask questions; it **thinks, adapts, grades, and decides**. It evaluates candidates dynamically based on their resume, job description (JD), speed, and conceptual depth, using a high-fidelity state-based interview engine.

---

## 🌟 Key Capabilities Engineered

1. **📄 Intelligent Resume & JD Parser**:
   - Compares the candidate's resume with the target Job Description (JD) to customize technical targets.
   - Offers preloaded templates for industry-standard roles (**Frontend Engineer, Backend Developer, Full-stack Developer, Data Scientist / AI Engineer**) for instant evaluation.
   - Accepts PDF and TXT resumes, parsing and extracting key technical skills.

2. **🤖 Multi-Mode AI Interview Engine (Gemini & Offline Hybrid)**:
   - **Gemini API Key Mode**: Enter your Gemini API Key in the settings panel to enable real-time, highly-customized questions and deep evaluations utilizing Google's Gemini 2.5 Flash model.
   - **Offline Local Expert Mode**: If no API key is set, a robust offline grading system utilizes keyword intersection, syntactic structure verification, response length, and timing metrics to deliver incredibly realistic scores and detailed feedback card summaries.

3. **🔄 Real-Time Dynamic Difficulty Adaptation**:
   - The interviewer adapts question difficulty dynamically!
   - Strong answers (Score $\ge$ 75%) upgrade difficulty: `Easy ➔ Medium ➔ Hard`.
   - Weak answers (Score < 40%) downgrade difficulty: `Hard ➔ Medium ➔ Easy` or maintain state, replicating actual human interview dynamics.

4. **⏱️ Strict Time Constraints (Visual Countdown Ring)**:
   - Fixed response times per question (60s for Easy, 90s for Medium, 120s for Hard).
   - A pulsing visual SVG countdown timer tracks limits. Over-time answers are automatically locked, penalizing the time efficiency metrics.

5. **🛑 Early Interview Termination Check**:
   - Minimizes scaling overhead. If a candidate's running average score falls below **35%** after answering 3 or more questions, the system triggers early termination, cutting the interview short and directing them to their final metrics scorecard.
   - Shows active warning alerts if the running average falls below **45%**.

6. **📊 Neon Analytics & Readiness Scorecard**:
   - Radial HUD readiness index indicating hiring recommendations:
     - 🏆 **HIRE WITH DISTINCTION** ($\ge$ 85%)
     - ✅ **RECOMMENDED HIRE** (70% - 84%)
     - ⚠️ **CONSIDER FOR RETRAINING** (50% - 69%)
     - ❌ **DO NOT HIRE** (< 50%)
   - Five-axis metric meters: **Accuracy, Clarity, Depth, Relevance, and Time Efficiency**.
   - Aggregated listing of **Hiring Strengths** and **Improvement Areas**.
   - Targeted training prep cards.
   - Full question/response timeline transcript with accordion details.
   - Single-click **Markdown Transcript Export** to save the interview report.

---

## 🛠️ Technology Stack & Architecture

- **Core Framework**: React 19 (Vite scaffolded)
- **Styling**: Vanilla CSS (Premium "Neo-Synth Dark" glassmorphism theme)
- **Icons**: Lucide React
- **Services**: Fetch-based REST integration with Google Gemini 2.5 Flash API
- **Web Speech Synthesis API**: Speaks questions out loud using synthesized human voices.
- **Web Speech Recognition API**: Allows the candidate to dictate their technical responses via voice instead of typing!

### 📂 Directory Structure
```
/src
  /components
    - ResumeJDSelector.jsx    # Preloaded templates, file uploads, API configs
    - InterviewPanel.jsx     # Live state machines, timers, voice syntheses, speech dictation
    - InterviewerAvatar.jsx  # Pulsing visual HUD, voice speaking indicators, status pills
    - AnalyticsReport.jsx     # Gauge scores, metrics sliders, transcript accordions
  /data
    - questionBank.js         # Offline hybrid question pool (100+ questions across 4 roles)
  /styles
    - index.css              # Theme constants, variables, base typography, global animations
    - components.css         # Glass panels, circular timers, skills grid, buttons
  /utils
    - geminiService.js       # Dynamic question generations and AI-graded schemas
    - gradingEngine.js       # Router combining Gemini APIs with offline syntactic keyword grading
  - App.jsx                  # Main router state controller
  - main.jsx                 # Client entry point
```

---

## 🚀 Quick Start & Installation

### 1. Clone the repository and navigate into it:
```bash
git clone <your-repo-link>
cd ai-interview
```

### 2. Install all dependencies:
```bash
npm install
```

### 3. Run the development server locally:
```bash
npm run dev
```

### 4. Build the production assets:
```bash
npm run build
```

---

## 💡 How to Test the Dynamic Adaptive Logic

1. Launch the app and click the **Frontend Engineer** preset role template. (This automatically populates high-level React developer resumes and JDs).
2. Click **Initialize Interview Simulator**.
3. You will receive an **Easy** CSS/HTML question. The AI interviewer will speak the question out loud!
4. **Test Dynamic Promotion**: Write a long, highly detailed answer containing keywords like "relative", "absolute", "fixed", "viewport", "scroll", "sticky" and submit.
   - You will score high ($\ge$ 75%), and the next question will be promoted to **Medium** difficulty!
5. **Test Time Penalty**: On the next question, write a simple 2-word answer or let the timer run down.
   - You will receive a low score, causing the difficulty to downgrade.
6. **Test Early Termination**: Skip or write blank answers for the next 2 questions. Your running average score will fall below **35%**, and the system will instantly terminate the session, taking you straight to the analytics results report!
