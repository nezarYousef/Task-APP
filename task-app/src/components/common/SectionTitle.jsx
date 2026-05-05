import React from "react";

export default function SectionTitle({ icon, children }) {
  return (
    <div className="section-title">
      {icon && <span className="section-title-icon">{icon}</span>}
      {children}
    </div>
  );
}
