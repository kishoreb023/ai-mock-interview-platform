// API client for Gemini REST API (no package install needed, works directly with fetch)

export const evaluateResponseWithGemini = async (apiKey, questionObj, candidateAnswer, timeTaken) => {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`;
  
  const systemPrompt = `You are a professional, objective technical interviewer. 
Evaluate the candidate's response to the given question based on these criteria:
1. Accuracy (correctness of the information)
2. Clarity (well-structured, easy to understand)
3. Depth (conceptual details, nuances)
4. Relevance (directly answers the prompt)
5. Time Efficiency (Time taken: ${timeTaken}s, Limit: ${questionObj.timeLimit}s. If they went over, penalize slightly. If they completed fast with rich content, reward).

Provide a constructive review. You MUST return ONLY a valid JSON object. Do not wrap in markdown \`\`\`json blocks.
The JSON structure must match this exactly:
{
  "score": 82, // overall score out of 100
  "accuracy": 85, // score out of 100
  "clarity": 80, // score out of 100
  "depth": 75, // score out of 100
  "relevance": 90, // score out of 100
  "timeEfficiency": 80, // score out of 100
  "feedback": "A concise 2-3 sentence analysis of their response.",
  "strengths": ["List 1-2 major correct points they raised"],
  "weaknesses": ["List 1-2 items they missed or got wrong"],
  "difficultySuggestion": "increase" // "increase" if score >= 75, "decrease" if score < 45, else "maintain"
}`;

  const prompt = `
Question difficulty: ${questionObj.difficulty}
Question Category: ${questionObj.category}
Topics: ${questionObj.topics.join(", ")}
Question: "${questionObj.question}"
Sample reference answer: "${questionObj.sampleAnswer}"

Candidate's Answer: "${candidateAnswer || "[No answer / Skipped / Timeout]"}"
Time Taken: ${timeTaken} seconds
Time Limit: ${questionObj.timeLimit} seconds

Grade this objectively.`;

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              { text: systemPrompt + "\n\n" + prompt }
            ]
          }
        ],
        generationConfig: {
          responseMimeType: "application/json",
          temperature: 0.1
        }
      })
    });

    if (!response.ok) {
      const errText = await response.text();
      throw new Error(`Gemini API Error: ${response.status} - ${errText}`);
    }

    const data = await response.json();
    const textContent = data.candidates?.[0]?.content?.parts?.[0]?.text;
    
    // Clean potential markdown wrap just in case
    let cleanedText = textContent.trim();
    if (cleanedText.startsWith("```json")) {
      cleanedText = cleanedText.substring(7);
    }
    if (cleanedText.endsWith("```")) {
      cleanedText = cleanedText.substring(0, cleanedText.length - 3);
    }
    cleanedText = cleanedText.trim();
    
    return JSON.parse(cleanedText);
  } catch (error) {
    console.error("Error calling Gemini API:", error);
    throw error;
  }
};

export const generateQuestionWithGemini = async (apiKey, role, difficulty, previousTopics = [], resumeText = "", jdText = "") => {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`;
  
  const systemPrompt = `You are an expert AI Interviewer conducting a technical interview for a ${role} role.
Generate exactly ONE relevant interview question matching the requested difficulty: ${difficulty.toUpperCase()}.
Align the question with the provided Candidate Resume and Job Description (JD) if available.
Make the question technical, conceptual, behavioral, or scenario-based. Do not repeat topics from this list: ${previousTopics.join(", ")}.

You MUST return ONLY a valid JSON object. Do not wrap in markdown.
The JSON structure must match this exactly:
{
  "id": "gemini_${difficulty}_${Date.now()}",
  "difficulty": "${difficulty}",
  "category": "technical", // choose: "technical", "conceptual", "behavioral", "scenario"
  "topics": ["React", "JavaScript"], // 1 to 3 relevant tech topics
  "question": "The actual question here...",
  "sampleAnswer": "A comprehensive sample ideal answer that a strong candidate should give.",
  "keySkills": ["Skill1", "Skill2"],
  "timeLimit": ${difficulty === 'easy' ? 60 : difficulty === 'medium' ? 90 : 120}
}`;

  const prompt = `
Resume: "${resumeText || "General candidate for " + role}"
Job Description (JD): "${jdText || "Standard industry requirement for " + role}"
Difficulty level: ${difficulty}
Avoid previous topics: ${previousTopics.join(", ")}
Generate the question:`;

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              { text: systemPrompt + "\n\n" + prompt }
            ]
          }
        ],
        generationConfig: {
          responseMimeType: "application/json",
          temperature: 0.7
        }
      })
    });

    if (!response.ok) {
      throw new Error(`Gemini generate question failed: ${response.status}`);
    }

    const data = await response.json();
    const textContent = data.candidates?.[0]?.content?.parts?.[0]?.text;
    
    let cleanedText = textContent.trim();
    if (cleanedText.startsWith("```json")) {
      cleanedText = cleanedText.substring(7);
    }
    if (cleanedText.endsWith("```")) {
      cleanedText = cleanedText.substring(0, cleanedText.length - 3);
    }
    cleanedText = cleanedText.trim();
    
    return JSON.parse(cleanedText);
  } catch (error) {
    console.error("Error generating question from Gemini:", error);
    throw error;
  }
};
