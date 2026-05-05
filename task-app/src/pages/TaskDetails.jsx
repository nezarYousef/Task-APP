import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import { TASKS } from '../data/tasks';

const STATUS_MAP = {
  'active-waiting': 'Waiting',
  'active-inprogress': 'In Progress',
  'active-complete': 'Complete',
  'active-canceled': 'Canceled',
};

const COLOR_MAP = {
  'active-waiting': '#c06020',
  'active-inprogress': 'var(--crimson)',
  'active-complete': '#2d7a3a',
  'active-canceled': 'var(--rose)',
};

const statusToTabClass = {
  waiting: 'active-waiting',
  inprogress: 'active-inprogress',
  complete: 'active-complete',
  canceled: 'active-canceled',
};

export default function TaskDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const task = TASKS.find(t => t.id === Number(id)) || TASKS[1];

  const [activeTab, setActiveTab] = useState(statusToTabClass[task.status] || 'active-inprogress');
  const [progress, setProgress] = useState(task.progress);

  const circumference = 2 * Math.PI * 46;
  const offset = circumference - (progress / 100) * circumference;

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      navigate('/dashboard');
    }
  };

  return (
    <>
      <div className="bg-texture" />
      <Navbar variant="details" />
      <Sidebar variant="details" />

      <main className="main-wrap">
        <div className="page-header">
          <div className="page-meta">
            <div className="page-eyebrow">Task #{String(task.id).padStart(4, '0')}</div>
            <h1 className="page-title">{task.title}</h1>
            <div className="page-tags">
              {task.tags.map((tag, i) => (
                <span key={i} className={`tag-pill${i === 0 ? ' rose' : ''}`}>{tag}</span>
              ))}
            </div>
          </div>
          <div className="page-actions">
            <div className="status-tab-group">
              {[
                { cls: 'active-waiting', label: 'Waiting' },
                { cls: 'active-inprogress', label: 'In Progress' },
                { cls: 'active-complete', label: 'Complete' },
                { cls: 'active-canceled', label: 'Canceled' },
              ].map(({ cls, label }) => (
                <button
                  key={cls}
                  className={`status-tab${activeTab === cls ? ` ${cls}` : ''}`}
                  onClick={() => setActiveTab(cls)}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="content-grid">
          {/* Left */}
          <div>
            <div className="task-hero">
              <div className="task-hero-placeholder">
                <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="rgba(133,14,53,0.18)" strokeWidth="0.8">
                  <rect x="2" y="3" width="20" height="14" rx="2" />
                  <line x1="8" y1="21" x2="16" y2="21" />
                  <line x1="12" y1="17" x2="12" y2="21" />
                </svg>
                <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>Task Image</span>
              </div>
              <div className="task-hero-overlay" />
              <div className="task-hero-label">
                <span className="hero-category">{task.category}</span>
              </div>
            </div>

            <div className="info-card">
              <div className="info-section-title">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10" />
                  <line x1="12" y1="8" x2="12" y2="12" />
                  <line x1="12" y1="16" x2="12.01" y2="16" />
                </svg>
                Task Overview
              </div>

              <div className="info-row">
                <div className="info-icon">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                  </svg>
                </div>
                <div>
                  <div className="info-label">Title</div>
                  <div className="info-value">{task.title}</div>
                </div>
              </div>

              <div className="info-row">
                <div className="info-icon">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M20 7h-9" /><path d="M14 17H5" />
                    <circle cx="17" cy="17" r="3" /><circle cx="7" cy="7" r="3" />
                  </svg>
                </div>
                <div>
                  <div className="info-label">Category</div>
                  <div className="info-value accent">{task.tags.join(' / ')}</div>
                </div>
              </div>

              <div className="info-row">
                <div className="info-icon">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
                  </svg>
                </div>
                <div>
                  <div className="info-label">Current Status</div>
                  <div className="info-value" style={{ color: COLOR_MAP[activeTab], fontWeight: 500 }}>
                    {STATUS_MAP[activeTab]}
                  </div>
                </div>
              </div>

              <div className="info-row">
                <div className="info-icon">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                    <circle cx="9" cy="7" r="4" />
                  </svg>
                </div>
                <div>
                  <div className="info-label">Assigned To</div>
                  <div className="info-value">{task.assignee}</div>
                </div>
              </div>
            </div>

            <div className="desc-card">
              <div className="info-section-title">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                  <polyline points="14 2 14 8 20 8" />
                  <line x1="16" y1="13" x2="8" y2="13" />
                  <line x1="16" y1="17" x2="8" y2="17" />
                </svg>
                Description
              </div>
              <p className="desc-text">{task.description}</p>
            </div>
          </div>

          {/* Right sidebar */}
          <div className="detail-sidebar">
            <div className="side-card">
              <div className="side-title">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="18" y1="20" x2="18" y2="10" />
                  <line x1="12" y1="20" x2="12" y2="4" />
                  <line x1="6" y1="20" x2="6" y2="14" />
                </svg>
                Progress
              </div>
              <div className="progress-section">
                <div className="progress-ring-wrap">
                  <svg className="progress-ring" width="110" height="110" viewBox="0 0 110 110">
                    <defs>
                      <linearGradient id="roseGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" style={{ stopColor: '#EE6983' }} />
                        <stop offset="100%" style={{ stopColor: '#FFC4C4' }} />
                      </linearGradient>
                    </defs>
                    <circle className="progress-ring-bg" cx="55" cy="55" r="46" />
                    <circle
                      className="progress-ring-fill"
                      cx="55" cy="55" r="46"
                      strokeDasharray={circumference}
                      strokeDashoffset={offset}
                    />
                  </svg>
                  <div className="progress-center">
                    <span className="progress-pct">{progress}%</span>
                    <span className="progress-lbl">Done</span>
                  </div>
                </div>
              </div>
              <input
                type="range"
                min="0" max="100"
                value={progress}
                style={{ width: '100%', marginTop: 8 }}
                onChange={e => setProgress(Number(e.target.value))}
              />
            </div>

            <div className="side-card">
              <div className="side-title">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="3" y="4" width="18" height="18" rx="2" />
                  <line x1="16" y1="2" x2="16" y2="6" />
                  <line x1="8" y1="2" x2="8" y2="6" />
                  <line x1="3" y1="10" x2="21" y2="10" />
                </svg>
                Timeline
              </div>
              <div className="date-range">
                <div className="date-box">
                  <div className="date-box-label">Start</div>
                  <div className="date-box-val">{task.startDate.slice(0, 5)}</div>
                </div>
                <svg className="date-arrow" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="5" y1="12" x2="19" y2="12" />
                  <polyline points="12 5 19 12 12 19" />
                </svg>
                <div className="date-box">
                  <div className="date-box-label">End</div>
                  <div className="date-box-val">{task.endDate.slice(0, 5)}</div>
                </div>
              </div>
            </div>

            <div className="side-card">
              <div className="side-title">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
                </svg>
                Activity
              </div>
              <div className="activity-list">
                <div className="activity-item">
                  <div className="activity-dot a-crimson">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  </div>
                  <div>
                    <div className="activity-text">
                      Status changed to <strong style={{ color: 'var(--crimson)' }}>In Progress</strong>
                    </div>
                    <div className="activity-time">Today, 10:30 AM</div>
                  </div>
                </div>
                <div className="activity-item">
                  <div className="activity-dot a-rose">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M12 20h9" />
                      <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
                    </svg>
                  </div>
                  <div>
                    <div className="activity-text">Task description updated</div>
                    <div className="activity-time">Yesterday, 3:14 PM</div>
                  </div>
                </div>
                <div className="activity-item">
                  <div className="activity-dot a-amber">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <circle cx="12" cy="12" r="10" />
                      <line x1="12" y1="8" x2="12" y2="16" />
                      <line x1="8" y1="12" x2="16" y2="12" />
                    </svg>
                  </div>
                  <div>
                    <div className="activity-text">Task created by {task.assignee}</div>
                    <div className="activity-time">{task.startDate.slice(0, 5)}, 9:00 AM</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="side-card">
              <div className="side-title" style={{ color: 'var(--rose)' }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10" />
                  <line x1="15" y1="9" x2="9" y2="15" />
                  <line x1="9" y1="9" x2="15" y2="15" />
                </svg>
                Danger Zone
              </div>
              <button className="btn-danger" onClick={handleDelete}>
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polyline points="3 6 5 6 21 6" />
                  <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
                </svg>
                Delete Task
              </button>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}