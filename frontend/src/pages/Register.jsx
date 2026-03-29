import React, { useState } from "react";
import API from "../api/api";
import { useNavigate } from "react-router-dom";
import { GoogleLogin } from "@react-oauth/google";
import "../styles/register.css";

const Register = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", password: "", confirm: "" });
  const [loading, setLoading] = useState(false);
  const [strength, setStrength] = useState(0);
  const [showPass, setShowPass] = useState(false);
  const [errors, setErrors] = useState({});

  const calcStrength = (val) => {
    let score = 0;
    if (val.length >= 8) score++;
    if (/[A-Z]/.test(val)) score++;
    if (/[0-9]/.test(val)) score++;
    if (/[^A-Za-z0-9]/.test(val)) score++;
    setStrength(score);
  };

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = "Name is required";
    if (!/\S+@\S+\.\S+/.test(form.email)) e.email = "Valid email required";
    if (form.password.length < 6) e.password = "Min 6 characters";
    if (form.password !== form.confirm) e.confirm = "Passwords don't match";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    try {
      const res = await API.post("/api/register", {
        name: form.name,
        email: form.email,
        password: form.password,
      });
      localStorage.setItem("token", res.data.access_token);
      localStorage.setItem("name", res.data.name);
      navigate("/dashboard");
    } catch (err) {
      alert(err?.response?.data?.message || "Registration failed. Try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      const res = await API.post("/api/google-login", {
        token: credentialResponse.credential,
      });
      localStorage.setItem("token", res.data.access_token);
      localStorage.setItem("name", res.data.name);
      localStorage.setItem("email", res.data.email);
      navigate("/dashboard");
    } catch {
      alert("Google sign-up failed. Please try again.");
    }
  };

  const strengthLabel = ["", "Weak", "Fair", "Good", "Strong"];
  const strengthClass = ["", "weak", "fair", "good", "strong"];

  return (
    <div className="register-container">
      {/* Animated background blobs */}
      <div className="blob blob-1" />
      <div className="blob blob-2" />
      <div className="blob blob-3" />

      <div className="register-card">
        {/* Left panel */}
        <div className="register-left">
          <div className="brand-block">
            <div className="brand-icon">
              <svg viewBox="0 0 40 40" fill="none">
                <circle cx="20" cy="20" r="18" stroke="currentColor" strokeWidth="2" />
                <path d="M12 20 Q20 8 28 20 Q20 32 12 20Z" fill="currentColor" opacity="0.9" />
                <circle cx="20" cy="20" r="3" fill="white" />
              </svg>
            </div>
            <h1 className="brand-name">GraphRecAI</h1>
          </div>
          <p className="brand-tagline">Intelligent graph-based recommendations at scale.</p>
          <ul className="feature-list">
            <li><span className="feature-dot" />AI-powered insights</li>
            <li><span className="feature-dot" />Real-time graph analysis</li>
            <li><span className="feature-dot" />Secure & private</li>
          </ul>
          <div className="left-decoration">
            <div className="deco-ring ring-1" />
            <div className="deco-ring ring-2" />
          </div>
        </div>

        {/* Right panel — form */}
        <div className="register-right">
          <div className="form-header">
            <h2>Create Account</h2>
            <p>Join GraphRecAI today</p>
          </div>

          <form onSubmit={handleRegister} noValidate>
            {/* Name */}
            <div className={`field-group ${errors.name ? "has-error" : ""}`}>
              <label>Full Name</label>
              <div className="input-wrap">
                <span className="input-icon">
                  <svg viewBox="0 0 20 20" fill="currentColor">
                    <path d="M10 10a4 4 0 100-8 4 4 0 000 8zm-7 8a7 7 0 1114 0H3z" />
                  </svg>
                </span>
                <input
                  type="text"
                  placeholder="John Doe"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                />
              </div>
              {errors.name && <span className="error-msg">{errors.name}</span>}
            </div>

            {/* Email */}
            <div className={`field-group ${errors.email ? "has-error" : ""}`}>
              <label>Email Address</label>
              <div className="input-wrap">
                <span className="input-icon">
                  <svg viewBox="0 0 20 20" fill="currentColor">
                    <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                    <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                  </svg>
                </span>
                <input
                  type="email"
                  placeholder="you@example.com"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                />
              </div>
              {errors.email && <span className="error-msg">{errors.email}</span>}
            </div>

            {/* Password */}
            <div className={`field-group ${errors.password ? "has-error" : ""}`}>
              <label>Password</label>
              <div className="input-wrap">
                <span className="input-icon">
                  <svg viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                  </svg>
                </span>
                <input
                  type={showPass ? "text" : "password"}
                  placeholder="Min 6 characters"
                  value={form.password}
                  onChange={(e) => {
                    setForm({ ...form, password: e.target.value });
                    calcStrength(e.target.value);
                  }}
                />
                <button type="button" className="toggle-pass" onClick={() => setShowPass(!showPass)}>
                  {showPass ? (
                    <svg viewBox="0 0 20 20" fill="currentColor">
                      <path d="M3.707 2.293a1 1 0 00-1.414 1.414l14 14a1 1 0 001.414-1.414l-1.473-1.473A10.014 10.014 0 0019.542 10C18.268 5.943 14.478 3 10 3a9.958 9.958 0 00-4.512 1.074l-1.78-1.781zm4.261 4.26l1.514 1.515a2.003 2.003 0 012.45 2.45l1.514 1.514a4 4 0 00-5.478-5.478z" />
                      <path d="M12.454 16.697L9.75 13.992a4 4 0 01-3.742-3.741L2.335 6.578A9.98 9.98 0 00.458 10c1.274 4.057 5.065 7 9.542 7 .847 0 1.669-.105 2.454-.303z" />
                    </svg>
                  ) : (
                    <svg viewBox="0 0 20 20" fill="currentColor">
                      <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                      <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                    </svg>
                  )}
                </button>
              </div>
              {form.password && (
                <div className="strength-bar">
                  <div className={`strength-fill ${strengthClass[strength]}`} style={{ width: `${strength * 25}%` }} />
                </div>
              )}
              {form.password && <span className={`strength-label ${strengthClass[strength]}`}>{strengthLabel[strength]}</span>}
              {errors.password && <span className="error-msg">{errors.password}</span>}
            </div>

            {/* Confirm Password */}
            <div className={`field-group ${errors.confirm ? "has-error" : ""}`}>
              <label>Confirm Password</label>
              <div className="input-wrap">
                <span className="input-icon">
                  <svg viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                </span>
                <input
                  type={showPass ? "text" : "password"}
                  placeholder="Re-enter password"
                  value={form.confirm}
                  onChange={(e) => setForm({ ...form, confirm: e.target.value })}
                />
                {form.confirm && form.confirm === form.password && (
                  <span className="match-icon">✓</span>
                )}
              </div>
              {errors.confirm && <span className="error-msg">{errors.confirm}</span>}
            </div>

            <button type="submit" className={`register-btn ${loading ? "loading" : ""}`} disabled={loading}>
              {loading ? <span className="spinner" /> : "Create Account"}
            </button>
          </form>

          <div className="divider"><span>or continue with</span></div>

          <div className="google-wrapper">
            <GoogleLogin
              onSuccess={handleGoogleSuccess}
              onError={() => alert("Google sign-up failed.")}
              theme="filled_black"
              shape="pill"
              size="large"
              text="signup_with"
            />
          </div>

          <p className="login-link">
            Already have an account?{" "}
            <button type="button" onClick={() => navigate("/login")}>Sign in</button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
