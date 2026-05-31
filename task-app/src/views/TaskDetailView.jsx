import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { getTaskController, editTaskController, removeTaskController } from "../controllers/TaskController";

import AppLayout from "../components/layout/AppLayout";
import Alert from "../components/common/Alert";
import LoadingOverlay from "../components/common/LoadingOverlay";
import Spinner from "../components/common/Spinner";
import StatusBadge from "../components/common/StatusBadge";
import ConfirmModal from "../components/common/ConfirmModal";
import ProgressRing from "../components/task/ProgressRing";
import StatusTabGroup from "../components/task/StatusTabGroup";
import DateRange from "../components/task/DateRange";
import SideCard from "../components/task/SideCard";
import InfoRow from "../components/task/InfoRow";
import { safeDateLabel } from "../utils/validation";

/* ── Icon map ─────────────────────────────────────────────────────────────── */
const I = {
  Overview: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" /></svg>,
  Title: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" /></svg>,
  Category: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 7h-9" /><path d="M14 17H5" /><circle cx="17" cy="17" r="3" /><circle cx="7" cy="7" r="3" /></svg>,
  Status: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12" /></svg>,
  Priority: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" /></svg>,
  Progress: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="20" x2="18" y2="10" /><line x1="12" y1="20" x2="12" y2="4" /><line x1="6" y1="20" x2="6" y2="14" /></svg>,
  Timeline: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" /></svg>,
  Desc: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /><line x1="16" y1="13" x2="8" y2="13" /><line x1="16" y1="17" x2="8" y2="17" /></svg>,
  Check: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="9 11 12 14 22 4" /><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" /></svg>,
  Danger: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10" /><line x1="15" y1="9" x2="9" y2="15" /><line x1="9" y1="9" x2="15" y2="15" /></svg>,
  Delete: <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="3 6 5 6 21 6" /><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" /></svg>,
  Created: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></svg>,
};

const CheckboxTick = () => (
  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3">
    <polyline points="20 6 9 17 4 12" />
  </svg>
);

/* ── Checklist display ─────────────────────────────────────────────────────── */
function ChecklistDisplay({ items }) {
  if (!items || items.length === 0) return null;
  const done = items.filter((c) => c.done).length;
  return (
    <div className="card detail-checklist-card">
      <div className="info-card-title">
        <span className="info-card-title-icon">{I.Check}</span>
        Checklist ({done}/{items.length})
      </div>
      <div className="checklist">
        {items.map((item) => (
          <div key={item.id} className={`checklist-item ${item.done ? "done" : ""}`}>
            <div className={`checklist-box ${item.done ? "checked" : ""}`}>
              {item.done && <CheckboxTick />}
            </div>
            {item.text}
          </div>
        ))}
      </div>
    </div>
  );
}

/* ── Page header badges ────────────────────────────────────────────────────── */
function TaskHeaderTags({ category, priority }) {
  return (
    <div className="task-header-tags">
      {category.map((c) => (
        <span key={c} className="badge badge-inprogress">{c}</span>
      ))}
      {priority && (
        <span className={`badge badge-priority-${priority}`}>
          {priority.charAt(0).toUpperCase() + priority.slice(1)} Priority
        </span>
      )}
    </div>
  );
}

