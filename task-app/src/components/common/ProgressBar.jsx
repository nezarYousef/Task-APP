import React from "react";

function getFillClass(status) {
  if (status === "complete") return "fill-green";
  if (status === "canceled") return "fill-rose";
  if (status === "inprogress") return "fill-crimson";
  return "fill-amber";
}

export default function ProgressBar({ value, status }) {
  return (
    <div className="progress-bar-wrap">
      <div
        className={`progress-bar-fill ${getFillClass(status)}`}
        style={{ width: `${value ?? 0}%` }}
      />
    </div>
  );
}
