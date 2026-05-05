// src/components/task/TaskGrid.js
import React from "react";
import { useNavigate } from "react-router-dom";
import TaskCard   from "./TaskCard";
import EmptyState from "../common/EmptyState";

export default function TaskGrid({
  tasks,
  onDelete,
  onStatusChange,
  onArchive,
  archiveMode = false,
  emptyIcon    = "📋",
  emptyTitle   = "No tasks yet",
  emptyMessage = "Start by creating your first task.",
}) {
  const navigate = useNavigate();

  if (tasks.length === 0) {
    return (
      <EmptyState
        icon={emptyIcon}
        title={emptyTitle}
        message={emptyMessage}
        action={
          !archiveMode && (
            <button className="btn btn-primary" onClick={() => navigate("/new-task")}>
              Create your first task
            </button>
          )
        }
      />
    );
  }

  return (
    <div className="tasks-grid">
      {tasks.map((task) => (
        <TaskCard
          key={task.id}
          task={task}
          onView={(id) => navigate(`/task/${id}`)}
          onDelete={onDelete}
          onStatusChange={onStatusChange}
          onArchive={onArchive}
          archiveMode={archiveMode}
        />
      ))}
    </div>
  );
}
