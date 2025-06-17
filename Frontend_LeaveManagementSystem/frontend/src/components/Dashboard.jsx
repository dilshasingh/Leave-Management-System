import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"; 
import Sidebar from "./Sidebar";
import LeaveForm from "./LeaveForm1";
import LeaveStats from "./LeaveStats";
import LeaveRequests from "./LeaveRequests";
import CalendarView from "./CalendarView";
import "../styles/Dashboard.css";
import axios from "axios";

function Dashboard() {
  const [activeView, setActiveView] = useState("home");
  const [historyData, setHistoryData] = useState([]);
  const [filteredHistoryData, setFilteredHistoryData] = useState([]);
  const [showHistory, setShowHistory] = useState(false);
  const user = JSON.parse(sessionStorage.getItem("user"));
  const [leaveCount, setLeaveCount] = useState(0);
  const navigate = useNavigate(); 

  const [filters, setFilters] = useState({
    type: "",
    startDate: "",
    endDate: "",
    reason: "",
    status: ""
  });

  useEffect(() => {
    const fetchLeaveCount = async () => {
      try {
        const response = await axios.get(`http://localhost:8080/api/leave/count/${user.empId}`);
        console.log(response.data);
        setLeaveCount(response.data); 
      } catch (error) {
        console.error("Failed to fetch leave count:", error);
      }
    };

    if (user?.empId) {
      fetchLeaveCount();
    }
  }, [user?.empId, historyData]);


  useEffect(() => {
    if (historyData.length > 0) {
      let filtered = historyData.filter(leave => {
        const typeMatch = !filters.type || leave.type.toLowerCase().includes(filters.type.toLowerCase());
        const reasonMatch = !filters.reason || leave.reason.toLowerCase().includes(filters.reason.toLowerCase());
        const statusMatch = !filters.status || (leave.status || "Pending").toLowerCase() === filters.status.toLowerCase();
        
        let startDateMatch = true;
        let endDateMatch = true;
        
        if (filters.startDate) {
          const filterStartDate = new Date(filters.startDate);
          const leaveStartDate = new Date(leave.startDate);
          startDateMatch = leaveStartDate >= filterStartDate;
        }
        
        if (filters.endDate) {
          const filterEndDate = new Date(filters.endDate);
          const leaveEndDate = new Date(leave.endDate);
          endDateMatch = leaveEndDate <= filterEndDate;
        }
        
        return typeMatch && reasonMatch && statusMatch && startDateMatch && endDateMatch;
      });
      
      setFilteredHistoryData(filtered);
    }
  }, [historyData, filters]);

  const handleHistory = async () => {
    try {
      const response = await axios.get(`http://localhost:8080/api/leave/history/${user.empId}`);
      setHistoryData(response.data);
      setFilteredHistoryData(response.data);
      setShowHistory(true);
    } catch (error) {
      console.error("No history found:", error);
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem("user");
    sessionStorage.clear(); 
    navigate("/");   
  };

  const handleFilterChange = (filterName, value) => {
    setFilters(prev => ({
      ...prev,
      [filterName]: value
    }));
  };

  const clearFilters = () => {
    setFilters({
      type: "",
      startDate: "",
      endDate: "",
      reason: "",
      status: ""
    });
  };

  const handleBackToForm = () => {
    setShowHistory(false);
  
    setFilters({
      type: "",
      startDate: "",
      endDate: "",
      reason: "",
      status: ""
    });
  };

  return (
    <div className="dashboard-layout">
      <Sidebar onSelect={setActiveView} activeView={activeView} />
      
      <div className="main-content">
        
        {activeView === "home" && (
          <div className="dashboard-header">
            {/* Logout Button */}
              <button className="logout-btn" onClick={handleLogout}>
                <span className="btn-icon">🚪</span>
                Logout
              </button>
            <h1 className={`welcome-message ${showHistory ? "history-mode" : "form-mode"}`}>Welcome back, {user?.empName || "Employee"}!</h1>
            <div className="header-controls">
              <div className={`leave-summary ${showHistory ? "history-mode-sum" : "form-mode"}`}>
                <span className="leave-count">{leaveCount}</span>
                <span className="leave-label">Leaves Taken</span>
              </div>
              {showHistory ? (
                <button className={`history-btn ${showHistory ? "history-mode-btn" : "form-mode"}`} onClick={handleBackToForm}>
                  <span className="btn-icon">⬅️</span>
                  Back to Form
                </button>
              ) : (
                <button className="history-btn" onClick={handleHistory}>
                  <span className="btn-icon">📅</span>
                  View History
                </button>
              )}
            </div>
          </div>
        )}

        <div className="center-align">
          <div className={`dashboard-content ${activeView === "home" ? "glass-card" : ""}`}>
            {activeView === "home" && (
              <>
                <h2 className={`section-title ${showHistory ? "history-mode-title" : "form-mode"}`}>
                  {showHistory ? "Leave History" : "Apply for Leave"}
                </h2>
              
                <div className="form-wrapper">
                  {showHistory ? (
                    <div className="history-section">
                      {/* Filter Section */}
                      <div className="filter-section">
                        
                        <h3 className="filter-title">Filter Leave History</h3>
                        <div className="filter-grid">
                          <div className="filter-group">
                            
                            <label htmlFor="type-filter">Type:</label>
                            <select
                              id="type-filter"
                              value={filters.type}
                              onChange={(e) => handleFilterChange('type', e.target.value)}
                              className="filter-select"
                            >
                              <option value="">All Types</option>
                              <option value="vacation">Vacation Leave</option>
                              <option value="sick">Sick Leave</option>
                              <option value="personal">Personal Leave</option>
                            </select>
                          </div>

                          <div className="filter-group">
                            <label htmlFor="start-date-filter">Start Date From:</label>
                            <input
                              type="date"
                              id="start-date-filter"
                              value={filters.startDate}
                              onChange={(e) => handleFilterChange('startDate', e.target.value)}
                              className="filter-input"
                            />
                          </div>

                          <div className="filter-group">
                            <label htmlFor="end-date-filter">End Date To:</label>
                            <input
                              type="date"
                              id="end-date-filter"
                              value={filters.endDate}
                              onChange={(e) => handleFilterChange('endDate', e.target.value)}
                              className="filter-input"
                            />
                          </div>
                        
                          <div className="filter-group">
                            <label htmlFor="reason-filter">Reason:</label>
                            <input
                              type="text"
                              id="reason-filter"
                              placeholder="Search by reason..."
                              value={filters.reason}
                              onChange={(e) => handleFilterChange('reason', e.target.value)}
                              className="filter-input"
                            />
                          </div>

                          <div className="filter-group">
                            <label htmlFor="status-filter">Status:</label>
                            <select
                              id="status-filter"
                              value={filters.status}
                              onChange={(e) => handleFilterChange('status', e.target.value)}
                              className="filter-select"
                            >
                              <option value="">All Status</option>
                              <option value="pending">Pending</option>
                              <option value="accepted">Accepted</option>
                              <option value="rejected">Rejected</option>
                            </select>
                          </div>

                          <div className="filter-group">
                            <button 
                              onClick={clearFilters}
                              className="clear-filters-btn"
                            >
                              Clear Filters
                            </button>
                          </div>
                        </div>
                        </div>
                      

               
                      <div className="results-summary">
                        <p>Showing {filteredHistoryData.length} of {historyData.length} records</p>
                      </div>

                      {/* History Table */}
                      <div className="table-container">
                        <table className="history-table">
                          <thead>
                            <tr>
                              <th>Type</th>
                              <th>Start Date</th>
                              <th>End Date</th>
                              <th>Reason</th>
                              <th>Status</th>
                            </tr>
                          </thead>
                          <tbody>
                            {filteredHistoryData.length > 0 ? (
                              filteredHistoryData.map((leave, index) => (
                                <tr key={index}>
                                  <td>{leave.type}</td>
                                  <td>{leave.startDate}</td>
                                  <td>{leave.endDate}</td>
                                  <td>{leave.reason}</td>
                                  <td>
                                    <span className={`status-badge status-${(leave.status || "pending").toLowerCase()}`}>
                                      {leave.status || "Pending"}
                                    </span>
                                  </td>
                                </tr>
                              ))
                            ) : (
                              <tr>
                                <td colSpan="5" className="no-data">
                                  {historyData.length === 0 
                                    ? "No leave history found." 
                                    : "No records match the current filters."}
                                </td>
                              </tr>
                            )}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  ) : (
                    <LeaveForm />
                  )}
                </div>
              </>
            )}

            {activeView === "stats" && <LeaveStats />}
            {activeView === "requests" && <LeaveRequests />}
            {activeView === "calendar" && <CalendarView />}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;