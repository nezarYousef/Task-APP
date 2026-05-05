import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/layout/ProtectedRoute";
import LoginView from "./views/LoginView";
import DashboardView from "./views/DashboardView";
import NewTaskView from "./views/NewTaskView";
import TaskDetailView from "./views/TaskDetailView";
import ArchiveView from "./views/ArchiveView";

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<LoginView />} />
          <Route path="/dashboard" element={<ProtectedRoute><DashboardView /></ProtectedRoute>} />
          <Route path="/new-task" element={<ProtectedRoute><NewTaskView /></ProtectedRoute>} />
          <Route path="/task/:id" element={<ProtectedRoute><TaskDetailView /></ProtectedRoute>} />
          <Route path="/archive" element={<ProtectedRoute><ArchiveView /></ProtectedRoute>} />
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}
