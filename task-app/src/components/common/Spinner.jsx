import React from "react";

export default function Spinner({ size = "md", white = false }) {
  const cls = ["spinner", white && "spinner-white", size === "sm" && "spinner-sm"]
    .filter(Boolean).join(" ");
  return <div className={cls} />;
}
