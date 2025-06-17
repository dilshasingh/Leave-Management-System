import React from "react";
import "../styles/Sidebar.css";

const menuItems = [
  { id: "home", label: "Dashboard", icon: "🏠" },
  { id: "stats", label: "Leave Stats", icon: "📊" },
  
];

function Sidebar({ onSelect, activeView }) {
  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <div className="app-logo">🌿 Leave Tracker</div>
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
        
         
        </div>
      </div>
    
  );
}

export default Sidebar;