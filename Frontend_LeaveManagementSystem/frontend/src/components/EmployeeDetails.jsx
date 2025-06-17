import React from "react";
import "../styles/LeaveStats.css";
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
} from "recharts";

const COLORS = ["#0088FE", "#00C49F", "#FFBB28"];

const LeaveStats = () => {
  const leaveTypeData = [
    { name: "Sick", value: 5 },
    { name: "Casual", value: 3 },
    { name: "Paid", value: 2 },
  ];

  const monthlyLeavesData = [
    { month: "Jan", leaves: 1 },
    { month: "Feb", leaves: 2 },
    { month: "Mar", leaves: 1 },
    { month: "Apr", leaves: 3 },
    { month: "May", leaves: 2 },
    { month: "Jun", leaves: 1 },
  ];

  const trendData = [...monthlyLeavesData];

  const balanceData = [
    { name: "Taken", value: 10 },
    { name: "Remaining", value: 20 },
  ];

  return (
    <div className="stats-container">
      <h2>Leave Statistics for John Doe</h2>

      
      <div className="summary">
        <div className="summary-item">Total Leaves Taken: <b>10</b></div>
        <div className="summary-item">Total Leaves Allowed: <b>30</b></div>
        <div className="summary-item">Remaining Leaves: <b>20</b></div>
      </div>

      {/* Charts Row */}
      <div className="charts-wrapper">
        <div className="chart-container">
          <h3>Leave Type Distribution</h3>
          <PieChart width={300} height={300}>
            <Pie
              data={leaveTypeData}
              dataKey="value"
              cx="50%"
              cy="50%"
              outerRadius={100}
              label
            >
              {leaveTypeData.map((entry, index) => (
                <Cell key={entry.name} fill={COLORS[index % COLORS.length]} />
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
            <Bar dataKey="leaves" fill="#8884d8" />
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
            <Line type="monotone" dataKey="leaves" stroke="#00C49F" />
          </LineChart>
        </div>

        <div className="chart-container">
          <h3>Leave Balance</h3>
          <RadialBarChart
            width={300}
            height={300}
            cx="50%"
            cy="50%"
            innerRadius="10%"
            outerRadius="80%"
            data={balanceData}
            startAngle={180}
            endAngle={0}
          >
            <RadialBar
              minAngle={15}
              label={{ position: "insideStart", fill: "#fff" }}
              background
              clockWise
              dataKey="value"
            />
            <Legend iconSize={10} layout="horizontal" verticalAlign="bottom" />
            <Tooltip />
          </RadialBarChart>
        </div>
      </div>
    </div>
  );
};

export default LeaveStats;
