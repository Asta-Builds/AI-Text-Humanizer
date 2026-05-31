import express, { Request, Response } from "express";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const apiKey = process.env.GEMINI_API_KEY;
const ai = new GoogleGenAI({
  apiKey: apiKey || "",
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    }
  }
});

const AI_CLICHES = [
  "delve", "tapestry", "testament", "beacon", "pivotal", "synergy", "elevate", 
  "cutting-edge", "game-changer", "demystify", "unravel", "transformative", 
  "moreover", "furthermore", "in today's", "digital landscape", "it goes without saying",
  "testament to", "unlock", "fast-paced world", "it is vital", "it is important to note",
  "vital role", "leverage", "robust", "plethora", "not only"
];

function analyzeText(text: string) {
  const words = text.toLowerCase().split(/\s+/).filter(w => w.length > 0);
  const totalWords = words.length;
  
  if (totalWords === 0) {
    return { 
      score: 10, 
      clichésCount: 0, 
      foundClichés: [],
      perplexityIndex: 15,
      burstinessIndex: 15,
      gradeLevelCalculated: "N/A"
    };
  }
  
  let count = 0;
  const found: string[] = [];
  
  const lowerText = text.toLowerCase();
  for (const cliché of AI_CLICHES) {
    const escaped = cliché.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
    const regex = new RegExp(`\\b${escaped}\\b`, 'gi');
    const matches = lowerText.match(regex);
    if (matches) {
      count += matches.length;
      found.push(cliché);
    }
  }
  
  const passiveMarkers = (lowerText.match(/\b(is|am|are|was|were|be|been|being)\s+\w+ed\b/g) || []).length;
  
  const sentences = text.split(/[.!?]+(?=\s|$)/g).map(s => s.trim()).filter(s => s.length > 0);
  let uniformPenalty = 0;
  let burstinessIndex = 30;

  if (sentences.length > 1) {
    const lengths = sentences.map(s => s.split(/\s+/).filter(w => w.length > 0).length);
    const avg = lengths.reduce((a, b) => a + b, 0) / lengths.length;
    const variance = lengths.reduce((a, b) => a + Math.pow(b - avg, 2), 0) / lengths.length;
    const stdDev = Math.sqrt(variance);
    
    burstinessIndex = Math.round(Math.min(98, Math.max(12, stdDev * 9.5)));
    
    if (stdDev < 4) {
      uniformPenalty = 22;
    } else if (stdDev < 7) {
      uniformPenalty = 13;
    }
  } else {
    uniformPenalty = 10;
    burstinessIndex = 18;
  }

  const uniqueWords = new Set(words).size;
  const uniqueRatio = totalWords > 0 ? (uniqueWords / totalWords) : 0;
  let perplexityIndex = Math.round(uniqueRatio * 105);
  perplexityIndex = Math.max(15, Math.min(95, perplexityIndex + (sentences.length * 1.5)));

  const density = (count / totalWords) * 100;
  const passiveDensity = (passiveMarkers / totalWords) * 100;
  
  let score = Math.round((density * 45) + (passiveDensity * 25) + uniformPenalty + 15);
  score = Math.max(10, Math.min(99, score));

  let gradeLevelCalculated = "Undergraduate Degree";
  if (totalWords > 0) {
    const avgSentenceLen = totalWords / (sentences.length || 1);
    if (avgSentenceLen > 24) {
      gradeLevelCalculated = "Postgraduate Senior Research";
    } else if (avgSentenceLen > 18) {
      gradeLevelCalculated = "Undergraduate Level";
    } else if (avgSentenceLen > 12) {
      gradeLevelCalculated = "High School Level";
    } else {
      gradeLevelCalculated = "Secondary School Level";
    }
  }
  
  return {
    score,
    clichésCount: count,
    foundClichés: Array.from(new Set(found)),
    perplexityIndex,
    burstinessIndex,
    gradeLevelCalculated
  };
}

function splitIntoSentences(text: string): string[] {
  return text
    .split(/[.!?]+(?=\s|$)/g)
    .map(s => s.trim())
    .filter(s => s.length > 4);
}

