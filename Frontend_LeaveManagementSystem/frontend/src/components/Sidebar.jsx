import React from "react";
import "../styles/Sidebar.css";

const menuItems = [
  { id: "home", label: "Dashboard", icon: "🏠" },
  { id: "stats", label: "Leave Stats", icon: "📊" },
  { id: "requests", label: "Requests", icon: "📋" },
  { id: "calendar", label: "Calendar", icon: "🗓️" }
];
const user = JSON.parse(sessionStorage.getItem("user"));
function Sidebar({ onSelect, activeView }) {
  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <div className="app-logo"> LeaveTrack</div>
      </div>
      
      <nav className="sidebar-nav">
        {menuItems.map(item => (
          <button
            key={item.id}
            onClick={() => onSelect(item.id)}
            className={`nav-item ${activeView === item.id ? "active" : ""}`}
          >
            <span className="nav-icon">{item.icon}</span>
            <span className="nav-label">{item.label}</span>
          </button>
        ))}
      </nav>
      
      <div className="sidebar-footer">
        <div className="user-profile">
          <div className="avatar">👤</div>
          <div className="user-info">
            <span className="user-name">{user.empName}</span>
            <span className="user-role">Employee</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Sidebar;