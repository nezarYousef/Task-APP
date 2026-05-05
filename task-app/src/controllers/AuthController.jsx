import {
  signIn, signUp, sendPasswordReset,
  persistSession, clearSession, getSession,
  isSessionValid, refreshToken as refreshAuthToken,
} from "../models/AuthModel";

export async function loginController(email, password) {
  if (!email || !password) throw new Error("Email and password are required.");
  const authData = await signIn(email.trim(), password);
  persistSession(authData);
  return authData;
}

export async function registerController(email, password, confirmPassword) {
  if (!email || !password) throw new Error("All fields are required.");
  if (password !== confirmPassword) throw new Error("Passwords do not match.");
  if (password.length < 6) throw new Error("Password must be at least 6 characters.");
  const authData = await signUp(email.trim(), password);
  persistSession(authData);
  return authData;
}

export async function forgotPasswordController(email) {
  if (!email) throw new Error("Please enter your email address.");
  await sendPasswordReset(email.trim());
  return true;
}

export function logoutController() {
  clearSession();
}

export async function checkAuthController() {
  if (isSessionValid()) return getSession();
  const session = getSession();
  if (!session?.refreshToken) return null;
  try {
    const refreshed = await refreshAuthToken(session.refreshToken);
    const newSession = { ...session, token: refreshed.token, refreshToken: refreshed.refreshToken, userId: refreshed.userId, expiresIn: "3600" };
    persistSession({ ...newSession, email: session.userEmail });
    return newSession;
  } catch {
    clearSession();
    return null;
  }
}
