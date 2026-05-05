import { FIREBASE_DB_URL } from "../firebase/config";

const DB = FIREBASE_DB_URL;
const getToken = () => localStorage.getItem("authToken");
const headers = () => ({ "Content-Type": "application/json" });

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

export async function createTask(userId, taskData) {
  const token = getToken();
  const payload = {
    ...taskData,
    userId,
    archived: false,
    createdAt: new Date().toISOString(),
    progress: taskData.progress ?? 0,
  };
  const res = await fetch(`${DB}/users/${userId}/tasks.json?auth=${token}`, {
    method: "POST", headers: headers(), body: JSON.stringify(payload),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Failed to create task");
  return { id: data.name, ...payload };
}

export async function fetchTasks(userId) {
  const token = getToken();
  const res = await fetch(`${DB}/users/${userId}/tasks.json?auth=${token}`, { headers: headers() });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Failed to fetch tasks");
  if (!data) return [];
  return Object.entries(data).map(([id, task]) => ({ id, ...normalizeTask(task) }));
}

export async function fetchTask(userId, taskId) {
  const token = getToken();
  const res = await fetch(`${DB}/users/${userId}/tasks/${taskId}.json?auth=${token}`, { headers: headers() });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Task not found");
  if (!data) throw new Error("Task not found");
  return { id: taskId, ...normalizeTask(data) };
}

export async function updateTask(userId, taskId, updates) {
  const token = getToken();
  const res = await fetch(`${DB}/users/${userId}/tasks/${taskId}.json?auth=${token}`, {
    method: "PATCH", headers: headers(), body: JSON.stringify(updates),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Failed to update task");
  return { id: taskId, ...data };
}

export async function deleteTask(userId, taskId) {
  const token = getToken();
  const res = await fetch(`${DB}/users/${userId}/tasks/${taskId}.json?auth=${token}`, {
    method: "DELETE", headers: headers(),
  });
  if (!res.ok) { const data = await res.json(); throw new Error(data.error || "Failed to delete task"); }
  return true;
}

// Archive / Unarchive
export async function archiveTask(userId, taskId, archived = true) {
  const token = getToken();
  const res = await fetch(`${DB}/users/${userId}/tasks/${taskId}.json?auth=${token}`, {
    method: "PATCH", headers: headers(), body: JSON.stringify({ archived }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Failed to archive task");
  return { id: taskId, ...data };
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
