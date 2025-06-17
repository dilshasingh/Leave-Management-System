import React from "react";

function LeaveStatsAdmin() {
  // Mocked data — replace with API call later
  const leaveStats = {
    total: 120,
    approved: 80,
    pending: 25,
    rejected: 15,
  };

  return (
    <div className="leave-stats-container">
      <h2>Leave Statistics (Admin)</h2>
      <div className="leave-cards">
        <div className="stat-card total">
          <h3>Total Requests</h3>
          <p>{leaveStats.total}</p>
        </div>
        <div className="stat-card approved">
          <h3>Approved</h3>
          <p>{leaveStats.approved}</p>
        </div>
        <div className="stat-card pending">
          <h3>Pending</h3>
          <p>{leaveStats.pending}</p>
        </div>
        <div className="stat-card rejected">
          <h3>Rejected</h3>
          <p>{leaveStats.rejected}</p>
        </div>
      </div>
    </div>
  );
}

export default LeaveStatsAdmin;
