import React from "react";
import { NavLink, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const STATUS_FILTERS = [
  { key: "inprogress", label: "In Progress", dotClass: "status-dot status-dot-inprogress" },
  { key: "waiting", label: "Waiting", dotClass: "status-dot status-dot-waiting" },
  { key: "complete", label: "Complete", dotClass: "status-dot status-dot-complete" },
  { key: "canceled", label: "Canceled", dotClass: "status-dot status-dot-canceled" },
];

const ArchiveIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <polyline points="21 8 21 21 3 21 3 8" />
    <rect x="1" y="3" width="22" height="5" />
    <line x1="10" y1="12" x2="14" y2="12" />
  </svg>
);

export default function Sidebar({ isOpen, taskCount, onFilterStatus }) {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const isNewTask = location.pathname === "/new-task";
  const handleLogout = () => { logout(); navigate("/login"); };

  return (
    <aside className={`sidebar ${isOpen ? "open" : ""}`}>

      {/* Main nav */}
      <div className="sidebar-section">
        <div className="sidebar-label">Main</div>

        <NavLink to="/dashboard" className={({ isActive }) => `sidebar-link ${isActive ? "active" : ""}`}>
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="3" y="3" width="7" height="7" />
            <rect x="14" y="3" width="7" height="7" />
            <rect x="3" y="14" width="7" height="7" />
            <rect x="14" y="14" width="7" height="7" />
          </svg>
          Dashboard
          {taskCount > 0 && !isNewTask && <span className="sidebar-badge">{taskCount}</span>}
        </NavLink>

        <NavLink to="/new-task" className={({ isActive }) => `sidebar-link ${isActive ? "active" : ""}`}>
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="8" x2="12" y2="16" />
            <line x1="8" y1="12" x2="16" y2="12" />
          </svg>
          Add New Task
        </NavLink>

        <NavLink to="/archive" className={({ isActive }) => `sidebar-link ${isActive ? "active" : ""}`}>
          <ArchiveIcon />
          Archive
        </NavLink>
      </div>

      {/* Status filters — hidden on new-task page */}
      {!isNewTask && (
        <div className="sidebar-section">
          <div className="sidebar-label">Status</div>
          {STATUS_FILTERS.map(({ key, label, dotClass }) => (
            <button
              key={key}
              className="sidebar-link"
              onClick={() => onFilterStatus(key)}
            >
              <span className={dotClass} />
              {label}
            </button>
          ))}
        </div>
      )}

      {/* Workspace */}
      <div className="sidebar-section">
        <div className="sidebar-label">Workspace</div>
        <button className="sidebar-link">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
            <circle cx="9" cy="7" r="4" />
            <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
            <path d="M16 3.13a4 4 0 0 1 0 7.75" />
          </svg>
          Team
        </button>
        <button className="sidebar-link" onClick={handleLogout}>
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
            <polyline points="16 17 21 12 16 7" />
            <line x1="21" y1="12" x2="9" y2="12" />
          </svg>
          Sign Out
        </button>
      </div>
    </aside>
  );
}
