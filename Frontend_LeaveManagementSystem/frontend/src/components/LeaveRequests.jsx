import React, { useState, useEffect } from "react";
import "../styles/LeaveRequests.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function LeaveRequests() {
  const [requests, setRequests] = useState([]); // pending only
  const [history, setHistory] = useState([]); // all requests
  const [filteredRequests, setFilteredRequests] = useState([]);
  const [filteredHistory, setFilteredHistory] = useState([]);
  const [dropdownId, setDropdownId] = useState(null);
  const [showHistory, setShowHistory] = useState(false);
  const [showCurrentTypeDropdown, setShowCurrentTypeDropdown] = useState(false);
  const [showHistoryTypeDropdown, setShowHistoryTypeDropdown] = useState(false);
  const [showHistoryStatusDropdown, setShowHistoryStatusDropdown] = useState(false);

  const leaveTypes = ['Vacation', 'Sick', 'Personal'];
  const statusOptions = ['Accepted', 'Rejected', 'Pending'];

  // Filter states for current requests
  const [currentFilters, setCurrentFilters] = useState({
    name: '',
    type: [], 
    fromDate: '',
    toDate: '',
    reason: ''
  });

  // Filter states for history
  const [historyFilters, setHistoryFilters] = useState({
    name: '',
    type: [],
    fromDate: '',
    toDate: '',
    reason: '',
    status: [] 
  });

  const user = JSON.parse(sessionStorage.getItem("user"));
  const navigate = useNavigate();

  const fetchData = async () => {
    try {
      if (user?.empId) {
        const [pendingRes, allRes] = await Promise.all([
          axios.get(`http://localhost:8080/api/leave/requests/pending/${user.empId}`),
          axios.get(`http://localhost:8080/api/leave/requests/${user.empId}`),
        ]);
        setRequests(pendingRes.data);
        setHistory(allRes.data);
      }
    } catch (error) {
      console.error("Error fetching leave data:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Filter current requests based on currentFilters
  useEffect(() => {
    let filtered = requests;

    if (currentFilters.name) {
      filtered = filtered.filter(req => 
        req.name?.toLowerCase().includes(currentFilters.name.toLowerCase())
      );
    }
    if (currentFilters.type.length > 0) {
      filtered = filtered.filter(req => 
        currentFilters.type.some(selectedType => 
          req.type?.toLowerCase().includes(selectedType.toLowerCase())
        )
      );
    }
    if (currentFilters.fromDate) {
      filtered = filtered.filter(req => 
        req.startDate >= currentFilters.fromDate
      );
    }
    if (currentFilters.toDate) {
      filtered = filtered.filter(req => 
        req.endDate <= currentFilters.toDate
      );
    }
    if (currentFilters.reason) {
      filtered = filtered.filter(req => 
        req.reason?.toLowerCase().includes(currentFilters.reason.toLowerCase())
      );
    }

    setFilteredRequests(filtered);
  }, [currentFilters, requests]);

  // Filter history based on historyFilters
  useEffect(() => {
    let filtered = history;

    if (historyFilters.name) {
      filtered = filtered.filter(req => 
        req.name?.toLowerCase().includes(historyFilters.name.toLowerCase())
      );
    }
    if (historyFilters.type.length > 0) {
      filtered = filtered.filter(req => 
        historyFilters.type.some(selectedType => 
          req.type?.toLowerCase().includes(selectedType.toLowerCase())
        )
      );
    }
    if (historyFilters.fromDate) {
      filtered = filtered.filter(req => 
        req.startDate >= historyFilters.fromDate
      );
    }
    if (historyFilters.toDate) {
      filtered = filtered.filter(req => 
        req.endDate <= historyFilters.toDate
      );
    }
    if (historyFilters.reason) {
      filtered = filtered.filter(req => 
        req.reason?.toLowerCase().includes(historyFilters.reason.toLowerCase())
      );
    }
    if (historyFilters.status.length > 0) {
      filtered = filtered.filter(req => 
        historyFilters.status.some(selectedStatus => 
          req.status?.toLowerCase().includes(selectedStatus.toLowerCase())
        )
      );
    }

    setFilteredHistory(filtered);
  }, [historyFilters, history]);

  const handleDecision = async (request, status) => {
    try {
      await axios.put(
        `http://localhost:8080/api/leave/status/${request.leaveId}?status=${status}`
      );

      setRequests((prev) => prev.filter((req) => req.leaveId !== request.leaveId));
      setDropdownId(null);
      fetchData();
    } catch (error) {
      console.error("Failed to update leave status:", error);
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem("user");
    sessionStorage.clear(); 
    navigate("/");   
  };

  const handleCurrentFilterChange = (field, value) => {
    setCurrentFilters(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleHistoryFilterChange = (field, value) => {
    setHistoryFilters(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleTypeSelection = (type, isHistory = false) => {
    const filters = isHistory ? historyFilters : currentFilters;
    const setFilters = isHistory ? setHistoryFilters : setCurrentFilters;
    
    const currentTypes = [...filters.type];
    const typeIndex = currentTypes.indexOf(type);
    
    if (typeIndex > -1) {
      currentTypes.splice(typeIndex, 1);
    } else {
      currentTypes.push(type);
    }
    
    setFilters(prev => ({
      ...prev,
      type: currentTypes
    }));
  };

  const handleStatusSelection = (status, isHistory = false) => {
    if (!isHistory) return;
    
    const filters = historyFilters;
    const setFilters = setHistoryFilters;
    
    const currentStatuses = [...filters.status];
    const statusIndex = currentStatuses.indexOf(status);
    
    if (statusIndex > -1) {
      currentStatuses.splice(statusIndex, 1);
    } else {
      currentStatuses.push(status);
    }
    
    setFilters(prev => ({
      ...prev,
      status: currentStatuses
    }));
  };

  const getSelectedStatusesDisplay = (selectedStatuses) => {
    if (selectedStatuses.length === 0) return "Select Status";
    if (selectedStatuses.length === 1) return selectedStatuses[0];
    return `${selectedStatuses.length} statuses selected`;
  };

  const getSelectedTypesDisplay = (selectedTypes) => {
    if (selectedTypes.length === 0) return "Select Leave Types";
    if (selectedTypes.length === 1) return selectedTypes[0];
    return `${selectedTypes.length} types selected`;
  };

  const clearCurrentFilters = () => {
    setCurrentFilters({
      name: '',
      type: [],
      fromDate: '',
      toDate: '',
      reason: ''
    });
  };

  const clearHistoryFilters = () => {
    setHistoryFilters({
      name: '',
      type: [],
      fromDate: '',
      toDate: '',
      reason: '',
      status: []
    });
  };


  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest('.type-filter-container') && !event.target.closest('.status-filter-container')) {
        setShowCurrentTypeDropdown(false);
        setShowHistoryTypeDropdown(false);
        setShowHistoryStatusDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <>
      <button className="logout-btn" onClick={handleLogout}>
        <span className="btn-icon">🚪</span>
        Logout
      </button>
      
      <div className="req-container">
        <span>
          <h2>{showHistory ? `Leave Request History of ${user.empName}` : `Employee Leave Requests for ${user.empName}`}</h2>
          <button
            className="history-btn"
            onClick={() => setShowHistory((prev) => !prev)}
          >
            {showHistory ? "View Current Requests" : "View History"}
          </button>
        </span>

        {/* Filter Section */}
        <div className="filter-section">
          <h3>Filters</h3>
          <div className="filter-grid">
            <input
              type="text"
              placeholder="Filter by Name"
              value={showHistory ? historyFilters.name : currentFilters.name}
              onChange={(e) => showHistory 
                ? handleHistoryFilterChange('name', e.target.value)
                : handleCurrentFilterChange('name', e.target.value)
              }
              className="filter-input"
            />
            
         
            <div className="type-filter-container" style={{ position: 'relative',left:'25px' }}>
              <button
                type="button"
                className="filter-input type-filter-button"
                onClick={() => {
                  if (showHistory) {
                    setShowHistoryTypeDropdown(!showHistoryTypeDropdown);
                    setShowCurrentTypeDropdown(false);
                  } else {
                    setShowCurrentTypeDropdown(!showCurrentTypeDropdown);
                    setShowHistoryTypeDropdown(false);
                  }
                }}
                style={{
                  textAlign: 'left',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  cursor: 'pointer',
                  backgroundColor: 'white',
                  border: '1px solid #ddd'
                }}
              >
                <span>{showHistory ? getSelectedTypesDisplay(historyFilters.type) : getSelectedTypesDisplay(currentFilters.type)}</span>
                <span>▼</span>
              </button>
              
              {((showHistory && showHistoryTypeDropdown) || (!showHistory && showCurrentTypeDropdown)) && (
                <div className="type-dropdown" style={{
                  position: 'absolute',
                  top: '100%',
                  left: 0,
                  right: 0,
                  backgroundColor: 'white',
                  border: '1px solid #ddd',
                  borderTop: 'none',
                  borderRadius: '0 0 4px 4px',
                  zIndex: 1000,
                  maxHeight: '200px',
                  overflowY: 'auto'
                }}>
                  {leaveTypes.map(type => (
                    <label
                      key={type}
                      className="type-option"
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        padding: '8px 12px',
                        cursor: 'pointer',
                        borderBottom: '1px solid #eee'
                      }}
                      onMouseEnter={(e) => e.target.style.backgroundColor = '#f5f5f5'}
                      onMouseLeave={(e) => e.target.style.backgroundColor = 'white'}
                    >
                      <input
                        type="checkbox"
                        checked={showHistory ? historyFilters.type.includes(type) : currentFilters.type.includes(type)}
                        onChange={() => handleTypeSelection(type, showHistory)}
                        style={{ marginRight: '8px' }}
                      />
                      {type}
                    </label>
                  ))}
                </div>
              )}
            </div>

            <input
              type="date"
              placeholder="From Date"
              value={showHistory ? historyFilters.fromDate : currentFilters.fromDate}
              onChange={(e) => showHistory 
                ? handleHistoryFilterChange('fromDate', e.target.value)
                : handleCurrentFilterChange('fromDate', e.target.value)
              }
              className="filter-input"
              title="Filter by From Date"
            />
            <input
              type="date"
              placeholder="To Date"
              value={showHistory ? historyFilters.toDate : currentFilters.toDate}
              onChange={(e) => showHistory 
                ? handleHistoryFilterChange('toDate', e.target.value)
                : handleCurrentFilterChange('toDate', e.target.value)
              }
              className="filter-input"
              title="Filter by To Date"
            />
            <input
              type="text"
              placeholder="Filter by Reason"
              value={showHistory ? historyFilters.reason : currentFilters.reason}
              onChange={(e) => showHistory 
                ? handleHistoryFilterChange('reason', e.target.value)
                : handleCurrentFilterChange('reason', e.target.value)
              }
              className="filter-input"
            />
            {showHistory && (
              <div className="status-filter-container" style={{ position: 'relative' }}>
                <button
                  type="button"
                  className="filter-input status-filter-button"
                  onClick={() => {
                    setShowHistoryStatusDropdown(!showHistoryStatusDropdown);
                    setShowHistoryTypeDropdown(false);
                    setShowCurrentTypeDropdown(false);
                  }}
                  style={{
                    textAlign: 'left',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    cursor: 'pointer',
                    backgroundColor: 'white',
                    border: '1px solid #ddd'
                  }}
                >
                  <span>{getSelectedStatusesDisplay(historyFilters.status)}</span>
                  <span>▼</span>
                </button>
                
                {showHistoryStatusDropdown && (
                  <div className="status-dropdown" style={{
                    position: 'absolute',
                    top: '100%',
                    left: 0,
                    right: 0,
                    backgroundColor: 'white',
                    border: '1px solid #ddd',
                    borderTop: 'none',
                    borderRadius: '0 0 4px 4px',
                    zIndex: 1000,
                    maxHeight: '200px',
                    overflowY: 'auto'
                  }}>
                    {statusOptions.map(status => (
                      <label
                        key={status}
                        className="status-option"
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          padding: '8px 12px',
                          cursor: 'pointer',
                          borderBottom: '1px solid #eee'
                        }}
                        onMouseEnter={(e) => e.target.style.backgroundColor = '#f5f5f5'}
                        onMouseLeave={(e) => e.target.style.backgroundColor = 'white'}
                      >
                        <input
                          type="checkbox"
                          checked={historyFilters.status.includes(status)}
                          onChange={() => handleStatusSelection(status, true)}
                          style={{ marginRight: '8px' }}
                        />
                        {status}
                      </label>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
          <div className="filter-actions">
            <button 
              className="clear-filters-btn" 
              onClick={showHistory ? clearHistoryFilters : clearCurrentFilters}
            >
              Clear Filters
            </button>
          </div>
        </div>

        {!showHistory ? (
          filteredRequests.length === 0 ? (
            <p className="no-data-message">
              {requests.length === 0 ? "No current leave requests." : "No requests match the current filters."}
            </p>
          ) : (
            <table className="request-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Type</th>
                  <th>From Date</th>
                  <th>To Date</th>
                  <th>Reason</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredRequests.map((req) => (
                  <tr key={req.leaveId}>
                    <td>{req.name}</td>
                    <td>{req.type}</td>
                    <td>{req.startDate}</td>
                    <td>{req.endDate}</td>
                    <td>{req.reason}</td>
                    <td style={{ position: "relative" }}>
                      <button
                        className="action-button"
                        onClick={() =>
                          setDropdownId((prev) =>
                            prev === req.leaveId ? null : req.leaveId
                          )
                        }
                      >
                        Action
                      </button>
                      {dropdownId === req.leaveId && (
                        <div className="pill-dropdown">
                          <span
                            className="pill accept-pill"
                            onClick={() => handleDecision(req, "Accepted")}
                          >
                            Accept
                          </span>
                          <span
                            className="pill reject-pill"
                            onClick={() => handleDecision(req, "Rejected")}
                          >
                            Reject
                          </span>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )
        ) : filteredHistory.length === 0 ? (
          <p className="no-data-message">
            {history.length === 0 ? "No leave history available." : "No history matches the current filters."}
          </p>
        ) : (
          <table className="history-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Type</th>
                <th>From Date</th>
                <th>To Date</th>
                <th>Reason</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {filteredHistory.map((req) => (
                <tr key={req.leaveId}>
                  <td>{req.name}</td>
                  <td>{req.type}</td>
                  <td>{req.startDate}</td>
                  <td>{req.endDate}</td>
                  <td>{req.reason}</td> 
                  <td
                    className={
                      req.status === "Accepted"
                        ? "status-pill accept"
                        : req.status === "Rejected"
                        ? "status-pill reject"
                        : "status-pill Pending"
                    }
                  >
                    {req.status}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </>
  );
}

export default LeaveRequests;