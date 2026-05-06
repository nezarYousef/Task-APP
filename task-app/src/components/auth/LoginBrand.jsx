
import React from "react";

const FEATURES = [
  { icon: "🗂️", text: "Visual task boards with status tracking" },
  { icon: "🔍", text: "Smart categories & filtering" },
  { icon: "👥", text: "Real-time collaboration" },
  { icon: "📅", text: "Date-driven progress tracking" },
];

const STATS = [
  { value: "2.4k+", label: "Active Users" },
  { value: "48k", label: "Tasks Done" },
  { value: "99.9%", label: "Uptime" },
];

export default function LoginBrand() {
  return (
    <div className="login-left">
      <div className="login-logo-wrap">
        <div className="login-logo-icon">MT</div>
        <span className="login-logo-name">App Task</span>
      </div>

      <h1 className="login-headline">
        Manage tasks<br />
        with{" "}
        <span className="login-headline-accent">precision</span>
        <br />
        and clarity.
      </h1>

      <p className="login-desc">
        A modern task management platform built for teams who value
        organization, speed, and beautiful interfaces.
      </p>

      <div className="login-features">
        {FEATURES.map(({ icon, text }) => (
          <div key={text} className="login-feature-item">
            <span className="login-feature-icon">{icon}</span>
            {text}
          </div>
        ))}
      </div>

      <div className="login-stats">
        {STATS.map(({ value, label }) => (
          <div key={label}>
            <div className="login-stat-value">{value}</div>
            <div className="login-stat-label">{label}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
