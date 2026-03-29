import React, { useState } from "react";
import API from "../api/api";
import { useNavigate } from "react-router-dom";
import { GoogleLogin } from "@react-oauth/google";
import "../styles/login.css";

const Login = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await API.post("/api/login", form);
      localStorage.setItem("token", res.data.access_token);
      localStorage.setItem("name", res.data.name);
      navigate("/dashboard");
    } catch {
      alert("Invalid credentials");
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
      alert("Google login failed. Please try again.");
    }
  };

  return (
    <div className="login-container">

      {/* Animated background blobs */}
      <div className="login-blob blob-1" />
      <div className="login-blob blob-2" />
      <div className="login-blob blob-3" />

      {/* Floating grid dots */}
      <div className="login-grid" />

      <div className="login-card">

        {/* Brand */}
        <div className="login-brand">
          <div className="login-brand-icon">
            <svg viewBox="0 0 40 40" fill="none">
              <circle cx="20" cy="20" r="18" stroke="currentColor" strokeWidth="2" />
              <path d="M12 20 Q20 8 28 20 Q20 32 12 20Z" fill="currentColor" opacity="0.9" />
              <circle cx="20" cy="20" r="3" fill="white" />
            </svg>
          </div>
          <h1 className="login-logo">GraphRecAI</h1>
        </div>

        <div className="login-header">
          <h2>Welcome back</h2>
          <p>Sign in to your account</p>
        </div>

        <form onSubmit={handleLogin} noValidate className="login-form">

          {/* Email */}
          <div className="login-field">
            <label>Email Address</label>
            <div className="login-input-wrap">
              <span className="login-input-icon">
                <svg viewBox="0 0 20 20" fill="currentColor">
                  <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                  <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                </svg>
              </span>
              <input
                type="email"
                placeholder="you@example.com"
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                required
              />
            </div>
          </div>

          {/* Password */}
          <div className="login-field">
            <div className="login-label-row">
              <label>Password</label>
              <button type="button" className="forgot-btn">Forgot password?</button>
            </div>
            <div className="login-input-wrap">
              <span className="login-input-icon">
                <svg viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                </svg>
              </span>
              <input
                type={showPass ? "text" : "password"}
                placeholder="Enter your password"
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                required
              />
              <button
                type="button"
                className="login-toggle-pass"
                onClick={() => setShowPass(!showPass)}
              >
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
          </div>

          {/* Login button */}
          <button
            type="submit"
            className={`login-submit-btn ${loading ? "loading" : ""}`}
            disabled={loading}
          >
            {loading ? <span className="login-spinner" /> : "Sign In"}
          </button>
        </form>

        {/* Divider */}
        <div className="login-divider"><span>or continue with</span></div>

        {/* Google */}
        <div className="login-google-wrapper">
          <GoogleLogin
            onSuccess={handleGoogleSuccess}
            onError={() => alert("Google login failed. Please try again.")}
            theme="filled_black"
            shape="pill"
            size="large"
          />
        </div>

        {/* Register link */}
        <p className="login-register-link">
          Don't have an account?{" "}
          <button type="button" onClick={() => navigate("/register")}>
            Create one
          </button>
        </p>
      </div>
    </div>
  );
};

export default Login;
