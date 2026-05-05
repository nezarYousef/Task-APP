import React, { useState } from "react";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";

export default function AppLayout({ children, taskCount = 0, onSearch, searchVal = "", onFilterStatus }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="app-layout">
      <div className="bg-texture" />

      <Navbar
        onMenuToggle={() => setSidebarOpen((o) => !o)}
        onSearch={onSearch || (() => { })}
        searchVal={searchVal}
      />

      <Sidebar
        isOpen={sidebarOpen}
        taskCount={taskCount}
        onFilterStatus={(status) => {
          setSidebarOpen(false);
          onFilterStatus && onFilterStatus(status);
        }}
      />

      <main className="main-wrap fade-in">
        {children}
      </main>
    </div>
  );
}
