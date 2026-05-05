// src/components/task/TaskCard.js
import React, { useState, useEffect, useRef } from "react";
import StatusBadge from "../common/StatusBadge";
import ProgressBar from "../common/ProgressBar";

const CAT_COLORS = {
  Design:      "task-card-image-design",
  Development: "task-card-image-dev",
  Security:    "task-card-image-security",
  Research:    "task-card-image-research",
};

const STATUS_ACTIONS = [
  { key: "waiting",    label: "Mark Waiting" },
  { key: "inprogress", label: "Mark In Progress" },
  { key: "complete",   label: "Mark Complete" },
  { key: "canceled",   label: "Mark Canceled" },
];

function formatDate(d) {
  if (!d) return "—";
  return new Date(d).toLocaleDateString("en-GB", {
    day: "2-digit", month: "short", year: "numeric",
  });
}

const ArchiveIcon = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <polyline points="21 8 21 21 3 21 3 8" />
    <rect x="1" y="3" width="22" height="5" />
    <line x1="10" y1="12" x2="14" y2="12" />
  </svg>
);

const UnarchiveIcon = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <polyline points="21 8 21 21 3 21 3 8" />
    <rect x="1" y="3" width="22" height="5" />
    <polyline points="10 14 12 12 14 14" />
    <line x1="12" y1="12" x2="12" y2="17" />
  </svg>
);

export default function TaskCard({
  task,
  onView,
  onDelete,
  onStatusChange,
  onArchive,
  archiveMode = false,
}) {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);

  const category   = Array.isArray(task.category) ? task.category[0] : task.category || "Other";
  const imageBgCls = CAT_COLORS[category] || "task-card-image-default";

  // ── Close menu when clicking outside ──────────────────────────────────────
  useEffect(() => {
    if (!menuOpen) return;
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuOpen(false);
      }
    };
    // slight delay so the opening click doesn't immediately close it
    const timer = setTimeout(() => document.addEventListener("click", handleClickOutside), 10);
    return () => {
      clearTimeout(timer);
      document.removeEventListener("click", handleClickOutside);
    };
  }, [menuOpen]);

  return (
    // ── The card itself — position:relative so the dropdown can escape overflow
    <div className="card task-card task-card-anim" onClick={() => onView(task.id)}>

      {/* Image area — overflow visible so dropdown isn't clipped */}
      <div className="task-card-image">
        {/* inner wrapper clips the image zoom without clipping the dropdown */}
        <div className={`task-card-image-inner ${imageBgCls}`}>
          {task.imageUrl
            ? <img src={task.imageUrl} alt={task.title} className="task-card-img" />
            : <TaskPlaceholderIcon category={category} />
          }
          <div className="task-card-image-overlay" />
        </div>
        <span className="task-category-badge">{category}</span>

        {/* ── Options button — positioned relative to the CARD, not the image ── */}
        <div
          ref={menuRef}
          className="task-options-wrap"
          onClick={(e) => e.stopPropagation()}
        >
          <button
            className="task-options-btn"
            onClick={(e) => { e.stopPropagation(); setMenuOpen((o) => !o); }}
            aria-label="Task options"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
              <circle cx="12" cy="5"  r="1.5" />
              <circle cx="12" cy="12" r="1.5" />
              <circle cx="12" cy="19" r="1.5" />
            </svg>
          </button>

          {menuOpen && (
            <div className="task-options-dropdown">

              {/* Status actions — hidden in archive mode */}
              {!archiveMode && (
                <>
                  <p className="task-options-group-label">Change status</p>
                  {STATUS_ACTIONS.map(({ key, label }) => (
                    <button
                      key={key}
                      className="task-options-item"
                      onClick={(e) => {
                        e.stopPropagation();
                        onStatusChange(task.id, key);
                        setMenuOpen(false);
                      }}
                    >
                      {label}
                    </button>
                  ))}
                  <hr className="task-options-separator" />
                </>
              )}

              {/* Archive / Unarchive */}
              {onArchive && (
                <button
                  className="task-options-item task-options-archive"
                  onClick={(e) => {
                    e.stopPropagation();
                    onArchive(task.id);
                    setMenuOpen(false);
                  }}
                >
                  {archiveMode
                    ? <><UnarchiveIcon /> Unarchive task</>
                    : <><ArchiveIcon />   Archive task</>
                  }
                </button>
              )}

              <hr className="task-options-separator" />

              {/* Delete */}
              <button
                className="task-options-item danger"
                onClick={(e) => {
                  e.stopPropagation();
                  setMenuOpen(false);
                  onDelete(task);
                }}
              >
                Delete task
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Body */}
      <div className="task-card-body">
        <h3 className="task-card-title">{task.title}</h3>

        <div className="task-date-row">
          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="3" y="4" width="18" height="18" rx="2" />
            <line x1="16" y1="2" x2="16" y2="6" />
            <line x1="8"  y1="2" x2="8"  y2="6" />
            <line x1="3"  y1="10" x2="21" y2="10" />
          </svg>
          {formatDate(task.startDate)}
          <span className="task-date-sep">→</span>
          {formatDate(task.endDate)}
        </div>

        <div className="task-progress-wrap">
          <div className="task-progress-header">
            <span>Progress</span>
            <span>{task.progress ?? 0}%</span>
          </div>
          <ProgressBar value={task.progress ?? 0} status={task.status} />
        </div>

        <div className="task-card-footer">
          <StatusBadge status={task.status} />
          <button
            className="btn btn-icon"
            onClick={(e) => { e.stopPropagation(); onView(task.id); }}
            aria-label="View task"
          >
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="5" y1="12" x2="19" y2="12" />
              <polyline points="12 5 19 12 12 19" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Placeholder icons per category ─────────────────────────────────────────
function TaskPlaceholderIcon({ category }) {
  const icons = {
    Design: (
      <svg width="52" height="52" viewBox="0 0 24 24" fill="none" stroke="rgba(133,14,53,0.2)" strokeWidth="0.8">
        <circle cx="12" cy="12" r="10" />
        <path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
      </svg>
    ),
    Development: (
      <svg width="52" height="52" viewBox="0 0 24 24" fill="none" stroke="rgba(133,14,53,0.2)" strokeWidth="0.8">
        <rect x="2" y="3" width="20" height="14" rx="2" />
        <line x1="8"  y1="21" x2="16" y2="21" />
        <line x1="12" y1="17" x2="12" y2="21" />
      </svg>
    ),
    Security: (
      <svg width="52" height="52" viewBox="0 0 24 24" fill="none" stroke="rgba(133,14,53,0.2)" strokeWidth="0.8">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      </svg>
    ),
    Research: (
      <svg width="52" height="52" viewBox="0 0 24 24" fill="none" stroke="rgba(133,14,53,0.2)" strokeWidth="0.8">
        <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
        <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
      </svg>
    ),
  };
  return icons[category] || (
    <svg width="52" height="52" viewBox="0 0 24 24" fill="none" stroke="rgba(133,14,53,0.2)" strokeWidth="0.8">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <polyline points="14 2 14 8 20 8" />
    </svg>
  );
}
