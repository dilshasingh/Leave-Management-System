import React, { useState, useEffect } from "react";
import "../styles/LeaveForm.css";
import axios from "axios";

function LeaveForm() {
  const [formData, setFormData] = useState({
    type: "",
    startDate: "",
    endDate: "",
    reason: "",
    proof: ""
  });
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const user = JSON.parse(sessionStorage.getItem("user"));

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const leaveData = {
      empId: user.empId,
      type: formData.type,
      startDate: formData.startDate,
      endDate: formData.endDate,
      reason: formData.reason,
    };

    try {
      const response = await axios.post("http://localhost:8080/api/leave", leaveData);
      console.log("Submitted successfully:", response.data);
      setShowSuccessModal(true);
      setFormData({
        type: "",
        startDate: "",
        endDate: "",
        reason: "",
        proof: ""
      });
    } catch (error) {
      console.error("Cannot submit:", error.response?.data || error.message);
      setErrorMessage(error.response?.data?.message || "Failed to submit leave request");
    }
  };

  useEffect(() => {
    if (showSuccessModal) {
      window.alert("Leave Request Submitted Successfully!\nYour leave request has been submitted for approval.");
      setShowSuccessModal(false); 
    }
  }, [showSuccessModal]);

  useEffect(() => {
    if (errorMessage) {
      window.alert(`Submission Failed: ${errorMessage}`);
      setErrorMessage(""); 
    }
  }, [errorMessage]);

  return (
    <div className="container">
     
      <form className="leave-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="leaveType">Leave Type</label>
          <select
            id="leaveType"
            name="type"
            value={formData.type}
            onChange={handleChange}
            required
          >
            <option value="">Select leave type</option>
            <option value="vacation">Vacation</option>
            <option value="sick">Sick Leave</option>
            <option value="personal">Personal</option>
          </select>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="startDate">Start Date</label>
            <input
              type="date"
              id="startDate"
              name="startDate"
              value={formData.startDate}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="endDate">End Date</label>
            <input
              type="date"
              id="endDate"
              name="endDate"
              value={formData.endDate}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="reason">Reason</label>
          <textarea
            id="reason"
            name="reason"
            value={formData.reason}
            onChange={handleChange}
            rows="3"
            required
          />
        </div>

        <button type="submit" className="submit-btn">
          Submit Leave Request
        </button>
      </form>
    </div>
  );
}

export default LeaveForm;
