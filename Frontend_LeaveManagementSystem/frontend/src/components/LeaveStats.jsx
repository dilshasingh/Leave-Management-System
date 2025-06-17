import React from "react";
import "../styles/LeaveStats.css";
import {useState,useEffect} from "react";
import axios from "axios";
import {useNavigate} from 'react-router-dom';
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  LineChart,
  Line,
  RadialBarChart,
  RadialBar,
  ResponsiveContainer
} from "recharts";


const LeaveStats = () => {

  //   { name: "Sick", value: 5 },
  //   { name: "Casual", value: 3 },
  //   { name: "Paid", value: 2 },
  // ];

  const COLORS = ["#0088FE", "#00C49F", "#FFBB28"];
const [leaveTypeData, setleaveTypeData]=useState([]);
const [monthlyLeavesData, setmonthlyLeavesData]=useState([]);
const [chartData, setChartData] = useState([]);
const user = JSON.parse(sessionStorage.getItem("user"));
const navigate = useNavigate();
console.log(user);
 useEffect(() => {
    const fetchLeaveCount = async () => {
      try {
        const response = await axios.get(`http://localhost:8080/api/leave/type-count/${user.empId}`);
        console.log(user.empId);
        console.log("API response:", response.data);
        setleaveTypeData(response.data); 
      } catch (error) {
        console.error("Failed to fetch leave count:", error);
      }
    };


    if (user?.empId) {
      fetchLeaveCount();
      fetchTotalCount();
      fetchMonthLeaves();
      fetchstatus();
    }
  }, [user?.empId]);


  const fetchTotalCount = async () => {
      try {
        const response = await axios.get(`http://localhost:8080/api/leave/count/${user.empId}`);
        console.log(user.empId);
        console.log("API response:", response.data);
        setTotalLeaves(response.data); 
      } catch (error) {
        console.error("Failed to fetch leave count:", error);
      }
    };

    const fetchMonthLeaves = async () => {
      try {
        const response = await axios.get(`http://localhost:8080/api/leave/monthwise/${user.empId}`);
        console.log(user.empId);
        console.log("MOnth response:", response.data);
        setmonthlyLeavesData(response.data);
      } catch (error) {
        console.error("Failed to fetch leave count:", error);
      }
    };

    const fetchstatus = async () => {
      try {
        const response = await axios.get(`http://localhost:8080/api/leave/status-count/${user.empId}`);
        console.log(user.empId);
        console.log("MOnth response:", response.data);
        setChartData(response.data); 
      } catch (error) {
        console.error("Failed to fetch leave count:", error);
      }
    };


  const [totalLeaves, setTotalLeaves]  = useState(0);


  const trendData = [...monthlyLeavesData];

  const balanceData = [
    { name: "Taken", value: totalLeaves },
    { name: "Remaining", value: 30-totalLeaves },
  ];

    const handleLogout = () => {
    sessionStorage.removeItem("user");
    sessionStorage.clear(); 
    navigate("/");   
  };

  return (
   <>
   
              <button className="logout-btn" onClick={handleLogout}>
                <span className="btn-icon">🚪</span>
                Logout
              </button>
    <div className="stats-container">
        

      <div className="center-head">
      <h2>Leave Statistics for {user.empName}</h2>

      
      <div className="summary">
        <div className="summary-item">Total Leaves Taken: <b>{totalLeaves}</b></div>
        <div className="summary-item">Total Leaves Allowed: <b>30</b></div>
        <div className="summary-item">Remaining Leaves: <b>{30-totalLeaves}</b></div>
      </div>

</div>
      
      <div className="charts-wrapper">
     

        <div className="chart-container">
        <h3>Leave Type Distribution</h3>
        <PieChart width={300} height={300}>
          <Pie
            data={leaveTypeData}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="50%"
            outerRadius={100}
            label
          >
            {leaveTypeData.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={COLORS[index % COLORS.length]}
              />
            ))}
          </Pie>
          <Tooltip />
          <Legend />
        </PieChart>
      </div>

        <div className="chart-container">
          <h3>Monthly Leaves Taken</h3>
          <BarChart width={300} height={300} data={monthlyLeavesData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="count" fill="#8884d8" />
          </BarChart>
        </div>

        <div className="chart-container">
          <h3>Leave Trend (Last 6 Months)</h3>
          <LineChart width={300} height={300} data={trendData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="count" stroke="#00C49F" />
          </LineChart>
        </div>

        <div className="chart-container">
          <h3>Leave Request Distribution</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart
              data={chartData}
              margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="status" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="value" fill="#8884d8" name="Count" />
            </BarChart>
          </ResponsiveContainer>
        </div>

      </div>
    </div>
    </>
  );
};

export default LeaveStats;
