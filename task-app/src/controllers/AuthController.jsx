import {
  signIn, signUp, sendPasswordReset,
  persistSession, clearSession, getSession,
  isSessionValid, refreshToken as refreshAuthToken,
} from "../models/AuthModel";
import { validateEmail, validatePassword } from "../utils/validation";

export async function loginController(email, password, remember = false) {
  const cleanEmail = validateEmail(email);
  validatePassword(password);
  const authData = await signIn(cleanEmail, password);
  persistSession(authData, remember);
  return authData;
}

export async function registerController(email, password, confirmPassword) {
  const cleanEmail = validateEmail(email);
  validatePassword(password);
  if (password !== confirmPassword) throw new Error("Passwords do not match.");
  const authData = await signUp(cleanEmail, password);
  persistSession(authData);
  return authData;
}

export async function forgotPasswordController(email) {
  const cleanEmail = validateEmail(email);
  await sendPasswordReset(cleanEmail);
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
    persistSession({ ...newSession, email: session.userEmail }, session.remember);
    return newSession;
  } catch {
    clearSession();
    return null;
  }
}
