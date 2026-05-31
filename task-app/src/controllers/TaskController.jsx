
import {
  createTask, fetchTasks, fetchTask,
  updateTask, deleteTask, createDefaultTask, archiveTask,
} from "../models/TaskModel";
import {
  clampProgress,
  normalizePriority,
  normalizeStatus,
  requireTaskId,
  requireUserId,
  sanitizeChecklist,
  sanitizeTags,
  sanitizeText,
  validateDateRange,
  validatePriority,
  validateStatus,
} from "../utils/validation";

// ── Fetch with filters ─────────────────────────────────────────────────────
export async function getTasksController(userId, filters = {}) {
  requireUserId(userId);
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
  requireUserId(userId);
  requireTaskId(taskId);
  return fetchTask(userId, taskId);
}

export async function addTaskController(userId, formData) {
  requireUserId(userId);
  const { title, description, category, status, priority, startDate, endDate, imageUrl, checklist } = formData;
  const dates = validateDateRange(startDate, endDate);
  return createTask(userId, {
    title: sanitizeText(title, { required: true, max: 120, fieldName: "Task name" }),
    description: sanitizeText(description, { max: 2000, fieldName: "Task description" }),
    category: sanitizeTags(category),
    status: normalizeStatus(status),
    priority: normalizePriority(priority),
    startDate: dates.startDate,
    endDate: dates.endDate,
    progress: 0,
    imageUrl: imageUrl || null,
    checklist: sanitizeChecklist(checklist || createDefaultTask().checklist),
  });
}

export async function editTaskController(userId, taskId, updates) {
  requireUserId(userId);
  requireTaskId(taskId);
  const safeUpdates = {};

  if (updates.title !== undefined) {
    safeUpdates.title = sanitizeText(updates.title, { required: true, max: 120, fieldName: "Task name" });
  }
  if (updates.description !== undefined) {
    safeUpdates.description = sanitizeText(updates.description, { max: 2000, fieldName: "Task description" });
  }
  if (updates.category !== undefined) safeUpdates.category = sanitizeTags(updates.category);
  if (updates.status !== undefined) safeUpdates.status = validateStatus(updates.status);
  if (updates.priority !== undefined) safeUpdates.priority = validatePriority(updates.priority);
  if (updates.progress !== undefined) safeUpdates.progress = clampProgress(updates.progress);
  if (updates.startDate !== undefined || updates.endDate !== undefined) {
    const dates = validateDateRange(updates.startDate, updates.endDate);
    safeUpdates.startDate = dates.startDate;
    safeUpdates.endDate = dates.endDate;
  }
  if (updates.imageUrl !== undefined) safeUpdates.imageUrl = updates.imageUrl || null;
  if (updates.checklist !== undefined) safeUpdates.checklist = sanitizeChecklist(updates.checklist);

  return updateTask(userId, taskId, safeUpdates);
}

export async function updateProgressController(userId, taskId, progress) {
  requireUserId(userId);
  requireTaskId(taskId);
  const p = clampProgress(progress);
  const updates = p === 100 ? { progress: p, status: "complete" } : { progress: p };
  return updateTask(userId, taskId, updates);
}

export async function updateStatusController(userId, taskId, status) {
  requireUserId(userId);
  requireTaskId(taskId);
  return updateTask(userId, taskId, { status: validateStatus(status) });
}

export async function removeTaskController(userId, taskId) {
  requireUserId(userId);
  requireTaskId(taskId);
  return deleteTask(userId, taskId);
}

export async function archiveTaskController(userId, taskId) {
  requireUserId(userId);
  requireTaskId(taskId);
  return archiveTask(userId, taskId, true);
}

export async function unarchiveTaskController(userId, taskId) {
  requireUserId(userId);
  requireTaskId(taskId);
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
