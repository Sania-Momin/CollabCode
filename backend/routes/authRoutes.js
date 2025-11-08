// =================== authRoute.js ===================
import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";


const router = express.Router();

// ======================= SIGNUP =======================
router.post("/signup", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name?.trim() || !email?.trim() || !password?.trim()) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const trimmedName = name.trim();
    const trimmedEmail = email.trim().toLowerCase();
    const trimmedPassword = password.trim();

    if (trimmedPassword.length < 6) {
      return res.status(400).json({ message: "Password must be at least 6 characters long" });
    }

    const existingUser = await User.findOne({ email: trimmedEmail });
    if (existingUser) {
      return res.status(400).json({ message: "Email already exists" });
    }

   const user = await User.create({
  name: trimmedName,
  email: trimmedEmail,
  password: trimmedPassword, // plain password — will be hashed by the model
});


    console.log("✅ User created:", user.email);

    res.status(201).json({
      message: "Signup successful! Please login.",
      user: { id: user._id, name: user.name, email: user.email },
    });
  } catch (err) {
    console.error("❌ Signup error:", err);
    if (err.code === 11000) {
      return res.status(400).json({ message: "Email already exists" });
    }
    res.status(500).json({ message: "Server error during signup" });
  }
});

// ======================= LOGIN =======================
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email?.trim() || !password?.trim()) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    const trimmedEmail = email.trim().toLowerCase();
    const trimmedPassword = password.trim();

    const user = await User.findOne({ email: trimmedEmail });
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(trimmedPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET || "fallback_secret",
      { expiresIn: "2h" }
    );

    res.json({
      message: "Login successful",
      token,
      user: { id: user._id, name: user.name, email: user.email },
    });
  } catch (err) {
    console.error("❌ Login error:", err);
    res.status(500).json({ message: "Server error during login" });
  }
});


export default router;
