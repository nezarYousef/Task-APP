import { Link, useNavigate } from 'react-router-dom';

export default function Navbar({ onToggleSidebar, variant = 'dashboard' }) {
  const navigate = useNavigate();

  return (
    <nav className="navbar">
      <Link to="/dashboard" className="nav-brand">
        <div className="nav-logo">MT</div>
        <span className="nav-name">App Task</span>
      </Link>

      {variant === 'dashboard' && (
        <>
          <button className="nav-mobile-toggle" onClick={onToggleSidebar}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="3" y1="12" x2="21" y2="12" />
              <line x1="3" y1="6" x2="21" y2="6" />
              <line x1="3" y1="18" x2="21" y2="18" />
            </svg>
          </button>
          <div className="nav-search-wrap">
            <div className="nav-search">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="11" cy="11" r="8" />
                <path d="M21 21l-4.35-4.35" />
              </svg>
              <input type="text" placeholder="Search tasks, categories…" />
            </div>
          </div>
          <div className="nav-actions">
            <Link to="/new-task" className="nav-btn">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="8" x2="12" y2="16" />
                <line x1="8" y1="12" x2="16" y2="12" />
              </svg>
              New Task
            </Link>
            <div className="nav-avatar">MQ</div>
          </div>
        </>
      )}

      {variant === 'newtask' && (
        <>
          <div className="nav-search-wrap" />
          <div className="nav-actions">
            <Link to="/dashboard" className="nav-link-btn">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="19" y1="12" x2="5" y2="12" />
                <polyline points="12 19 5 12 12 5" />
              </svg>
              Dashboard
            </Link>
            <div className="nav-avatar">MQ</div>
          </div>
        </>
      )}

      {variant === 'details' && (
        <>
          <div className="nav-center">
            <Link to="/dashboard" className="breadcrumb-item">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="3" width="7" height="7" />
                <rect x="14" y="3" width="7" height="7" />
                <rect x="3" y="14" width="7" height="7" />
                <rect x="14" y="14" width="7" height="7" />
              </svg>
              Dashboard
            </Link>
            <span className="breadcrumb-sep">/</span>
            <span className="breadcrumb-current">Task Details</span>
          </div>
          <div className="nav-actions">
            <button className="nav-btn nav-btn-rose" onClick={() => alert('Edit mode — coming soon!')}>
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
              </svg>
              Edit Task
            </button>
            <div className="nav-avatar">MQ</div>
          </div>
        </>
      )}
    </nav>
  );
}