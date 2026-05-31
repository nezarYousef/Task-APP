import { FIREBASE_API_KEY, FIREBASE_AUTH_URL } from "../firebase/config";

const BASE = FIREBASE_AUTH_URL;
const SESSION_KEYS = ["authToken", "refreshToken", "userId", "userEmail", "tokenExpiry", "isAdmin"];

const getSessionStore = () => (
  localStorage.getItem("authToken") ? localStorage : sessionStorage
);

const clearStore = (store) => SESSION_KEYS.forEach((key) => store.removeItem(key));

function formatAuthError(code) {
  const map = {
    EMAIL_EXISTS: "This email is already registered.",
    INVALID_EMAIL: "Invalid email address.",
    WEAK_PASSWORD: "Password must be at least 6 characters.",
    EMAIL_NOT_FOUND: "No account found with this email.",
    INVALID_PASSWORD: "Incorrect password.",
    USER_DISABLED: "This account has been disabled.",
    TOO_MANY_ATTEMPTS_TRY_LATER: "Too many attempts. Please try again later.",
    INVALID_LOGIN_CREDENTIALS: "Invalid email or password.",
  };
  return map[code] || code || "Authentication failed. Please try again.";
}

export async function signUp(email, password) {
  const res = await fetch(`${BASE}:signUp?key=${FIREBASE_API_KEY}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password, returnSecureToken: true }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(formatAuthError(data.error?.message));
  return { userId: data.localId, email: data.email, token: data.idToken, refreshToken: data.refreshToken, expiresIn: data.expiresIn };
}

export async function signIn(email, password) {
  const res = await fetch(`${BASE}:signInWithPassword?key=${FIREBASE_API_KEY}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password, returnSecureToken: true }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(formatAuthError(data.error?.message));
  return { userId: data.localId, email: data.email, token: data.idToken, refreshToken: data.refreshToken, expiresIn: data.expiresIn };
}

export async function sendPasswordReset(email) {
  const res = await fetch(`${BASE}:sendOobCode?key=${FIREBASE_API_KEY}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ requestType: "PASSWORD_RESET", email }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(formatAuthError(data.error?.message));
  return true;
}

export async function refreshToken(refreshTkn) {
  const res = await fetch(`https://securetoken.googleapis.com/v1/token?key=${FIREBASE_API_KEY}`, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({ grant_type: "refresh_token", refresh_token: refreshTkn }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(formatAuthError(data.error?.message));
  return { token: data.id_token, refreshToken: data.refresh_token, userId: data.user_id };
}

export function persistSession(authData, remember = false) {
  clearSession();
  const store = remember ? localStorage : sessionStorage;
  store.setItem("authToken", authData.token);
  store.setItem("refreshToken", authData.refreshToken);
  store.setItem("userId", authData.userId);
  store.setItem("userEmail", authData.email);
  store.setItem("tokenExpiry", String(Date.now() + Number(authData.expiresIn || 3600) * 1000));
  if (authData.isAdmin !== undefined) store.setItem("isAdmin", String(authData.isAdmin));
}

export function clearSession() {
  clearStore(localStorage);
  clearStore(sessionStorage);
}

export function getSession() {
  const store = getSessionStore();
  const token = store.getItem("authToken");
  const userId = store.getItem("userId");
  if (!token || !userId) return null;
  return {
    token,
    userId,
    userEmail: store.getItem("userEmail"),
    tokenExpiry: store.getItem("tokenExpiry"),
    refreshToken: store.getItem("refreshToken"),
    isAdmin: store.getItem("isAdmin") === "true",
    remember: store === localStorage,
  };
}

export function isSessionValid() {
  const session = getSession();
  return session ? Date.now() < Number(session.tokenExpiry) : false;
}
