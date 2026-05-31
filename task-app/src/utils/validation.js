const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const ALLOWED_STATUSES = ["waiting", "inprogress", "complete", "canceled"];
const ALLOWED_PRIORITIES = ["low", "medium", "high"];
const MAX_IMAGE_BYTES = 10 * 1024 * 1024;

export function requireUserId(userId) {
  if (!userId || typeof userId !== "string") {
    throw new Error("Please sign in again to continue.");
  }
}

export function requireTaskId(taskId) {
  if (!taskId || typeof taskId !== "string") {
    throw new Error("Invalid task id.");
  }
}

export function validateEmail(email) {
  const normalized = String(email || "").trim();
  if (!normalized) throw new Error("Email is required.");
  if (!EMAIL_PATTERN.test(normalized)) throw new Error("Invalid email address.");
  return normalized;
}

export function validatePassword(password) {
  if (!password) throw new Error("Password is required.");
  if (password.length < 6) throw new Error("Password must be at least 6 characters.");
}

export function normalizeStatus(status, fallback = "waiting") {
  return ALLOWED_STATUSES.includes(status) ? status : fallback;
}

export function normalizePriority(priority, fallback = "low") {
  return ALLOWED_PRIORITIES.includes(priority) ? priority : fallback;
}

export function validateStatus(status) {
  if (!ALLOWED_STATUSES.includes(status)) throw new Error("Invalid status.");
  return status;
}

export function validatePriority(priority) {
  if (!ALLOWED_PRIORITIES.includes(priority)) throw new Error("Invalid priority.");
  return priority;
}

export function clampProgress(progress) {
  const value = Number(progress);
  if (!Number.isFinite(value)) {
    throw new Error("Progress must be a number between 0 and 100.");
  }
  return Math.min(100, Math.max(0, Math.round(value)));
}

export function validateAge(age) {
  const value = Number(age);
  if (!Number.isInteger(value) || value < 1 || value > 120) {
    throw new Error("Age must be a valid number between 1 and 120.");
  }
  return value;
}

export function normalizeDateInput(value, fieldName) {
  if (!value) throw new Error(`${fieldName} is required.`);
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    throw new Error(`${fieldName} must be a valid date.`);
  }
  return value;
}

export function validateDateRange(startDate, endDate) {
  const start = normalizeDateInput(startDate, "Start date");
  const end = normalizeDateInput(endDate, "End date");
  if (new Date(end).getTime() < new Date(start).getTime()) {
    throw new Error("End date must be after start date.");
  }
  return { startDate: start, endDate: end };
}

export function sanitizeText(value, { required = false, max = 500, fieldName = "Text" } = {}) {
  const text = String(value || "").trim();
  if (required && !text) throw new Error(`${fieldName} is required.`);
  if (text.length > max) throw new Error(`${fieldName} must be ${max} characters or fewer.`);
  return text;
}

export function sanitizeTags(tags) {
  if (!Array.isArray(tags)) return [];
  const cleaned = tags
    .map((tag) => String(tag || "").trim().replace(/,/g, ""))
    .filter(Boolean)
    .slice(0, 10);
  return [...new Set(cleaned)].map((tag) => tag.slice(0, 40));
}

export function sanitizeChecklist(items) {
  if (!Array.isArray(items)) return [];
  return items.slice(0, 20).map((item, index) => ({
    id: String(item?.id || `c${index + 1}`).slice(0, 40),
    text: sanitizeText(item?.text, { max: 120, fieldName: "Checklist item" }),
    done: item?.done === true,
  })).filter((item) => item.text);
}

export function validateImageFile(file) {
  if (!file) return;
  if (!file.type?.startsWith("image/")) {
    throw new Error("Only image files are allowed.");
  }
  if (file.size > MAX_IMAGE_BYTES) {
    throw new Error("Image must be 10MB or smaller.");
  }
}

export function safeDateLabel(value, fallback = "-") {
  if (!value) return fallback;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return fallback;
  return date.toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });
}
