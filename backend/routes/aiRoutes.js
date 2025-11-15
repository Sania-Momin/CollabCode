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
const model = genAI.getGenerativeModel({
  model: "models/gemini-2.5-pro"
});



router.post("/chat", async (req, res) => {
  console.log("🤖 AI Chat request received"); // Log when request comes in
  
  try {
    const { message, history } = req.body;
    
    if (!message || message.trim() === "") {
      return res.status(400).json({ error: "Message is required" });
    }

    // Build conversation context from history
    const conversationContext = history
      ? history.map((msg) => `${msg.role.toUpperCase()}: ${msg.content}`).join("\n")
      : "";

    const prompt = `
You are an expert programming assistant specialized in helping developers.
You provide clear, accurate, and helpful responses about code, debugging, and best practices.

Previous conversation:
${conversationContext}

User: ${message}

Please provide a helpful and detailed response.
`;

    console.log("📤 Sending request to Gemini 2.5 Pro..."); // Log before API call
    
    const result = await model.generateContent(prompt);
    const aiResponse = result.response.text();
    
    console.log("✅ Response received from Gemini"); // Log success
    
    res.json({ response: aiResponse });
    
  } catch (error) {
    console.error("❌ AI API Error:", error.message);
    console.error("Error details:", error.response?.data || error);
    
    // Handle specific error cases
    if (error.message?.includes("API key")) {
      return res.status(500).json({
        error: "Invalid API key. Please check your GEMINI_API_KEY in .env file.",
      });
    }
    
    if (error.status === 429 || error.message?.includes("quota")) {
      return res.status(429).json({
        error: "API quota exceeded. Please try again later.",
      });
    }

    if (error.status === 503 || error.message?.includes("overloaded")) {
      return res.status(503).json({
        error: "AI service is temporarily overloaded. Please try again.",
      });
    }
    
    res.status(500).json({
      error: "Failed to get AI response: " + error.message,
    });
  }
});

export default router;
