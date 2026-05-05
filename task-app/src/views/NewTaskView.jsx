import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { addTaskController } from "../controllers/TaskController";
import { createDefaultTask } from "../models/TaskModel";

import AppLayout from "../components/layout/AppLayout";
import Alert from "../components/common/Alert";
import Spinner from "../components/common/Spinner";
import SectionTitle from "../components/common/SectionTitle";
import TagInput from "../components/common/TagInput";
import ImageUpload from "../components/common/ImageUpload";
import StatusSelector from "../components/task/StatusSelector";
import PrioritySelector from "../components/task/PrioritySelector";
import ChecklistEditor from "../components/task/ChecklistEditor";
import SideCard from "../components/task/SideCard";

const PenIcon = () => <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 20h9" /><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" /></svg>;
const CalIcon = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" /></svg>;
const ImgIcon = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="17 8 12 3 7 8" /><line x1="12" y1="3" x2="12" y2="15" /></svg>;
const InfoIcon = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" /><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" /></svg>;
const ClockIcon = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></svg>;
const CheckIcon = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="9 11 12 14 22 4" /><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" /></svg>;
const PulseIcon = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12" /></svg>;
const InfoCircle = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" /></svg>;
const TickIcon = () => <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12" /></svg>;

const TIPS = [
  "Use clear, action-oriented task names",
  "Press Enter to add category tags",
  "Add images to make tasks more visual",
];

export default function NewTaskView() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [categories, setCategories] = useState([]);
  const [status, setStatus] = useState("waiting");
  const [priority, setPriority] = useState("low");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [imagePreview, setImagePreview] = useState(null);
  const [checklist, setChecklist] = useState(createDefaultTask().checklist);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await addTaskController(user.userId, {
        title, description, category: categories,
        status, priority, startDate, endDate,
        imageUrl: imagePreview || null, checklist,
      });
      navigate("/dashboard");
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  return (
    <AppLayout>
      <div className="page-header">
        <div>
          <p className="page-eyebrow">New Task</p>
          <h1 className="page-title">Create a New Task</h1>
          <p className="page-subtitle">Fill in the details below to add a task to your workspace</p>
        </div>
      </div>

      {error && <Alert type="error" onClose={() => setError("")}>{error}</Alert>}

      <form onSubmit={handleSubmit}>
        <div className="new-task-grid">

          {/* LEFT: Main form */}
          <div className="card form-card fade-up">

            <SectionTitle icon={<InfoIcon />}>Task Information</SectionTitle>

            <div className="form-group">
              <label className="form-label">Task Name</label>
              <div className="input-wrap">
                <span className="input-icon"><PenIcon /></span>
                <input
                  className="form-control"
                  type="text"
                  placeholder="e.g. Redesign the homepage UI"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Categories</label>
              <TagInput tags={categories} onChange={setCategories} />
            </div>

            <div className="form-group">
              <label className="form-label">Task Description</label>
              <textarea
                className="form-control no-icon"
                rows={5}
                placeholder="Describe the task in detail — goals, requirements, dependencies…"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>

            <SectionTitle icon={<CalIcon />}>Schedule</SectionTitle>

            <div className="schedule-row">
              <div className="form-group form-group-last">
                <label className="form-label">Start Date &amp; Time</label>
                <div className="input-wrap">
                  <span className="input-icon"><ClockIcon /></span>
                  <input
                    className="form-control"
                    type="datetime-local"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    required
                  />
                </div>
              </div>
              <div className="form-group form-group-last">
                <label className="form-label">End Date &amp; Time</label>
                <div className="input-wrap">
                  <span className="input-icon"><ClockIcon /></span>
                  <input
                    className="form-control"
                    type="datetime-local"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    required
                  />
                </div>
              </div>
            </div>

            <SectionTitle icon={<ImgIcon />}>Task Image</SectionTitle>
            <ImageUpload preview={imagePreview} onPreviewChange={setImagePreview} />

            <div className="form-actions">
              <button type="submit" className="btn btn-primary form-btn-submit" disabled={loading}>
                {loading ? <><Spinner size="sm" white /> Creating…</> : <><TickIcon /> Create Task</>}
              </button>
              <button type="button" className="btn btn-secondary form-btn-cancel" onClick={() => navigate("/dashboard")}>
                Cancel
              </button>
            </div>
          </div>

          {/* RIGHT: Side panel */}
          <div className="side-panel">
            <SideCard title="Status" icon={<ClockIcon />}  ><StatusSelector value={status} onChange={setStatus} /></SideCard>
            <SideCard title="Priority" icon={<PulseIcon />}  ><PrioritySelector value={priority} onChange={setPriority} /></SideCard>
            <SideCard title="Checklist" icon={<CheckIcon />}  ><ChecklistEditor items={checklist} onChange={setChecklist} /></SideCard>
            <SideCard title="Tips" icon={<InfoCircle />} >
              <div className="tips-list">
                {TIPS.map((tip) => (
                  <div key={tip} className="tip-item">
                    <span className="tip-dot" />
                    {tip}
                  </div>
                ))}
              </div>
            </SideCard>
          </div>
        </div>
      </form>
    </AppLayout>
  );
}
