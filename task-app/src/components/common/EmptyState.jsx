import React from "react";

export default function EmptyState({ icon = "📋", title, message, action }) {
  return (
    <div className="empty-state fade-up">
      <div className="empty-state-icon">{icon}</div>
      <h3 className="empty-state-title">{title}</h3>
      <p className="empty-state-message">{message}</p>
      {action}
    </div>
  );
}
