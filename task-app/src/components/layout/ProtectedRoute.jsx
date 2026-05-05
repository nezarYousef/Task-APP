import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import LoadingOverlay from "../common/LoadingOverlay";

export default function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();
  if (loading) return <LoadingOverlay text="Loading…" />;
  if (!user) return <Navigate to="/login" replace />;
  return children;
}
