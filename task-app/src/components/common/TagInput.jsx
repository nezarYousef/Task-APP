import React, { useState } from "react";

export default function TagInput({ tags, onChange, placeholder = "Add tag, press Enter…" }) {
  const [input, setInput] = useState("");

  const addTag = (val) => {
    const v = val.trim().replace(",", "");
    if (v && !tags.includes(v)) onChange([...tags, v]);
    setInput("");
  };

  const removeTag = (tag) => onChange(tags.filter((t) => t !== tag));

  const handleKeyDown = (e) => {
    if (e.key === "Enter" || e.key === ",") { e.preventDefault(); addTag(input); }
    if (e.key === "Backspace" && !input && tags.length) onChange(tags.slice(0, -1));
  };

  return (
    <div className="tags-container">
      {tags.map((tag) => (
        <span key={tag} className="tag">
          {tag}
          <button type="button" className="tag-remove" onClick={() => removeTag(tag)}>×</button>
        </span>
      ))}
      <input
        className="tags-input"
        value={input}
        placeholder={tags.length === 0 ? placeholder : ""}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={handleKeyDown}
        onBlur={() => input && addTag(input)}
      />
    </div>
  );
}
