import { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import "./Login.css";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      console.log("Attempting login with:", { email: email.trim(), password: "***" });
      
      // ✅ FIXED: Use environment variable for backend URL
      const backendUrl = import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";
      console.log("Backend URL:", backendUrl);
      
      const res = await axios.post(`${backendUrl}/api/auth/login`, {
        email: email.trim(),
        password: password.trim(),
      });

      // store token & user info
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));

      alert("Login successful!");
      navigate("/editor"); // redirect to editor
    } catch (err) {
      console.log("Login error details:", err.response?.data);
      alert(err.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className="login-container">
      <form onSubmit={handleLogin} className="login-form">
        <h2 className="text-3xl font-bold mb-6 text-center">Login</h2>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          autoComplete="email"
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          autoComplete="current-password"
        />
        <button type="submit">Login</button>

        <div className="links">
          <p>
            Don't have an account?{" "}
            <Link to="/signup" className="signup-link">Sign up</Link>
          </p>
        </div>
      </form>
    </div>
  );
}
