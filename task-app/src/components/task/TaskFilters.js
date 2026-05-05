// src/components/task/TaskFilters.js
import React from "react";
import { useNavigate } from "react-router-dom";

export default function TaskFilters({ statusFilter, catFilter, categories, onStatusChange, onCatChange, onClear }) {
  const navigate   = useNavigate();
  const hasFilters = statusFilter !== "all" || catFilter !== "all";

  return (
    <div className="filter-bar">
      <span className="filter-label">Filter:</span>

      <select
        className="form-control filter-select"
        value={statusFilter}
        onChange={(e) => onStatusChange(e.target.value)}
      >
        <option value="all">All Statuses</option>
        <option value="waiting">Waiting</option>
        <option value="inprogress">In Progress</option>
        <option value="complete">Complete</option>
        <option value="canceled">Canceled</option>
      </select>

      <select
        className="form-control filter-select"
        value={catFilter}
        onChange={(e) => onCatChange(e.target.value)}
      >
        <option value="all">All Categories</option>
        {categories.map((c) => (
          <option key={c} value={c}>{c}</option>
        ))}
      </select>

      {hasFilters && (
        <button className="btn btn-secondary btn-clear-filters" onClick={onClear}>
          Clear filters
        </button>
      )}

      <button
        className="btn btn-primary btn-add-task"
        onClick={() => navigate("/new-task")}
      >
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
          <line x1="12" y1="5" x2="12" y2="19" />
          <line x1="5"  y1="12" x2="19" y2="12" />
        </svg>
        Add Task
      </button>
    </div>
  );
}
