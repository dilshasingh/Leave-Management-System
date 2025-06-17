import React, { useState } from "react";
import SidebarAdmin from "../components/SidebarAdmin";
import AdminView from "../components/AdminView";
import LeaveStatsAdmin from "../components/LeaveStatsAdmin";
import "../styles/Admin.css";

function Admin() {
  const [activeView, setActiveView] = useState("home");

  return (
    <div className="dashboard-layout" style={{ display: "flex" }}>
      <SidebarAdmin onSelect={setActiveView} />
      <div className="dashboard-container">
        {activeView === "home" && <AdminView />}
        {activeView === "stats" && <LeaveStatsAdmin />}
      </div>
    </div>
 
    
  );
}

export default Admin;
