import { useState } from 'react';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import TaskCard from '../components/TaskCard';
import { TASKS } from '../data/tasks';

export default function Dashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [statusFilter, setStatusFilter] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');

  const filtered = TASKS.filter(t => {
    const statusMatch = !statusFilter || t.status === statusFilter;
    const categoryMatch = !categoryFilter || t.category === categoryFilter;
    return statusMatch && categoryMatch;
  });

  const total = TASKS.length;
  const inProgress = TASKS.filter(t => t.status === 'inprogress').length;
  const waiting = TASKS.filter(t => t.status === 'waiting').length;
  const canceled = TASKS.filter(t => t.status === 'canceled').length;

  return (
    <>
      <div className="bg-texture" />

      <Navbar
        variant="dashboard"
        onToggleSidebar={() => setSidebarOpen(o => !o)}
      />

      <Sidebar
        variant="dashboard"
        isOpen={sidebarOpen}
        onFilterStatus={(s) => { setStatusFilter(s); setSidebarOpen(false); }}
      />

      <main className="main-wrap">
        <div className="page-header">
          <div>
            <div className="page-eyebrow">Overview</div>
            <h1 className="page-title">My Dashboard</h1>
          </div>
        </div>

        {/* Stats */}
        <div className="stats-row">
          <div className="stat-card rose">
            <div className="stat-icon">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="9 11 12 14 22 4" />
                <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
              </svg>
            </div>
            <div className="stat-value">{total}</div>
            <div className="stat-label">Total Tasks</div>
          </div>

          <div className="stat-card blush">
            <div className="stat-icon">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
              </svg>
            </div>
            <div className="stat-value">{inProgress}</div>
            <div className="stat-label">In Progress</div>
          </div>

          <div className="stat-card amber">
            <div className="stat-icon">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10" />
                <polyline points="12 6 12 12 16 14" />
              </svg>
            </div>
            <div className="stat-value">{waiting}</div>
            <div className="stat-label">Waiting</div>
          </div>

          <div className="stat-card crimson">
            <div className="stat-icon">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10" />
                <line x1="15" y1="9" x2="9" y2="15" />
                <line x1="9" y1="9" x2="15" y2="15" />
              </svg>
            </div>
            <div className="stat-value">{canceled}</div>
            <div className="stat-label">Canceled</div>
          </div>
        </div>

        {/* Filter bar */}
        <div className="filter-bar">
          <span className="filter-label">Filter:</span>
          <select
            className="filter-select"
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value)}
          >
            <option value="">All Statuses</option>
            <option value="waiting">Waiting</option>
            <option value="inprogress">In Progress</option>
            <option value="complete">Complete</option>
            <option value="canceled">Canceled</option>
          </select>

          <select
            className="filter-select"
            value={categoryFilter}
            onChange={e => setCategoryFilter(e.target.value)}
          >
            <option value="">All Categories</option>
            <option>Design</option>
            <option>Development</option>
            <option>Security</option>
            <option>Research</option>
          </select>

          <a href="/new-task" className="btn-add-task">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <line x1="12" y1="5" x2="12" y2="19" />
              <line x1="5" y1="12" x2="19" y2="12" />
            </svg>
            Add Task
          </a>
        </div>

        {/* Tasks grid */}
        <div className="tasks-grid" id="tasksGrid">
          {filtered.length > 0
            ? filtered.map(task => <TaskCard key={task.id} task={task} />)
            : (
              <div style={{ gridColumn: '1/-1', textAlign: 'center', padding: '60px 20px', color: 'var(--text-muted)' }}>
                No tasks match the selected filters.
              </div>
            )
          }
        </div>
      </main>
    </>
  );
}