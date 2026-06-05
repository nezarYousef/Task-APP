import { FIREBASE_DB_URL } from "../firebase/config";

const DB = FIREBASE_DB_URL;
const headers = () => ({ "Content-Type": "application/json" });

function authToken() {
  const token = localStorage.getItem("authToken") || sessionStorage.getItem("authToken");
  if (!token) throw new Error("Please sign in again to continue.");
  return encodeURIComponent(token);
}

function userPath(userId) {
  return encodeURIComponent(userId);
}

function taskPath(taskId) {
  return encodeURIComponent(taskId);
}

async function readJson(res) {
  try {
    return await res.json();
  } catch {
    return null;
  }
}

function requestError(data, fallback) {
  if (data?.error === "Permission denied") return "You do not have permission to perform this action.";
  return data?.error || fallback;
}

// Firebase turns arrays into {"0":"x","1":"y"} — normalize back to arrays
function normalizeToArray(value) {
  if (!value) return [];
  if (Array.isArray(value)) return value;
  if (typeof value === "object") {
    return Object.keys(value)
      .sort((a, b) => Number(a) - Number(b))
      .map((k) => value[k]);
  }
  return [value];
}

function normalizeTask(task) {
  return {
    ...task,
    category: normalizeToArray(task.category),
    checklist: normalizeToArray(task.checklist),
    archived: task.archived === true, // ensure boolean
  };
}

function normalizeTaskUpdate(update) {
  const normalized = { ...update };
  if (Object.prototype.hasOwnProperty.call(normalized, "category")) {
    normalized.category = normalizeToArray(normalized.category);
  }
  if (Object.prototype.hasOwnProperty.call(normalized, "checklist")) {
    normalized.checklist = normalizeToArray(normalized.checklist);
  }
  if (Object.prototype.hasOwnProperty.call(normalized, "archived")) {
    normalized.archived = normalized.archived === true;
  }
  return normalized;
}

export async function createTask(userId, taskData) {
  const token = authToken();
  const payload = {
    ...taskData,
    userId,
    archived: false,
    createdAt: new Date().toISOString(),
    progress: taskData.progress ?? 0,
  };
  const res = await fetch(`${DB}/users/${userPath(userId)}/tasks.json?auth=${token}`, {
    method: "POST", headers: headers(), body: JSON.stringify(payload),
  });
  const data = await readJson(res);
  if (!res.ok) throw new Error(requestError(data, "Failed to create task"));
  return { id: data.name, ...payload };
}

export async function fetchTasks(userId) {
  const token = authToken();
  const res = await fetch(`${DB}/users/${userPath(userId)}/tasks.json?auth=${token}`, { headers: headers() });
  const data = await readJson(res);
  if (!res.ok) throw new Error(requestError(data, "Failed to fetch tasks"));
  if (!data) return [];
  return Object.entries(data).map(([id, task]) => ({ id, ...normalizeTask(task) }));
}

export async function fetchTask(userId, taskId) {
  const token = authToken();
  const res = await fetch(`${DB}/users/${userPath(userId)}/tasks/${taskPath(taskId)}.json?auth=${token}`, { headers: headers() });
  const data = await readJson(res);
  if (!res.ok) throw new Error(requestError(data, "Task not found"));
  if (!data) throw new Error("Task not found");
  return { id: taskId, ...normalizeTask(data) };
}

export async function updateTask(userId, taskId, updates) {
  const token = authToken();
  const res = await fetch(`${DB}/users/${userPath(userId)}/tasks/${taskPath(taskId)}.json?auth=${token}`, {
    method: "PATCH", headers: headers(), body: JSON.stringify(updates),
  });
  const data = await readJson(res);
  if (!res.ok) throw new Error(requestError(data, "Failed to update task"));
  return { id: taskId, ...normalizeTaskUpdate(data || {}) };
}

export async function deleteTask(userId, taskId) {
  const token = authToken();
  const res = await fetch(`${DB}/users/${userPath(userId)}/tasks/${taskPath(taskId)}.json?auth=${token}`, {
    method: "DELETE", headers: headers(),
  });
  if (!res.ok) { const data = await readJson(res); throw new Error(requestError(data, "Failed to delete task")); }
  return true;
}

// Archive / Unarchive
export async function archiveTask(userId, taskId, archived = true) {
  const token = authToken();
  const res = await fetch(`${DB}/users/${userPath(userId)}/tasks/${taskPath(taskId)}.json?auth=${token}`, {
    method: "PATCH", headers: headers(), body: JSON.stringify({ archived }),
  });
  const data = await readJson(res);
  if (!res.ok) throw new Error(requestError(data, "Failed to archive task"));
  return { id: taskId, ...normalizeTaskUpdate(data || {}) };
}

export function createDefaultTask() {
  return {
    title: "", description: "", category: [],
    status: "waiting", priority: "low",
    startDate: "", endDate: "", progress: 0, imageUrl: null, archived: false,
    checklist: [
      { id: "c1", text: "Define task requirements", done: false },
      { id: "c2", text: "Set clear deadline", done: false },
      { id: "c3", text: "Attach relevant image", done: false },
      { id: "c4", text: "Add category tags", done: false },
    ],
  };
}
