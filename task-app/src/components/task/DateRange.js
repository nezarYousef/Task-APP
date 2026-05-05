// src/components/task/DateRange.js
import React from "react";

function fmt(d) {
  if (!d) return "—";
  return new Date(d).toLocaleDateString("en-GB", {
    day: "2-digit", month: "short", year: "numeric",
  });
}

function daysLeft(endDate) {
  if (!endDate) return null;
  return Math.ceil((new Date(endDate) - new Date()) / (1000 * 60 * 60 * 24));
}

export default function DateRange({ startDate, endDate }) {
  const days = daysLeft(endDate);

  return (
    <>
      <div className="date-range">
        <div className="date-box">
          <div className="date-box-label">Start</div>
          <div className="date-box-val">{fmt(startDate)}</div>
        </div>

        <svg className="date-range-arrow" width="18" height="18" viewBox="0 0 24 24"
          fill="none" stroke="currentColor" strokeWidth="2">
          <line x1="5" y1="12" x2="19" y2="12" />
          <polyline points="12 5 19 12 12 19" />
        </svg>

        <div className="date-box">
          <div className="date-box-label">End</div>
          <div className="date-box-val">{fmt(endDate)}</div>
        </div>
      </div>

      {days !== null && (
        <p className="days-remaining">
          <span className={`days-highlight ${days < 0 ? "days-overdue" : days < 3 ? "days-warning" : "days-ok"}`}>
            {days < 0
              ? `${Math.abs(days)} days overdue`
              : days === 0
              ? "Due today!"
              : `${days} days remaining`}
          </span>
        </p>
      )}
    </>
  );
}
