
import React from "react";
import { NavLink, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

export default function Navbar({ onMenuToggle, onSearch, searchVal }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const initials = user?.userEmail?.slice(0, 2).toUpperCase() || "MT";

  const isNewTask = location.pathname === "/new-task";
  const handleLogout = () => { logout(); navigate("/login"); };

  return (
    <nav className="navbar">
      <NavLink to="/dashboard" className="nav-brand">
        <div className="nav-logo">MT</div>
        <span className="nav-name">App Task</span>
      </NavLink>

      <button className="btn btn-ghost nav-menu-btn" onClick={onMenuToggle} aria-label="Toggle menu">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <line x1="3" y1="12" x2="21" y2="12" />
          <line x1="3" y1="6" x2="21" y2="6" />
          <line x1="3" y1="18" x2="21" y2="18" />
        </svg>
      </button>

      {/* Search — hidden on new-task page */}
      {!isNewTask && (
        <div className="nav-search-wrap">
          <div className="nav-search">
            <svg className="nav-search-icon" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="8" />
              <path d="M21 21l-4.35-4.35" />
            </svg>
            <input
              className="nav-search-input"
              type="text"
              placeholder="Search tasks, categories…"
              value={searchVal}
              onChange={(e) => onSearch(e.target.value)}
            />
          </div>
        </div>
      )}

      {/* Spacer when search is hidden */}
      {isNewTask && <div className="nav-spacer" />}

      <div className="nav-actions">
        {/* Toggle between "New Task" and "Dashboard" based on current page */}
        {isNewTask ? (
          <NavLink to="/dashboard" className="btn btn-ghost">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="3" y="3" width="7" height="7" />
              <rect x="14" y="3" width="7" height="7" />
              <rect x="3" y="14" width="7" height="7" />
              <rect x="14" y="14" width="7" height="7" />
            </svg>
            Dashboard
          </NavLink>
        ) : (
          <NavLink to="/new-task" className="btn btn-ghost">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="8" x2="12" y2="16" />
              <line x1="8" y1="12" x2="16" y2="12" />
            </svg>
            New Task
          </NavLink>
        )}

        <div className="nav-avatar" tabIndex={0}>
          {initials}
          <div className="nav-dropdown">
            <div className="nav-dropdown-email">{user?.userEmail}</div>
            <button className="nav-dropdown-item danger" onClick={handleLogout}>
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                <polyline points="16 17 21 12 16 7" />
                <line x1="21" y1="12" x2="9" y2="12" />
              </svg>
              Sign Out
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
