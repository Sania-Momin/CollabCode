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
      const res = await axios.post("http://localhost:5000/api/auth/signup", {
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
      [e.target.type === "text" ? "name" : 
       e.target.type === "email" ? "email" : "password"]: e.target.value
    });
  };

  return (
    <div className="signup-container">
      <form onSubmit={handleSignup} className="signup-form">
        <h2 className="text-3xl font-bold mb-6 text-center">Sign Up</h2>
        
        <input
          type="text"
          placeholder="Name"
          value={form.name}
          onChange={handleChange}
          required
          className="w-full mb-4 p-3 rounded bg-gray-700 focus:outline-none"
        />
        
        <input
          type="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
          required
          className="w-full mb-4 p-3 rounded bg-gray-700 focus:outline-none"
        />
        
        <input
          type="password"
          placeholder="Password"
          value={form.password}
          onChange={handleChange}
          required
          minLength={6}
          className="w-full mb-4 p-3 rounded bg-gray-700 focus:outline-none"
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