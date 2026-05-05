import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';

export default function NewTask() {
  const navigate = useNavigate();
  const [tags, setTags] = useState(['Design', 'Frontend']);
  const [tagInput, setTagInput] = useState('');
  const [priority, setPriority] = useState('low');
  const [previewSrc, setPreviewSrc] = useState(null);
  const [dragOver, setDragOver] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [checklist, setChecklist] = useState([false, false, false, false]);
  const fileInputRef = useRef();

  const handleTagKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      const val = tagInput.trim().replace(',', '');
      if (val && !tags.includes(val)) setTags(prev => [...prev, val]);
      setTagInput('');
    }
  };

  const removeTag = (index) => {
    setTags(prev => prev.filter((_, i) => i !== index));
  };

  const handleFileChange = (file) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = e => setPreviewSrc(e.target.result);
    reader.readAsDataURL(file);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFileChange(file);
  };

  const handleSubmit = () => {
    setSubmitting(true);
    setTimeout(() => navigate('/dashboard'), 1000);
  };

  const toggleCheck = (i) => {
    setChecklist(prev => prev.map((v, idx) => idx === i ? !v : v));
  };

  const checklistItems = [
    'Define task requirements',
    'Set clear deadline',
    'Attach relevant image',
    'Add category tags',
  ];

  return (
    <>
      <div className="bg-texture" />
      <Navbar variant="newtask" />
      <Sidebar variant="newtask" />

      <main className="main-wrap">
        <div className="page-header">
          <div>
            <div className="page-eyebrow">New Task</div>
            <h1 className="page-title">Create a New Task</h1>
            <p className="page-subtitle">Fill in the details below to add a task to your workspace</p>
          </div>
        </div>

        <div className="form-container">
          {/* Main form */}
          <div>
            <div className="form-card">
              <div className="form-section-title">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                  <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                </svg>
                Task Information
              </div>

              <div className="form-group">
                <label className="form-label">Task Name</label>
                <div className="input-wrap">
                  <svg className="input-icon" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M12 20h9" />
                    <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
                  </svg>
                  <input className="form-control" type="text" placeholder="e.g. Redesign the homepage UI" />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Categories</label>
                <div
                  className="tags-container"
                  onClick={() => document.getElementById('tagInput').focus()}
                >
                  {tags.map((tag, i) => (
                    <span key={i} className="tag">
                      {tag}{' '}
                      <button className="tag-remove" onClick={() => removeTag(i)}>×</button>
                    </span>
                  ))}
                  <input
                    id="tagInput"
                    className="tags-input"
                    placeholder="Add category…"
                    value={tagInput}
                    onChange={e => setTagInput(e.target.value)}
                    onKeyDown={handleTagKeyDown}
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Task Description</label>
                <textarea
                  className="form-control no-icon"
                  placeholder="Describe the task in detail — goals, requirements, dependencies…"
                  rows="5"
                />
              </div>

              <div className="form-section-title" style={{ marginTop: 8 }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="3" y="4" width="18" height="18" rx="2" />
                  <line x1="16" y1="2" x2="16" y2="6" />
                  <line x1="8" y1="2" x2="8" y2="6" />
                  <line x1="3" y1="10" x2="21" y2="10" />
                </svg>
                Schedule
              </div>

              <div className="form-row">
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label">Start Date &amp; Time</label>
                  <div className="input-wrap">
                    <svg className="input-icon" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <circle cx="12" cy="12" r="10" />
                      <polyline points="12 6 12 12 16 14" />
                    </svg>
                    <input className="form-control" type="datetime-local" />
                  </div>
                </div>
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label">End Date &amp; Time</label>
                  <div className="input-wrap">
                    <svg className="input-icon" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <circle cx="12" cy="12" r="10" />
                      <polyline points="12 6 12 12 16 14" />
                    </svg>
                    <input className="form-control" type="datetime-local" />
                  </div>
                </div>
              </div>

              <div className="form-section-title" style={{ marginTop: 24 }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                  <polyline points="17 8 12 3 7 8" />
                  <line x1="12" y1="3" x2="12" y2="15" />
                </svg>
                Task Image
              </div>

              <div
                className={`upload-zone${dragOver ? ' drag-over' : ''}`}
                onDragOver={e => { e.preventDefault(); setDragOver(true); }}
                onDragLeave={() => setDragOver(false)}
                onDrop={handleDrop}
              >
                <input
                  type="file"
                  className="upload-input"
                  accept="image/*"
                  ref={fileInputRef}
                  onChange={e => handleFileChange(e.target.files[0])}
                />
                <div className="upload-icon">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                    <polyline points="17 8 12 3 7 8" />
                    <line x1="12" y1="3" x2="12" y2="15" />
                  </svg>
                </div>
                <div className="upload-title">Drop image here</div>
                <div className="upload-sub">
                  or <span onClick={() => fileInputRef.current?.click()}>browse files</span> — PNG, JPG up to 10MB
                </div>
                {previewSrc && (
                  <div className="upload-preview" style={{ display: 'block' }}>
                    <img src={previewSrc} alt="Preview" />
                  </div>
                )}
              </div>

              <div className="btn-row" style={{ marginTop: 28 }}>
                <button className="btn-primary" onClick={handleSubmit} disabled={submitting}>
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <circle cx="12" cy="12" r="10" />
                    <polyline points="12 6 12 12 16 14" />
                  </svg>
                  {submitting ? 'Task Created!' : 'Create Task'}
                </button>
                <a href="/dashboard" className="btn-secondary">Cancel</a>
              </div>
            </div>
          </div>

          {/* Right panel */}
          <div className="side-panel">
            <div className="side-card">
              <div className="side-card-title">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10" />
                  <polyline points="12 6 12 12 16 14" />
                </svg>
                Status
              </div>
              <div className="status-options">
                {['waiting', 'inprogress', 'complete', 'canceled'].map((s, i) => (
                  <span key={s}>
                    <input
                      type="radio"
                      name="status"
                      id={`s${i + 1}`}
                      className={`status-option s-${s}`}
                      defaultChecked={s === 'waiting'}
                    />
                    <label htmlFor={`s${i + 1}`}>
                      <span className={`status-dot dot-${s}`} />
                      {s === 'inprogress' ? 'In Progress' : s.charAt(0).toUpperCase() + s.slice(1)}
                    </label>
                  </span>
                ))}
              </div>
            </div>

            <div className="side-card">
              <div className="side-card-title">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
                </svg>
                Priority
              </div>
              <div className="priority-row">
                {['low', 'medium', 'high'].map(p => (
                  <button
                    key={p}
                    className={`priority-btn${priority === p ? ` active-${p}` : ''}`}
                    onClick={() => setPriority(p)}
                  >
                    {p.charAt(0).toUpperCase() + p.slice(1)}
                  </button>
                ))}
              </div>
            </div>

            <div className="side-card">
              <div className="side-card-title">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polyline points="9 11 12 14 22 4" />
                  <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
                </svg>
                Checklist
              </div>
              <div className="checklist">
                {checklistItems.map((item, i) => (
                  <div className="check-item" key={i}>
                    <input
                      type="checkbox"
                      id={`c${i + 1}`}
                      checked={checklist[i]}
                      onChange={() => toggleCheck(i)}
                    />
                    <label htmlFor={`c${i + 1}`}>
                      <span className="check-box-custom">
                        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3">
                          <polyline points="20 6 9 17 4 12" />
                        </svg>
                      </span>
                      {item}
                    </label>
                  </div>
                ))}
              </div>
            </div>

            <div className="side-card">
              <div className="side-card-title">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10" />
                  <line x1="12" y1="8" x2="12" y2="12" />
                  <line x1="12" y1="16" x2="12.01" y2="16" />
                </svg>
                Tips
              </div>
              <div className="tip-item"><span className="tip-dot" />Use clear, action-oriented task names</div>
              <div className="tip-item"><span className="tip-dot" />Press Enter to add category tags</div>
              <div className="tip-item"><span className="tip-dot" />Add images to make tasks more visual</div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}