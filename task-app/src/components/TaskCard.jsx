import { useNavigate } from 'react-router-dom';

const placeholderIcons = {
  Design: (
    <svg width="50" height="50" viewBox="0 0 24 24" fill="none" stroke="rgba(133,14,53,0.2)" strokeWidth="1">
      <circle cx="12" cy="12" r="10" />
      <path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
    </svg>
  ),
  Development: (
    <svg width="50" height="50" viewBox="0 0 24 24" fill="none" stroke="rgba(133,14,53,0.2)" strokeWidth="1">
      <rect x="2" y="3" width="20" height="14" rx="2" />
      <line x1="8" y1="21" x2="16" y2="21" />
      <line x1="12" y1="17" x2="12" y2="21" />
    </svg>
  ),
  Security: (
    <svg width="50" height="50" viewBox="0 0 24 24" fill="none" stroke="rgba(133,14,53,0.2)" strokeWidth="1">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    </svg>
  ),
  Research: (
    <svg width="50" height="50" viewBox="0 0 24 24" fill="none" stroke="rgba(133,14,53,0.2)" strokeWidth="1">
      <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
      <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
    </svg>
  ),
};

const placeholderClass = {
  Design: 'placeholder-design',
  Development: 'placeholder-dev',
  Security: 'placeholder-security',
  Research: 'placeholder-research',
};

const fillClass = {
  waiting: 'fill-amber',
  inprogress: 'fill-crimson',
  complete: 'fill-green',
  canceled: 'fill-rose',
};

export default function TaskCard({ task }) {
  const navigate = useNavigate();
  const { id, title, category, startDate, endDate, progress, status } = task;

  return (
    <div className="task-card" data-status={status}>
      <div className="task-img-wrap">
        <div className={`task-img ${placeholderClass[category] || 'placeholder-design'}`}>
          {placeholderIcons[category]}
        </div>
        <div className="task-img-overlay" />
        <span className="task-category-badge">{category}</span>
      </div>

      <div className="task-body">
        <h3 className="task-title">{title}</h3>

        <div className="task-date">
          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="3" y="4" width="18" height="18" rx="2" />
            <line x1="16" y1="2" x2="16" y2="6" />
            <line x1="8" y1="2" x2="8" y2="6" />
            <line x1="3" y1="10" x2="21" y2="10" />
          </svg>
          {startDate} <span className="task-date-sep">→</span> {endDate}
        </div>

        <div className="task-progress">
          <div className="task-progress-header">
            <span>Progress</span>
            <span>{progress}%</span>
          </div>
          <div className="progress-bar-wrap">
            <div
              className={`progress-bar-fill ${fillClass[status] || 'fill-amber'}`}
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        <div className="task-footer">
          <span className={`status-badge status-${status}`}>
            {status === 'inprogress' ? 'In Progress'
              : status === 'complete' ? 'Complete'
              : status === 'canceled' ? 'Canceled'
              : 'Waiting'}
          </span>
          <button
            className="task-action-btn"
            onClick={() => navigate(`/task/${id}`)}
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