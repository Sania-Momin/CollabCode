import express from "express";
import dotenv from "dotenv";
import { GoogleGenerativeAI } from "@google/generative-ai";

dotenv.config();
const router = express.Router();

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

if (!GEMINI_API_KEY) {
  console.error("❌ GEMINI_API_KEY is missing. Check your .env file!");
}

const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-2.5-pro" });


router.post("/chat", async (req, res) => {
  try {
    const { message, history } = req.body;

    if (!message || message.trim() === "") {
      return res.status(400).json({ error: "Message is required" });
    }

    // Optional: Combine message history for conversational context
    const conversationContext = history
      ? history.map((msg) => `${msg.role.toUpperCase()}: ${msg.content}`).join("\n")
      : "";

    const prompt = `
You are an expert programming assistant.
You help explain code, debug, and provide best practices.

Previous conversation:
${conversationContext}

User: ${message}
`;

    // Generate AI response
    const result = await model.generateContent(prompt);
    const aiResponse = result.response.text();

    res.json({ response: aiResponse });
  } catch (error) {
    console.error("AI API Error:", error.response?.data || error.message);

    if (error.response?.status === 429) {
      return res.status(429).json({
        error: "Too many requests. Please wait a moment and try again.",
      });
    }

    if (error.response?.status === 401 || error.response?.status === 403) {
      return res.status(500).json({
        error: "AI service configuration error. Please check your API key.",
      });
    }

    res.status(500).json({
      error: "Failed to get AI response. Please try again later.",
    });
  }
});

export default router;
