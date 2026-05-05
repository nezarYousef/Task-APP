// src/components/task/StatusTabGroup.js
import React from "react";

const TABS = [
  { key: "waiting",    label: "Waiting" },
  { key: "inprogress", label: "In Progress" },
  { key: "complete",   label: "Complete" },
  { key: "canceled",   label: "Canceled" },
];

export default function StatusTabGroup({ value, onChange }) {
  return (
    <div className="status-tab-group">
      {TABS.map(({ key, label }) => (
        <button
          key={key}
          className={`status-tab ${value === key ? `active-${key}` : ""}`}
          onClick={() => onChange(key)}
        >
          {label}
        </button>
      ))}
    </div>
  );
}
