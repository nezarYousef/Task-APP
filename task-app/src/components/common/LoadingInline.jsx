import React from "react";
import Spinner from "./Spinner";

export default function LoadingInline({ text = "Loading…" }) {
  return (
    <div className="loading-inline">
      <Spinner />
      <span className="loading-text">{text}</span>
    </div>
  );
}
