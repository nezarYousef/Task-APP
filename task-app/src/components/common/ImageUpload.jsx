import React, { useRef, useState } from "react";
import { validateImageFile } from "../../utils/validation";

export default function ImageUpload({ preview, onPreviewChange, onError }) {
  const fileRef = useRef(null);
  const [drag, setDrag] = useState(false);

  const handleFile = (file) => {
    try {
      validateImageFile(file);
    } catch (err) {
      onError?.(err.message);
      return;
    }
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => onPreviewChange(e.target.result);
    reader.onerror = () => onError?.("Could not read this image. Please choose another file.");
    reader.readAsDataURL(file);
  };

  return (
    <div
      className={`upload-zone ${drag ? "drag-over" : ""}`}
      onDragOver={(e) => { e.preventDefault(); setDrag(true); }}
      onDragLeave={() => setDrag(false)}
      onDrop={(e) => { e.preventDefault(); setDrag(false); handleFile(e.dataTransfer.files[0]); }}
      onClick={() => fileRef.current?.click()}
    >
      <input
        ref={fileRef}
        type="file"
        accept="image/*"
        onChange={(e) => handleFile(e.target.files[0])}
      />

      {preview ? (
        <>
          <img src={preview} alt="Preview" className="upload-preview-img" />
          <button
            type="button"
            className="upload-remove-btn"
            onClick={(e) => { e.stopPropagation(); onPreviewChange(null); }}
          >
            Remove image
          </button>
        </>
      ) : (
        <>
          <div className="upload-icon-wrap">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="17 8 12 3 7 8" />
              <line x1="12" y1="3" x2="12" y2="15" />
            </svg>
          </div>
          <p className="upload-title">Drop image here</p>
          <p className="upload-subtitle">or <span>browse files</span> — PNG, JPG up to 10MB</p>
        </>
      )}
    </div>
  );
}
