import React, { useState, useEffect } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import "../styles/CalendarView.css";
import axios from "axios";
import {useNavigate} from 'react-router-dom';
const leaveColors = {
  sick: "sick-day",
  vacation: "casual-day",
  personal:"paid-day"
};

function isSameDay(date1, date2) {
  return (
    date1.getFullYear() === date2.getFullYear() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getDate() === date2.getDate()
  );
}

function CalendarView() {
  const navigate = useNavigate();
  const [value, setValue] = useState(new Date());
  const [leaveData, setLeaveData] = useState([]);
  const user = JSON.parse(sessionStorage.getItem("user"));

  
    useEffect(() => {
    const fetchLeaveCount = async () => {
      try {
        const response = await axios.get(`http://localhost:8080/api/leave/type-dates/${user.empId}`);
        setLeaveData(response.data); 
        console.log(response.data);
      } catch (error) {
        console.error("Failed to fetch leave count:", error);
      }
    };

    if (user?.empId) {
      fetchLeaveCount();
    }
  }, [user?.empId]);

  const tileClassName = ({ date, view }) => {
    if (view === "month") {
      for (const leave of leaveData) {
        for (const leaveDate of leave.dates) {
          const parsedDate = new Date(leaveDate);
          if (isSameDay(parsedDate, date)) {
            return leaveColors[leave.name] || "default-leave";
          }
        }
      }
    }
    return null;
  };

    const handleLogout = () => {
    sessionStorage.removeItem("user");
    sessionStorage.clear(); 
    navigate("/");   
  };


  return (
    <div style={{ textAlign: "center", padding: "20px" }} className="container">
      <button className="logout-btn" onClick={handleLogout}>
                <span className="btn-icon">🚪</span>
                Logout
              </button>
      <h2 className = "head-calen" style={{ color: "#6a1b9a"}}>Leave Calendar</h2>
      <Calendar
        className="custom-calendar"
        onChange={setValue}
        value={value}
        tileClassName={tileClassName}
      />

      <div className="legend">
        {Object.entries(leaveColors).map(([key, className]) => (
          <div className="legend-item" key={key}>
            <span className={`legend-dot ${className}`}></span> {key.charAt(0).toUpperCase() + key.slice(1)} Leave
          </div>
        ))}
        <div className="legend-item">
          <span className="legend-dot legend-today"></span> Today
        </div>
      </div>
    </div>
  );
}

export default CalendarView;
