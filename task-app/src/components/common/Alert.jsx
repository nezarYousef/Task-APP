import React from "react";

export default function Alert({ type = "error", children, onClose }) {
  if (!children) return null;
  return (
    <div className={`alert alert-${type}`}>
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="alert-icon">
        <circle cx="12" cy="12" r="10" />
        <line x1="12" y1="8" x2="12" y2="12" />
        <line x1="12" y1="16" x2="12.01" y2="16" />
      </svg>
      <span className="alert-message">{children}</span>
      {onClose && (
        <button className="alert-close-btn" onClick={onClose} aria-label="Close">×</button>
      )}
    </div>
  );
}
