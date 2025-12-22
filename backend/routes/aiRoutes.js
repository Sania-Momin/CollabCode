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

// Model priority list (from fastest/cheapest to most capable)
const MODELS = [
  "models/gemini-2.5-flash",
  "models/gemini-2.0-flash",
  "models/gemini-flash-latest",
  "models/gemini-2.5-flash-lite"
];

// Helper function to try multiple models with fallback
async function generateWithFallback(prompt, modelIndex = 0) {
  if (modelIndex >= MODELS.length) {
    throw new Error('All models failed. Please try again later.');
  }

  const currentModel = MODELS[modelIndex];
  console.log(`🤖 Trying model: ${currentModel}`);

  try {
    const model = genAI.getGenerativeModel({ model: currentModel });
    const result = await model.generateContent(prompt);
    const response = result.response.text();
    
    console.log(`✅ Success with ${currentModel}`);
    return response;
    
  } catch (error) {
    console.error(`❌ ${currentModel} failed:`, error.message);
    
    // If overloaded (503) or quota exceeded (429), try next model
    if (error.status === 503 || error.status === 429 || 
        error.message?.includes('overloaded') || 
        error.message?.includes('quota')) {
      console.log(`⚠️  Trying fallback model...`);
      return await generateWithFallback(prompt, modelIndex + 1);
    }
    
    // For other errors, throw immediately
    throw error;
  }
}

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
    console.log("📤 Sending request to Gemini..."); // Log before API call
    
    const aiResponse = await generateWithFallback(prompt);
    
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
    
    if (error.message?.includes('All models failed')) {
      return res.status(503).json({
        error: "All AI services are currently unavailable. Please try again in a few minutes.",
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
