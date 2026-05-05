// src/components/task/StatCard.js
import React from "react";

export default function StatCard({ label, value, color, icon }) {
  return (
    <div className="card stat-card">
      <div
        className="stat-card-accent"
        style={{ background: `linear-gradient(90deg, transparent, ${color}, transparent)` }}
      />
      <div
        className="stat-card-icon"
        style={{ background: `${color}20`, color }}
      >
        {icon}
      </div>
      <div className="stat-value">{value}</div>
      <div className="stat-label">{label}</div>
    </div>
  );
}