/* ── Main view ─────────────────────────────────────────────────────────────── */
export default function TaskDetailView() {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [task, setTask] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const [delModal, setDelModal] = useState(false);
  const [delLoading, setDelLoading] = useState(false);
  const [activeStatus, setActiveStatus] = useState("inprogress");
  const [progress, setProgress] = useState(0);
  const [isDirty, setIsDirty] = useState(false);

  useEffect(() => {
    if (!user?.userId || !id) return;
    setLoading(true);
    getTaskController(user.userId, id)
      .then((t) => { setTask(t); setActiveStatus(t.status); setProgress(t.progress || 0); })
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, [user, id]);

  const handleSave = async () => {
    setSaving(true);
    setError("");
    try {
      const updated = await editTaskController(user.userId, id, { status: activeStatus, progress });
      setTask((prev) => ({ ...prev, ...updated }));
      setIsDirty(false);
    } catch (e) { setError(e.message); }
    finally { setSaving(false); }
  };

  const handleStatusChange = (s) => { setActiveStatus(s); setIsDirty(true); };
  const handleProgressChange = (v) => { setProgress(v); setIsDirty(true); };

  const handleDelete = async () => {
    setDelLoading(true);
    try {
      await removeTaskController(user.userId, id);
      navigate("/dashboard");
    } catch (e) {
      setError(e.message);
      setDelLoading(false);
      setDelModal(false);
    }
  };

  const fmtDate = (d) => safeDateLabel(d, "-");

  if (loading) return <LoadingOverlay text="Loading task…" />;

  if (!task) return (
    <AppLayout>
      <Alert type="error">
        Task not found.{" "}
        <button className="auth-switch-btn" onClick={() => navigate("/dashboard")}>Go back</button>
      </Alert>
    </AppLayout>
  );

  const category = Array.isArray(task.category)
    ? task.category
    : [task.category].filter(Boolean);

  return (
    <AppLayout>
      {/* Header */}
      <div className="page-header">
        <div>
          <p className="page-eyebrow">Task #{id.slice(-4).toUpperCase()}</p>
          <h1 className="page-title">{task.title}</h1>
          <TaskHeaderTags category={category} priority={task.priority} />
        </div>
        <div className="detail-header-actions">
          <StatusTabGroup value={activeStatus} onChange={handleStatusChange} />
          {isDirty && (
            <button className="btn btn-primary btn-save-changes" onClick={handleSave} disabled={saving}>
              {saving ? <><Spinner size="sm" white /> Saving…</> : "Save Changes"}
            </button>
          )}
        </div>
      </div>

      {error && <Alert type="error" onClose={() => setError("")}>{error}</Alert>}

      <div className="detail-grid">

        {/* LEFT */}
        <div>
          {/* Hero image */}
          <div className="task-hero">
            {task.imageUrl
              ? <img src={task.imageUrl} alt={task.title} className="task-hero-image" />
              : (
                <div className="task-hero-placeholder">
                  <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="rgba(133,14,53,0.18)" strokeWidth="0.8">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                    <polyline points="14 2 14 8 20 8" />
                  </svg>
                  <span className="hero-no-image-text">No image attached</span>
                </div>
              )
            }
            <div className="task-hero-overlay" />
            <div className="task-hero-footer">
              <span className="task-hero-category">{category[0] || "Task"}</span>
            </div>
          </div>

          {/* Overview */}
          <div className="card info-card">
            <div className="info-card-title">
              <span className="info-card-title-icon">{I.Overview}</span>
              Task Overview
            </div>
            <InfoRow icon={I.Title} label="Title">    {task.title}</InfoRow>
            <InfoRow icon={I.Category} label="Category">
              <span className="text-accent">{category.join(" / ") || "—"}</span>
            </InfoRow>
            <InfoRow icon={I.Status} label="Current Status">
              <StatusBadge status={activeStatus} />
            </InfoRow>
            <InfoRow icon={I.Priority} label="Priority">
              <span className="task-priority-text">{task.priority || "—"}</span>
            </InfoRow>
          </div>

          {/* Description */}
          {task.description && (
            <div className="card desc-card">
              <div className="info-card-title">
                <span className="info-card-title-icon">{I.Desc}</span>
                Description
              </div>
              <p className="desc-text">{task.description}</p>
            </div>
          )}

          <ChecklistDisplay items={task.checklist} />
        </div>

        {/* RIGHT */}
        <div className="detail-sidebar">
          <SideCard title="Progress" icon={I.Progress}>
            <ProgressRing value={progress} onChange={handleProgressChange} />
          </SideCard>

          <SideCard title="Timeline" icon={I.Timeline}>
            <DateRange startDate={task.startDate} endDate={task.endDate} />
          </SideCard>

          <SideCard title="Created" icon={I.Created}>
            <p className="detail-created-label">Created at</p>
            <p className="detail-created-value">{fmtDate(task.createdAt)}</p>
          </SideCard>

          <SideCard title="Danger Zone" icon={I.Danger} className="danger-zone-card">
            <button className="btn btn-danger btn-full-width" onClick={() => setDelModal(true)}>
              {I.Delete} Delete Task
            </button>
          </SideCard>
        </div>
      </div>

      <ConfirmModal
        isOpen={delModal}
        title="Delete Task"
        message={`Are you sure you want to delete "${task.title}"? This action cannot be undone.`}
        onConfirm={handleDelete}
        onCancel={() => setDelModal(false)}
        loading={delLoading}
      />
    </AppLayout>
  );
}