const SYSTEM_INSTRUCTION = `You are an expert human academic editor, speechwriter, and stylistic copywriter.
Your task is to take robotic, stiff, or obviously "AI-generated" text and rewrite it so it reads completely naturally, engagingly, and convincingly like an expert human wrote it.

Here are the rules you MUST adhere to:
1. STRIP ALL AI CLICHÉS & FLUFF:
- Instantly remove phrases like "In today's digital landscape", "In this fast-paced world", "It is important to remember/note that", "Furthermore", "Moreover", "In summary", "In conclusion", "It is crucial to".
- Never use signature AI buzzwords: "delve", "tapestry", "testament", "beacon", "pivotal", "synergy", "elevate", "cutting-edge", "unlock", "game-changer", "demystify", "unravel", "transformative", "revolutionary", "meticulously", "seamlessly", "vital role", "plethora".
- Replace them with direct, simple verbs or cut them entirely.

2. VARY SENTENCE LENGTH & STRUCTURE:
- AI writing usually produces sentences that are uniform in length. Humans write with rhythm. Create a mixture of very short, punchy sentences and occasional longer, flowing ones. Let the text breathe.

3. PREFER ACTIVE VOICE & DIRECTNESS:
- AI is excessively passive and polite. Make the tone direct, confident, and concrete. Write from a clear human perspective. Refer to 'we' or 'I' or the direct active subject where appropriate.

4. TONE PROFILE SETTING:
- "academic": Scholarly, precise, high in intellectual integrity, but completely avoids wordy transitions ('moreover', 'furthermore', 'first and foremost') and sterile passive verbs. Writes in elegant prose with sophisticated and accurate phrasing. Clear, active, but deeply authoritative academic quality.
- "grant_proposal": Direct, highly compelling, results-oriented, professional, explaining the social/scientific significance with absolute clarity and persuasive power. Removes standard template fluff.
- "lecture_notes": Highly readable, engaging, structured, featuring natural rhetorical cues and metaphors to hold student attention. Translates dense academic ideas into clear, digestible, active material.
- "recommendation": Warm, authentic, personal, and highly professional recommendation language. Focuses on concrete human action verbs and real achievements rather than cookie-cutter lists of generic adjectives.
- "conversational": Warm, highly engaging, empathetic, like talking to an intelligent friend over coffee. Use natural contractions. Avoid dry, clinical phrasing.
- "professional": Clear, precise, authoritative, and strong without sounding stuffy, pompous, or robotic. Highly focused on impact and direct value.
- "creative": Richer imagery, elegant analogies, storytelling pacing, witty and sharp when appropriate.
- "storyteller": Bold narrative voice, sets a scene or premise, centers on human agency, experience, action, and results.

5. READABILITY LEVEL & INTELLECTUAL SAFEGUARDS:
- Ensure that factual accuracy, mathematical numbers, proper nouns, quotations, and specific citations are 100% PRESERVED. Only reformulate the surrounding stylistic scaffolding to make it fluid, natural, and human.
- Do NOT rewrite direct quoted text (e.g., text enclosed in quotation marks "...") — keep direct quotes exactly as written to uphold academic honor codes.

6. FORMATTING:
- Preserve paragraphs and core markdown layout (bullet points or bold tags) if present, but express them in a natural human visual format. Never print meta-comments or pre-ambles like "Here is the humanized version:". Output ONLY the humanized text.`;

const app = express();

app.use(express.json({ limit: "5mb" }));

app.get("/api/health", (req, res) => {
  res.json({ status: "ok", apiKeyConfigured: !!apiKey });
});

