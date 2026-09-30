import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import 'dotenv/config';

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API Routes
  app.post("/api/ai/chat", async (req, res) => {
    try {
      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey) {
        throw new Error("GEMINI_API_KEY environment variable is required");
      }
      
      const { prompt, history, context } = req.body;
      const ai = new GoogleGenAI({ apiKey });
      
      const systemInstruction = `You are PathForward AI, an expert career advisor for engineering students.
You provide concise, personalized, and actionable career advice.
Student Context: ${JSON.stringify(context || {})}`;

      const formattedHistory = history?.map((msg: any) => ({
        role: msg.role === 'user' ? 'user' : 'model',
        parts: [{ text: msg.content }]
      })) || [];

      // Use systemInstruction in the chat config
      const chat = ai.chats.create({
        model: "gemini-3.6-flash",
        config: {
          systemInstruction: systemInstruction,
          temperature: 0.7,
        }
      });
      
      // We cannot easily set history in the current SDK version this way, so we just use generateContent if history is needed, or just send it as part of the prompt.
      // Wait, we can use ai.models.generateContent
      
      const allMessages = [
        ...formattedHistory,
        { role: 'user', parts: [{ text: prompt }]}
      ];

      let response;
      let retries = 3;
      while (retries > 0) {
        try {
          response = await ai.models.generateContent({
            model: "gemini-3.6-flash",
            contents: allMessages,
            config: {
              systemInstruction: systemInstruction,
              temperature: 0.7
            }
          });
          break; // Success, exit retry loop
        } catch (error: any) {
          retries--;
          // Check if it's a 503 overload error
          if (retries === 0 || !error?.message?.includes('503')) {
            throw error; // Re-throw if out of retries or not a 503
          }
          console.log(`API Overloaded (503). Retrying in 2 seconds... (${retries} retries left)`);
          await new Promise(resolve => setTimeout(resolve, 2000)); // Wait 2s before retry
        }
      }

      res.json({ text: response?.text || "No response generated." });
    } catch (error: any) {
      console.error("AI Error:", error);
      res.status(500).json({ error: error.message || "Failed to generate AI response" });
    }
  });
  
  app.post("/api/ai/analyze-assessment", async (req, res) => {
    try {
      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey) {
        throw new Error("GEMINI_API_KEY environment variable is required");
      }
      
      const { assessmentData } = req.body;
      const ai = new GoogleGenAI({ apiKey });
      
      const prompt = `Analyze this engineering student's career assessment:
      ${JSON.stringify(assessmentData, null, 2)}
      
      Based on these inputs, recommend a primary career path and a backup career path from these 5 options:
      1. Placement (Core)
      2. Placement (Software)
      3. Higher Studies
      4. Government Exams
      5. Entrepreneurship
      
      Return ONLY a JSON object with this exact structure, no markdown formatting like \`\`\`json:
      {
        "primaryPath": "Placement (Software)",
        "primaryScore": 87,
        "backupPath": "Higher Studies",
        "backupScore": 74,
        "scores": {
          "Placement (Software)": 87,
          "Higher Studies": 74,
          "Placement (Core)": 62,
          "Entrepreneurship": 58,
          "Government Exams": 41
        },
        "reasoning": "A short, concise 2-sentence explanation of why the primary path fits them.",
        "strengths": ["string", "string", "string"],
        "improvements": ["string", "string", "string"],
        "nextStep": "A short actionable next step."
      }`;

      let response;
      let retries = 3;
      while (retries > 0) {
        try {
          response = await ai.models.generateContent({
            model: "gemini-3.6-flash",
            contents: prompt,
            config: {
              temperature: 0.2,
              responseMimeType: "application/json"
            }
          });
          break; // Success, exit retry loop
        } catch (error: any) {
          retries--;
          if (retries === 0 || !error?.message?.includes('503')) {
            throw error;
          }
          console.log(`API Overloaded (503). Retrying in 2 seconds... (${retries} retries left)`);
          await new Promise(resolve => setTimeout(resolve, 2000));
        }
      }
      
      const rawText = response?.text || "{}";
      const cleanedText = rawText.replace(/```json/g, '').replace(/```/g, '').trim();
      
      res.json(JSON.parse(cleanedText));
    } catch (error: any) {
      console.error("AI Error:", error);
      res.status(500).json({ error: error.message || "Failed to analyze assessment" });
    }
  });

  app.post("/api/ai/interview", async (req, res) => {
    try {
      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey) {
        throw new Error("GEMINI_API_KEY environment variable is required");
      }
      
      const { careerPath, focus, history } = req.body;
      const ai = new GoogleGenAI({ apiKey });
      
      const systemInstruction = `You are an expert technical interviewer for a ${careerPath} position. Focus on ${focus} questions.
Your task is to conduct a mock interview.
If this is the start of the interview (no history), generate the first interview question.
If the user provides an answer, you must:
1. Provide very brief, constructive feedback on their answer.
2. Provide a score out of 10 for their answer.
3. Ask the NEXT interview question.

Output strictly in this JSON format (no markdown tags):
{
  "feedback": "Your constructive feedback here...",
  "score": 8,
  "nextQuestion": "The next interview question here..."
}`;

      // Convert history to genai format
      const formattedHistory = history?.map((msg: any) => ({
        role: msg.role === 'user' ? 'user' : 'model',
        parts: [{ text: typeof msg.content === 'string' ? msg.content : JSON.stringify(msg.content) }]
      })) || [];
      
      // If no history, just say start. Otherwise the last message is the user's answer
      const latestMessage = formattedHistory.length === 0 
        ? { role: 'user', parts: [{ text: "Start the interview." }] }
        : formattedHistory.pop();

      const allMessages = [
        ...formattedHistory,
        latestMessage
      ];

      let response;
      let retries = 3;
      while (retries > 0) {
        try {
          response = await ai.models.generateContent({
            model: "gemini-3.6-flash",
            contents: allMessages,
            config: {
              systemInstruction: systemInstruction,
              temperature: 0.7,
              responseMimeType: "application/json"
            }
          });
          break;
        } catch (error: any) {
          retries--;
          if (retries === 0 || !error?.message?.includes('503')) {
            throw error;
          }
          console.log(`API Overloaded (503). Retrying in 2 seconds... (${retries} retries left)`);
          await new Promise(resolve => setTimeout(resolve, 2000));
        }
      }

      const rawText = response?.text || "{}";
      const cleanedText = rawText.replace(/```json/g, '').replace(/```/g, '').trim();
      
      res.json(JSON.parse(cleanedText));
    } catch (error: any) {
      console.error("AI Error:", error);
      res.status(500).json({ error: error.message || "Failed to generate interview response" });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
