import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { loginController, registerController, forgotPasswordController } from "../../controllers/AuthController";
import Alert from "../common/Alert";
import Spinner from "../common/Spinner";
import PasswordInput from "./PasswordInput";
import SocialButtons from "./SocialButtons";

export default function LoginForm() {
  const [mode, setMode] = useState("login"); // "login" | "register" | "forgot"
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [remember, setRemember] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const { login } = useAuth();
  const navigate = useNavigate();

  const reset = () => { setError(""); setSuccess(""); };

  const switchMode = (next) => { setMode(next); reset(); };

  /* ── Submit handlers ── */
  const handleLogin = async (e) => {
    e.preventDefault(); reset(); setLoading(true);
    try {
      const data = await loginController(email, password);
      login(data);
      navigate("/dashboard");
    } catch (err) { setError(err.message); }
    finally { setLoading(false); }
  };

  const handleRegister = async (e) => {
    e.preventDefault(); reset(); setLoading(true);
    try {
      const data = await registerController(email, password, confirm);
      login(data);
      navigate("/dashboard");
    } catch (err) { setError(err.message); }
    finally { setLoading(false); }
  };

  const handleForgot = async (e) => {
    e.preventDefault(); reset(); setLoading(true);
    try {
      await forgotPasswordController(email);
      setSuccess("Password reset email sent! Check your inbox.");
    } catch (err) { setError(err.message); }
    finally { setLoading(false); }
  };

  const handleSubmit = mode === "login" ? handleLogin
    : mode === "register" ? handleRegister
      : handleForgot;

  /* ── Labels ── */
  const eyebrows = { login: "Welcome back", register: "Get started", forgot: "Password reset" };
  const titles = { login: "Sign in to your workspace", register: "Create your account", forgot: "Reset your password" };

  return (
    <div className="login-right">
      <div className="auth-card">

        <p className="auth-eyebrow">{eyebrows[mode]}</p>
        <h2 className="card-title">{titles[mode]}</h2>

        <p className="auth-switch-text">
          {mode === "login" && (
            <>Don't have an account?{" "}
              <button className="auth-switch-btn" onClick={() => switchMode("register")}>Create one free</button>
            </>
          )}
          {mode === "register" && (
            <>Already have an account?{" "}
              <button className="auth-switch-btn" onClick={() => switchMode("login")}>Sign in</button>
            </>
          )}
          {mode === "forgot" && (
            <>Remember it?{" "}
              <button className="auth-switch-btn" onClick={() => switchMode("login")}>Back to login</button>
            </>
          )}
        </p>

        {error && <Alert type="error" onClose={() => setError("")}>{error}</Alert>}
        {success && <Alert type="success" onClose={() => setSuccess("")}>{success}</Alert>}

        <form onSubmit={handleSubmit}>

          {/* Email */}
          <div className="form-group">
            <label className="form-label">Email address</label>
            <div className="input-wrap">
              <svg className="input-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                <polyline points="22,6 12,13 2,6" />
              </svg>
              <input
                className="form-control"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </div>

          {/* Password */}
          {mode !== "forgot" && (
            <div className="form-group">
              <label className="form-label">Password</label>
              <PasswordInput value={password} onChange={setPassword} placeholder="Enter your password" />
            </div>
          )}

          {/* Confirm password */}
          {mode === "register" && (
            <div className="form-group">
              <label className="form-label">Confirm Password</label>
              <PasswordInput value={confirm} onChange={setConfirm} placeholder="Repeat your password" />
            </div>
          )}

          {/* Remember / Forgot */}
          {mode === "login" && (
            <div className="auth-form-options">
              <label className="auth-remember">
                <input
                  type="checkbox"
                  checked={remember}
                  onChange={(e) => setRemember(e.target.checked)}
                />
                Remember me
              </label>
              <button type="button" className="auth-forgot-btn" onClick={() => switchMode("forgot")}>
                Forgot password?
              </button>
            </div>
          )}

          {/* Submit */}
          <button type="submit" className="btn btn-primary btn-full" disabled={loading}>
            {loading
              ? <><Spinner size="sm" white /> Please wait…</>
              : mode === "login" ? "Sign In"
                : mode === "register" ? "Create Account"
                  : "Send Reset Link"
            }
          </button>
        </form>

        {/* Social — only on login/register */}
        {mode !== "forgot" && <SocialButtons />}
      </div>
    </div>
  );
}
