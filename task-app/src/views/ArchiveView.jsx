import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
  getTasksController,
  unarchiveTaskController,
  removeTaskController,
} from "../controllers/TaskController";
import AppLayout from "../components/layout/AppLayout";
import TaskGrid from "../components/task/TaskGrid";
import Alert from "../components/common/Alert";
import LoadingInline from "../components/common/LoadingInline";
import ConfirmModal from "../components/common/ConfirmModal";

export default function ArchiveView() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [delTarget, setDelTarget] = useState(null);
  const [delLoading, setDelLoading] = useState(false);

  const load = useCallback(async () => {
    if (!user?.userId) return;
    setLoading(true);
    setError("");
    try {
      // archived: true — يجيب المأرشف فقط
      const result = await getTasksController(user.userId, { archived: true });
      setTasks(result);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => { load(); }, [load]);

  // Unarchive — يرجعها للـ Dashboard
  const handleUnarchive = async (taskId) => {
    try {
      await unarchiveTaskController(user.userId, taskId);
      setTasks((prev) => prev.filter((t) => t.id !== taskId));
    } catch (err) {
      setError(err.message);
    }
  };

  // Delete permanently
  const handleDeleteConfirm = async () => {
    if (!delTarget) return;
    setDelLoading(true);
    try {
      await removeTaskController(user.userId, delTarget.id);
      setTasks((prev) => prev.filter((t) => t.id !== delTarget.id));
    } catch (err) {
      setError(err.message);
    } finally {
      setDelLoading(false);
      setDelTarget(null);
    }
  };

  return (
    <AppLayout>
      <div className="page-header">
        <div>
          <p className="page-eyebrow">Archive</p>
          <h1 className="page-title">Archived Tasks</h1>
          <p className="page-subtitle">
            {loading ? "Loading…" : `${tasks.length} archived task${tasks.length !== 1 ? "s" : ""}`}
          </p>
        </div>
        <button className="btn btn-secondary" onClick={() => navigate("/dashboard")}>
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="19" y1="12" x2="5" y2="12" />
            <polyline points="12 19 5 12 12 5" />
          </svg>
          Back to Dashboard
        </button>
      </div>

      {error && <Alert type="error" onClose={() => setError("")}>{error}</Alert>}

      {loading ? (
        <LoadingInline text="Loading archive…" />
      ) : (
        <TaskGrid
          tasks={tasks}
          onDelete={setDelTarget}
          onStatusChange={() => { }}
          onArchive={handleUnarchive}
          archiveMode
          emptyIcon="🗃️"
          emptyTitle="No archived tasks"
          emptyMessage="Tasks you archive will appear here."
        />
      )}

      <ConfirmModal
        isOpen={!!delTarget}
        title="Delete Permanently"
        message={`Are you sure you want to permanently delete "${delTarget?.title}"? This cannot be undone.`}
        onConfirm={handleDeleteConfirm}
        onCancel={() => setDelTarget(null)}
        loading={delLoading}
      />
    </AppLayout>
  );
}
