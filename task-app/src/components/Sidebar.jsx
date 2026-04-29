import { Link, useNavigate } from 'react-router-dom';

export default function Sidebar({ isOpen, onFilterStatus, variant = 'dashboard' }) {
  const navigate = useNavigate();

  const handleFilterStatus = (status, e) => {
    e.preventDefault();
    // Remove active from all sidebar links
    document.querySelectorAll('.sidebar-link').forEach(l => l.classList.remove('active'));
    e.currentTarget.classList.add('active');
    if (onFilterStatus) onFilterStatus(status);
  };

  return (
    <aside className={`sidebar${isOpen ? ' open' : ''}`} id="sidebar">
      <div className="sidebar-section">
        <div className="sidebar-label">Main</div>

        <Link
          to="/dashboard"
          className={`sidebar-link${variant === 'dashboard' ? ' active' : ''}`}
        >
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="3" y="3" width="7" height="7" />
            <rect x="14" y="3" width="7" height="7" />
            <rect x="3" y="14" width="7" height="7" />
            <rect x="14" y="14" width="7" height="7" />
          </svg>
          Dashboard
          {variant === 'dashboard' && <span className="sidebar-badge">9</span>}
        </Link>

        <Link
          to="/new-task"
          className={`sidebar-link${variant === 'newtask' ? ' active' : ''}`}
        >
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="8" x2="12" y2="16" />
            <line x1="8" y1="12" x2="16" y2="12" />
          </svg>
          Add New Task
        </Link>

        {variant === 'details' && (
          <a href="#" className="sidebar-link active">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
              <polyline points="14 2 14 8 20 8" />
            </svg>
            Task Details
          </a>
        )}

        {variant === 'dashboard' && (
          <a href="#" className="sidebar-link">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
            </svg>
            Activity
          </a>
        )}
      </div>

      {variant === 'dashboard' && (
        <div className="sidebar-section">
          <div className="sidebar-label">Status</div>
          <a href="#" className="sidebar-link" onClick={(e) => handleFilterStatus('inprogress', e)}>
            <span className="status-dot" style={{ background: 'var(--crimson)' }} /> In Progress
          </a>
          <a href="#" className="sidebar-link" onClick={(e) => handleFilterStatus('waiting', e)}>
            <span className="status-dot" style={{ background: '#e8a070' }} /> Waiting
          </a>
          <a href="#" className="sidebar-link" onClick={(e) => handleFilterStatus('complete', e)}>
            <span className="status-dot" style={{ background: '#50b464' }} /> Complete
          </a>
          <a href="#" className="sidebar-link" onClick={(e) => handleFilterStatus('canceled', e)}>
            <span className="status-dot" style={{ background: 'var(--rose)' }} /> Canceled
          </a>
        </div>
      )}

      {variant === 'details' && (
        <div className="sidebar-section">
          <div className="sidebar-label">Actions</div>
          <a href="#" className="sidebar-link">
            <span style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--crimson)', display: 'inline-block', flexShrink: 0 }} />
            Mark In Progress
          </a>
          <a href="#" className="sidebar-link">
            <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#50b464', display: 'inline-block', flexShrink: 0 }} />
            Mark Complete
          </a>
        </div>
      )}

      <div className="sidebar-section">
        {variant !== 'newtask' && (
          <>
            {variant === 'dashboard' && (
              <>
                <div className="sidebar-label">Workspace</div>
                <a href="#" className="sidebar-link">
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                    <circle cx="9" cy="7" r="4" />
                    <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                  </svg>
                  Team
                </a>
                <a href="#" className="sidebar-link">
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <line x1="18" y1="20" x2="18" y2="10" />
                    <line x1="12" y1="20" x2="12" y2="4" />
                    <line x1="6" y1="20" x2="6" y2="14" />
                  </svg>
                  Reports
                </a>
              </>
            )}
            <Link to="/login" className="sidebar-link">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                <polyline points="16 17 21 12 16 7" />
                <line x1="21" y1="12" x2="9" y2="12" />
              </svg>
              Sign Out
            </Link>
          </>
        )}
      </div>
    </aside>
  );
}