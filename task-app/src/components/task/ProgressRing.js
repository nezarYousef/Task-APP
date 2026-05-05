// src/components/task/ProgressRing.js
import React from "react";

const RADIUS      = 46;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

export default function ProgressRing({ value, onChange }) {
  const offset = CIRCUMFERENCE - (value / 100) * CIRCUMFERENCE;

  return (
    <div className="progress-ring-wrap">
      <div className="progress-ring-container">
        <svg
          className="progress-ring-svg"
          width="110"
          height="110"
          viewBox="0 0 110 110"
        >
          <defs>
            <linearGradient id="roseGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%"   stopColor="#EE6983" />
              <stop offset="100%" stopColor="#FFC4C4" />
            </linearGradient>
          </defs>

          {/* Track */}
          <circle
            cx="55" cy="55" r={RADIUS}
            fill="none"
            stroke="rgba(238,105,131,0.12)"
            strokeWidth="7"
          />

          {/* Fill */}
          <circle
            cx="55" cy="55" r={RADIUS}
            fill="none"
            stroke="url(#roseGradient)"
            strokeWidth="7"
            strokeLinecap="round"
            strokeDasharray={CIRCUMFERENCE}
            strokeDashoffset={offset}
            className="progress-ring-fill-circle"
          />
        </svg>

        <div className="progress-ring-center">
          <span className="progress-pct">{value}%</span>
          <span className="progress-lbl">Done</span>
        </div>
      </div>

      {onChange && (
        <input
          type="range"
          min="0"
          max="100"
          value={value}
          className="progress-slider"
          onChange={(e) => onChange(Number(e.target.value))}
        />
      )}
    </div>
  );
}
