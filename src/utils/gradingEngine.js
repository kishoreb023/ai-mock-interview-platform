import { evaluateResponseWithGemini } from "./geminiService";

// Helper to compute local mock grading if no API key is set
const evaluateLocalResponse = (questionObj, candidateAnswer, timeTaken) => {
  const answer = (candidateAnswer || "").trim().toLowerCase();
  
  if (!answer || answer.length < 5) {
    return {
      score: 0,
      accuracy: 0,
      clarity: 0,
      depth: 0,
      relevance: 0,
      timeEfficiency: 0,
      feedback: "No answer provided or response was too short to evaluate.",
      strengths: ["None"],
      weaknesses: ["Answer was missing or skipped"],
      difficultySuggestion: "decrease"
    };
  }

  // Tokenize answer and sampleAnswer
  const answerWords = new Set(answer.split(/\s+/).map(w => w.replace(/[^a-z0-9]/g, "")));
  const sampleWords = questionObj.sampleAnswer.toLowerCase().split(/\s+/).map(w => w.replace(/[^a-z0-9]/g, ""));
  
  // Highlight keywords
  const keywords = [...new Set(sampleWords.filter(w => w.length > 4))];
  let matchedKeywords = [];
  keywords.forEach(kw => {
    if (answer.includes(kw)) {
      matchedKeywords.push(kw);
    }
  });

  // Coverage ratio
  const matchRatio = matchedKeywords.length / Math.max(keywords.length, 1);
  
  // Calculate scores
  let accuracy = Math.min(Math.round(25 + matchRatio * 75), 100);
  let relevance = answer.length > 20 ? Math.min(Math.round(60 + Math.random() * 30 + (answer.includes(questionObj.topics[0].toLowerCase()) ? 10 : 0)), 100) : 30;
  
  // Depth based on length and match ratio
  let depth = Math.min(Math.round(20 + Math.min(answer.split(" ").length / 2, 50) + matchRatio * 30), 100);
  
  // Clarity based on some transition words (e.g., 'because', 'first', 'second', 'however', 'relative', 'absolute')
  const structuredIndicators = ["first", "second", "however", "therefore", "example", "difference", "whereas", "because", "such as", "additionally"];
  let structureCount = structuredIndicators.filter(indicator => answer.includes(indicator)).length;
  let clarity = Math.min(Math.round(50 + structureCount * 15 + Math.random() * 15), 100);

  // Time Efficiency
  const limit = questionObj.timeLimit;
  let timeEfficiency = 100;
  if (timeTaken > limit) {
    // Penalize going over time
    const overTimePct = (timeTaken - limit) / limit;
    timeEfficiency = Math.max(Math.round(100 - overTimePct * 50), 30);
  } else if (timeTaken < 5 && answer.split(" ").length < 10) {
    // Rushed answer
    timeEfficiency = 40;
  } else {
    // Reward finishing within time limits
    timeEfficiency = Math.round(75 + (1 - (timeTaken / limit)) * 25);
  }

  // Weight overall score: 35% Accuracy, 20% Depth, 20% Relevance, 15% Clarity, 10% Time Efficiency
  const rawScore = (accuracy * 0.35) + (depth * 0.20) + (relevance * 0.20) + (clarity * 0.15) + (timeEfficiency * 0.10);
  let score = Math.min(Math.round(rawScore), 100);

  // Dynamic feedback generator
  let feedback = "";
  let strengths = [];
  let weaknesses = [];

  if (score >= 75) {
    feedback = "Excellent response! You clearly articulated the core concepts with high precision and good logical structure.";
    strengths = [
      `Accurately covered key terms like: ${matchedKeywords.slice(0, 3).join(", ") || questionObj.topics.join(", ")}`,
      "Great response length and depth of explanation."
    ];
    weaknesses = matchedKeywords.length < keywords.length ? [
      `Could have expanded slightly more on: ${keywords.filter(k => !matchedKeywords.includes(k)).slice(0, 2).join(", ") || "edge cases"}`
    ] : ["None! Very thorough answer."];
  } else if (score >= 50) {
    feedback = "Good fundamental understanding, but the answer lacks comprehensive detail and could be structured better.";
    strengths = [
      `Successfully mentioned: ${matchedKeywords.slice(0, 2).join(", ") || questionObj.topics[0]}`
    ];
    weaknesses = [
      `Missing explanation for: ${keywords.filter(k => !matchedKeywords.includes(k)).slice(0, 2).join(", ") || "conceptual details"}`,
      "Consider using more structural signposts (e.g. 'First', 'In contrast') to improve clarity."
    ];
  } else {
    feedback = "The answer is too brief or missed the core concepts of the question. You should review this topic.";
    strengths = matchedKeywords.length > 0 ? [
      `Briefly mentioned: ${matchedKeywords[0]}`
    ] : ["Attempted to answer within the time limit."];
    weaknesses = [
      "Struggled to identify core principles.",
      "Extremely short response that fails to explain details or mechanisms."
    ];
  }

  // Suggest next difficulty
  let difficultySuggestion = "maintain";
  if (score >= 75) {
    difficultySuggestion = "increase";
  } else if (score < 40) {
    difficultySuggestion = "decrease";
  }

  return {
    score,
    accuracy,
    clarity,
    depth,
    relevance,
    timeEfficiency,
    feedback,
    strengths,
    weaknesses,
    difficultySuggestion
  };
};

export const gradeCandidateAnswer = async (apiKey, questionObj, candidateAnswer, timeTaken) => {
  if (apiKey && apiKey.trim() !== "") {
    try {
      return await evaluateResponseWithGemini(apiKey, questionObj, candidateAnswer, timeTaken);
    } catch (e) {
      console.warn("Fallback to local scoring engine due to API error:", e);
      return evaluateLocalResponse(questionObj, candidateAnswer, timeTaken);
    }
  } else {
    // Simulate real-world 1s processing delay to make local engine feel 'alive'
    await new Promise(resolve => setTimeout(resolve, 1200));
    return evaluateLocalResponse(questionObj, candidateAnswer, timeTaken);
  }
};
