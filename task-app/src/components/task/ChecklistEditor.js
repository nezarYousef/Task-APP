// src/components/task/ChecklistEditor.js
import React from "react";

const CheckIcon = () => (
  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3">
    <polyline points="20 6 9 17 4 12" />
  </svg>
);

export default function ChecklistEditor({ items, onChange }) {
  const toggle = (id) =>
    onChange(items.map((c) => (c.id === id ? { ...c, done: !c.done } : c)));

  return (
    <div className="checklist">
      {items.map((item) => (
        <div
          key={item.id}
          className={`checklist-item ${item.done ? "done" : ""}`}
          onClick={() => toggle(item.id)}
        >
          <div className={`checklist-box ${item.done ? "checked" : ""}`}>
            {item.done && <CheckIcon />}
          </div>
          <span>{item.text}</span>
        </div>
      ))}
    </div>
  );
}
