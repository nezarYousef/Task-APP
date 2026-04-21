import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import NewTask from './pages/NewTask';
import TaskDetails from './pages/TaskDetails';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/new-task" element={<NewTask />} />
        <Route path="/task/:id" element={<TaskDetails />} />
      </Routes>
    </BrowserRouter>
  );
}