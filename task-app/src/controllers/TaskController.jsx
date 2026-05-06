
import {
  createTask, fetchTasks, fetchTask,
  updateTask, deleteTask, createDefaultTask, archiveTask,
} from "../models/TaskModel";

// ── Fetch with filters ─────────────────────────────────────────────────────
export async function getTasksController(userId, filters = {}) {
  let tasks = await fetchTasks(userId);

  // Archive filter: default = show only active (non-archived)
  if (filters.archived === true) {
    tasks = tasks.filter((t) => t.archived === true);
  } else {
    tasks = tasks.filter((t) => t.archived !== true);
  }

  if (filters.status && filters.status !== "all") tasks = tasks.filter((t) => t.status === filters.status);
  if (filters.category && filters.category !== "all") tasks = tasks.filter((t) => Array.isArray(t.category) && t.category.includes(filters.category));
  if (filters.search) {
    const q = filters.search.toLowerCase();
    tasks = tasks.filter((t) => t.title?.toLowerCase().includes(q) || t.description?.toLowerCase().includes(q));
  }

  return tasks.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
}

export async function getTaskController(userId, taskId) {
  return fetchTask(userId, taskId);
}

export async function addTaskController(userId, formData) {
  const { title, description, category, status, priority, startDate, endDate, imageUrl, checklist } = formData;
  if (!title?.trim()) throw new Error("Task name is required.");
  if (!startDate) throw new Error("Start date is required.");
  if (!endDate) throw new Error("End date is required.");
  if (new Date(endDate) < new Date(startDate)) throw new Error("End date must be after start date.");
  return createTask(userId, {
    title: title.trim(), description: description?.trim() || "",
    category: Array.isArray(category) ? category : [],
    status: status || "waiting", priority: priority || "low",
    startDate, endDate, progress: 0,
    imageUrl: imageUrl || null,
    checklist: checklist || createDefaultTask().checklist,
  });
}

export async function editTaskController(userId, taskId, updates) {
  if (updates.title !== undefined && !updates.title?.trim()) throw new Error("Task name cannot be empty.");
  return updateTask(userId, taskId, updates);
}

export async function updateProgressController(userId, taskId, progress) {
  const p = Math.min(100, Math.max(0, Number(progress)));
  const updates = p === 100 ? { progress: p, status: "complete" } : { progress: p };
  return updateTask(userId, taskId, updates);
}

export async function updateStatusController(userId, taskId, status) {
  const allowed = ["waiting", "inprogress", "complete", "canceled"];
  if (!allowed.includes(status)) throw new Error("Invalid status.");
  return updateTask(userId, taskId, { status });
}

export async function removeTaskController(userId, taskId) {
  return deleteTask(userId, taskId);
}

export async function archiveTaskController(userId, taskId) {
  return archiveTask(userId, taskId, true);
}

export async function unarchiveTaskController(userId, taskId) {
  return archiveTask(userId, taskId, false);
}

export function computeStats(tasks) {
  return {
    total: tasks.length,
    inprogress: tasks.filter((t) => t.status === "inprogress").length,
    waiting: tasks.filter((t) => t.status === "waiting").length,
    complete: tasks.filter((t) => t.status === "complete").length,
    canceled: tasks.filter((t) => t.status === "canceled").length,
  };
}
