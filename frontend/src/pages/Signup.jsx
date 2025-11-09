import { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import './Signup.css';

export default function Signup() {
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      // ✅ FIXED: Use environment variable for backend URL
      const backendUrl = import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";
      
      const res = await axios.post(`${backendUrl}/api/auth/signup`, {
        name: form.name.trim(),
        email: form.email.trim(),
        password: form.password.trim(),
      });
      
      alert("Signup successful! Please login.");
      navigate("/login");
    } catch (err) {
      console.error("Signup error:", err);
      alert(err.response?.data?.message || "Signup failed");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="signup-container">
      <form onSubmit={handleSignup} className="signup-form">
        <h2 className="text-3xl font-bold mb-6 text-center">Sign Up</h2>
        
        <input
          type="text"
          name="name"
          placeholder="Name"
          value={form.name}
          onChange={handleChange}
          required
          autoComplete="name"
        />
        
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
          required
          autoComplete="email"
        />
        
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={form.password}
          onChange={handleChange}
          required
          minLength={6}
          autoComplete="new-password"
        />
        
        <button 
          type="submit" 
          disabled={loading}
          className="w-full bg-purple-600 py-2 rounded hover:bg-purple-500 disabled:opacity-50"
        >
          {loading ? "Signing Up..." : "Sign Up"}
        </button>
        
        <p className="mt-4 text-sm text-center">
          Already have an account?{" "}
          <Link to="/login" className="text-purple-400 hover:underline">Login</Link>
        </p>
      </form>
    </div>
  );
}