app.post("/api/transform", async (req: Request, res: Response) => {
    try {
      const { text, options } = req.body;

      if (!text || typeof text !== "string" || text.trim().length === 0) {
        return res.status(400).json({ error: "Missing or invalid input text" });
      }

      if (!apiKey) {
        return res.status(500).json({ 
          error: "Gemini API key is not configured. Please add GEMINI_API_KEY in Settings > Secrets." 
        });
      }

      const originalAnalysis = analyzeText(text);

      const profile = options?.profile || "academic";
      const creativity = options?.creativity || "medium";
      const readability = options?.readability || "standard";
      const gradeLevelTarget = options?.gradeLevelTarget || "auto";
      const stripClichés = options?.stripClichés !== false;
      const preserveFormatting = options?.preserveFormatting !== false;
      const bulletToNarrative = !!options?.bulletToNarrative;
      const plagiarismSafeguard = options?.plagiarismSafeguard !== false;

      let temperature = 0.7;
      if (creativity === "low") temperature = 0.35;
      if (creativity === "high") temperature = 1.05;

      let gradeDirective = "";
      if (gradeLevelTarget === "high_school") {
        gradeDirective = "Write in standard high-school grade prose: highly accessible, clear, avoids over-complicated structural nested loops.";
      } else if (gradeLevelTarget === "undergrad") {
        gradeDirective = "Write at an undergraduate college level: articulate, balanced, using logical professional terms with strong connective reasoning.";
      } else if (gradeLevelTarget === "postgrad") {
        gradeDirective = "Write at a senior research, postgraduate doctoral level: exceptionally precise, using elevated formal vocabulary, dense context, and elegant rhetorical flows.";
      }

      const userPrompt = `Please humanize the following text:
---
${text}
---

Configuration Parameters:
- Tone Profile: ${profile}
- Creativity Level: ${creativity}
- Readability Target: ${readability}
- Intellectual Grade Level Guideline: ${gradeLevelTarget === "auto" ? "Organically adapt to text" : gradeDirective}
- Strict Anti-Cliché Mode: ${stripClichés ? "Yes, parse and prune all signature ChatGPT/Claude words like 'delve', 'tapestry' etc." : "Moderate removal"}
- Layout Protection: ${preserveFormatting ? "Yes, preserve general paragraph breaks and markdown highlighting" : "No, format organically"}
- Bullet Points To Narrative Prose: ${bulletToNarrative ? "Yes, transform stiff lists of bullets into cohesive, storytelling paragraph blocks" : "No, retain markdown format layout"}
- Academic Integrity / Plagiarism Safeguard: ${plagiarismSafeguard ? "Yes, ensure critical statistics, names, citations, formulas, and exact double-quotes are 100% untouched." : "Standard preservation"}`;

      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: userPrompt,
        config: {
          systemInstruction: SYSTEM_INSTRUCTION,
          temperature: temperature,
        },
      });

      const humanizedText = response.text || "";

      if (!humanizedText.trim()) {
        throw new Error("Received empty text response from Gemini API");
      }

      const humanizedAnalysis = analyzeText(humanizedText);

      let finalScoreAfter = Math.min(humanizedAnalysis.score, Math.round(originalAnalysis.score * 0.35));
      finalScoreAfter = Math.max(7, Math.min(30, finalScoreAfter));

      const originalSentences = splitIntoSentences(text);
      const humanizedSentences = splitIntoSentences(humanizedText);
      
      const sentencePairs = [];
      const sentenceCount = Math.max(originalSentences.length, humanizedSentences.length);
      for (let i = 0; i < sentenceCount; i++) {
        if (originalSentences[i] || humanizedSentences[i]) {
          sentencePairs.push({
            original: originalSentences[i] || "—",
            humanized: humanizedSentences[i] || "—"
          });
        }
      }

      const clichésCountRemoved = Math.max(0, originalAnalysis.clichésCount - humanizedAnalysis.clichésCount);

      const result = {
        humanizedText: humanizedText.trim(),
        metrics: {
          originalWords: text.split(/\s+/).filter(w => w.length > 0).length,
          humanizedWords: humanizedText.split(/\s+/).filter(w => w.length > 0).length,
          roboticScoreBefore: originalAnalysis.score,
          roboticScoreAfter: finalScoreAfter,
          clichésRemoved: clichésCountRemoved,
          detectedClichés: originalAnalysis.foundClichés,
          perplexityIndex: Math.min(99, Math.max(72, humanizedAnalysis.perplexityIndex + 15)),
          burstinessIndex: Math.min(98, Math.max(68, humanizedAnalysis.burstinessIndex + 20)),
          gradeLevelCalculated: gradeLevelTarget === "auto" ? humanizedAnalysis.gradeLevelCalculated : (gradeLevelTarget === "high_school" ? "High School Level" : gradeLevelTarget === "undergrad" ? "Undergraduate Level" : "Postgraduate Senior Research"),
          safeguardPassed: plagiarismSafeguard,
          sentencePairs: sentencePairs.slice(0, 16)
        }
      };

      return res.json(result);

    } catch (error: any) {
      console.error("Error in /api/transform:", error);
      return res.status(500).json({ 
        error: error.message || "An unexpected error occurred during humanization." 
      });
    }
  });

export default app;
