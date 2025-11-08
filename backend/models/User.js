// =================== models/User.js ===================
import mongoose from "mongoose";
import bcrypt from "bcryptjs";


const userSchema = new mongoose.Schema(
  {
    name: { 
      type: String, 
      required: true, 
      trim: true 
    },
    email: { 
      type: String, 
      required: true, 
      unique: true, 
      trim: true, 
      lowercase: true 
    },
    password: { 
      type: String, 
      required: true, 
      minlength: 6 
    },
  },
  {
    timestamps: true,
  }
);

// Hash password before saving
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  try {
    const saltRounds = 12;
    this.password = await bcrypt.hash(this.password.trim(), saltRounds);
    console.log("✅ Password hashed for:", this.email);
    next();
  } catch (error) {
    console.error("❌ Error hashing password:", error);
    next(error);
  }
});

// Compare password method
userSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

export default mongoose.model("User", userSchema);
