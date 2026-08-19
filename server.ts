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

      const response = await ai.models.generateContent({
        model: "gemini-3.6-flash",
        contents: allMessages,
        config: {
          systemInstruction: systemInstruction,
          temperature: 0.7
        }
      });

      res.json({ text: response.text });
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
      1. Placement - Core Engineering
      2. Placement - Software/IT
      3. Higher Studies
      4. Government Exams
      5. Entrepreneurship
      
      Return ONLY a JSON object with this exact structure, no markdown formatting like \`\`\`json:
      {
        "primaryPath": "Software/IT",
        "primaryScore": 87,
        "backupPath": "Higher Studies",
        "backupScore": 74,
        "scores": {
          "Software/IT": 87,
          "Higher Studies": 74,
          "Core Engineering": 62,
          "Entrepreneurship": 58,
          "Government Exams": 41
        },
        "reasoning": "A short, concise 2-sentence explanation of why the primary path fits them.",
        "strengths": ["string", "string", "string"],
        "improvements": ["string", "string", "string"],
        "nextStep": "A short actionable next step."
      }`;

      const response = await ai.models.generateContent({
        model: "gemini-3.6-flash",
        contents: prompt,
        config: {
          temperature: 0.2,
          responseMimeType: "application/json"
        }
      });
      
      const rawText = response.text || "{}";
      const cleanedText = rawText.replace(/```json/g, '').replace(/```/g, '').trim();
      
      res.json(JSON.parse(cleanedText));
    } catch (error: any) {
      console.error("AI Error:", error);
      res.status(500).json({ error: error.message || "Failed to analyze assessment" });
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
