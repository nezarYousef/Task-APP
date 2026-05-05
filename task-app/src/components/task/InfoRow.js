// src/components/task/InfoRow.js
import React from "react";

export default function InfoRow({ icon, label, children }) {
  return (
    <div className="info-row">
      <div className="info-row-icon">{icon}</div>
      <div className="info-row-content">
        <div className="info-label">{label}</div>
        <div className="info-row-value">{children}</div>
      </div>
    </div>
  );
}
