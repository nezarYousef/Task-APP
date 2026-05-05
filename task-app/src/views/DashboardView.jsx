import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
  getTasksController,
  removeTaskController,
  updateStatusController,
  archiveTaskController,
  computeStats,
} from "../controllers/TaskController";
import AppLayout from "../components/layout/AppLayout";
import StatCard from "../components/task/StatCard";
import TaskGrid from "../components/task/TaskGrid";
import TaskFilters from "../components/task/TaskFilters";
import Alert from "../components/common/Alert";
import LoadingInline from "../components/common/LoadingInline";
import ConfirmModal from "../components/common/ConfirmModal";

const makeStatCards = (stats) => [
  {
    label: "Total Tasks", value: stats.total, color: "var(--rose)",
    icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="9 11 12 14 22 4" /><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" /></svg>,
  },
  {
    label: "In Progress", value: stats.inprogress, color: "var(--crimson)",
    icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12" /></svg>,
  },
  {
    label: "Waiting", value: stats.waiting, color: "#e8a070",
    icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></svg>,
  },
  {
    label: "Complete", value: stats.complete, color: "#50b464",
    icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10" /><polyline points="9 11 12 14 22 4" /></svg>,
  },
];

export default function DashboardView() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [catFilter, setCatFilter] = useState("all");
  const [delTarget, setDelTarget] = useState(null);
  const [delLoading, setDelLoading] = useState(false);

  const load = useCallback(async () => {
    if (!user?.userId) return;
    setLoading(true);
    setError("");
    try {
      // archived: false — يعرض فقط التاسكات غير المأرشفة
      const result = await getTasksController(user.userId, {
        archived: false,
        status: statusFilter !== "all" ? statusFilter : undefined,
        category: catFilter !== "all" ? catFilter : undefined,
        search: search || undefined,
      });
      setTasks(result);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [user, statusFilter, catFilter, search]);

  useEffect(() => { load(); }, [load]);

  // Delete
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

  // Status change
  const handleStatusChange = async (taskId, status) => {
    try {
      await updateStatusController(user.userId, taskId, status);
      setTasks((prev) => prev.map((t) => t.id === taskId ? { ...t, status } : t));
    } catch (err) {
      setError(err.message);
    }
  };

  // Archive — removes from dashboard immediately
  const handleArchive = async (taskId) => {
    try {
      await archiveTaskController(user.userId, taskId);
      setTasks((prev) => prev.filter((t) => t.id !== taskId));
    } catch (err) {
      setError(err.message);
    }
  };

  const stats = computeStats(tasks);
  const allCats = [...new Set(tasks.flatMap((t) => Array.isArray(t.category) ? t.category : [t.category]).filter(Boolean))];
  const statCards = makeStatCards(stats);

  return (
    <AppLayout
      taskCount={stats.total}
      onSearch={setSearch}
      searchVal={search}
      onFilterStatus={setStatusFilter}
    >
      <div className="page-header">
        <div>
          <p className="page-eyebrow">Overview</p>
          <h1 className="page-title">My Dashboard</h1>
        </div>
        <button className="btn btn-primary" onClick={() => navigate("/new-task")}>
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <line x1="12" y1="5" x2="12" y2="19" />
            <line x1="5" y1="12" x2="19" y2="12" />
          </svg>
          Add Task
        </button>
      </div>

      {error && <Alert type="error" onClose={() => setError("")}>{error}</Alert>}

      <div className="stats-grid">
        {statCards.map((s) => <StatCard key={s.label} {...s} />)}
      </div>

      <TaskFilters
        statusFilter={statusFilter}
        catFilter={catFilter}
        categories={allCats}
        onStatusChange={setStatusFilter}
        onCatChange={setCatFilter}
        onClear={() => { setStatusFilter("all"); setCatFilter("all"); setSearch(""); }}
      />

      {loading
        ? <LoadingInline text="Loading tasks…" />
        : (
          <TaskGrid
            tasks={tasks}
            onDelete={setDelTarget}
            onStatusChange={handleStatusChange}
            onArchive={handleArchive}
          />
        )
      }

      <ConfirmModal
        isOpen={!!delTarget}
        title="Delete Task"
        message={`Are you sure you want to delete "${delTarget?.title}"? This action cannot be undone.`}
        onConfirm={handleDeleteConfirm}
        onCancel={() => setDelTarget(null)}
        loading={delLoading}
      />
    </AppLayout>
  );
}
