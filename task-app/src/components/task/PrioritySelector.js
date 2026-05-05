// src/components/task/PrioritySelector.js
import React from "react";

const PRIORITIES = [
  { key: "low",    label: "Low",    activeClass: "active-low" },
  { key: "medium", label: "Medium", activeClass: "active-medium" },
  { key: "high",   label: "High",   activeClass: "active-high" },
];

export default function PrioritySelector({ value, onChange }) {
  return (
    <div className="priority-row">
      {PRIORITIES.map(({ key, label, activeClass }) => (
        <button
          key={key}
          type="button"
          className={`priority-btn ${value === key ? activeClass : ""}`}
          onClick={() => onChange(key)}
        >
          {label}
        </button>
      ))}
    </div>
  );
}
