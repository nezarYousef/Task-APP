
import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { checkAuthController, logoutController } from "../controllers/AuthController";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuthController()
      .then((session) => setUser(session))
      .catch(() => setUser(null))
      .finally(() => setLoading(false));
  }, []);

  const login = useCallback((authData) => setUser({ userId: authData.userId, token: authData.token, userEmail: authData.email }), []);
  const logout = useCallback(() => { logoutController(); setUser(null); }, []);

  return <AuthContext.Provider value={{ user, loading, login, logout }}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
