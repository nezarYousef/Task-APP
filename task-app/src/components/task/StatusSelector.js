// src/components/task/StatusSelector.js
import React from "react";

const STATUSES = [
  { key: "waiting",    label: "Waiting",     activeClass: "active-waiting" },
  { key: "inprogress", label: "In Progress", activeClass: "active-inprogress" },
  { key: "complete",   label: "Complete",    activeClass: "active-complete" },
  { key: "canceled",   label: "Canceled",    activeClass: "active-canceled" },
];

export default function StatusSelector({ value, onChange }) {
  return (
    <div className="status-options-grid">
      {STATUSES.map(({ key, label, dotColor, activeClass }) => (
        <button
          key={key}
          type="button"
          className={`status-option-btn ${value === key ? activeClass : ""}`}
          onClick={() => onChange(key)}
        >
          <span className={`status-dot status-dot-${key}`} />
          {label}
        </button>
      ))}
    </div>
  );
}
