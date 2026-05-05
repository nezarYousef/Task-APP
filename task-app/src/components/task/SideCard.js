// src/components/task/SideCard.js
import React from "react";

export default function SideCard({ title, icon, children, className = "" }) {
  return (
    <div className={`card detail-side-card ${className}`}>
      <div className="detail-side-title">
        {icon && <span className="detail-side-title-icon">{icon}</span>}
        {title}
      </div>
      {children}
    </div>
  );
}
