import React from "react";
import Spinner from "./Spinner";

export default function LoadingOverlay({ text = "Loading…" }) {
  return (
    <div className="loading-overlay">
      <div className="loading-center">
        <Spinner />
        <span className="loading-text">{text}</span>
      </div>
    </div>
  );
}
