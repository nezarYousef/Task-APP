import React from "react";

const STATUS_LABELS = {
  waiting: "Waiting",
  inprogress: "In Progress",
  complete: "Complete",
  canceled: "Canceled",
};

export default function StatusBadge({ status }) {
  return (
    <span className={`badge badge-${status}`}>
      {STATUS_LABELS[status] || status}
    </span>
  );
}
