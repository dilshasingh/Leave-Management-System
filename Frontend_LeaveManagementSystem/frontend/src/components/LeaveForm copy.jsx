import React, { useState } from "react";
import "../styles/LeaveForm.css";

function LeaveForm() {
  const [file,setFile]=useState("");
  const [formData, setFormData] = useState({
    type: "",
    startDate: "",
    endDate: "",
    reason: "",
    
  });
const user = JSON.parse(sessionStorage.getItem("user"));

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    const formData = new FormData();
  // Append the JSON as a Blob
  const leaveBlob = new Blob([JSON.stringify(leaveData)], {
    type: 'application/json'
  });
  console.log("after blob");
  formData.append('leave', leaveBlob);
  console.log("before filee");
  // Append the file if it exists
  if (file) {
    console.log("fileee");
    formData.append('proof', file);
  }
  try {
    const response = await axios.post('/api/leave', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    console.log('Leave submitted:', response.data);
  } catch (error) {
    console.error('Error submitting leave:', error);
  }
};



  

  return (
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

      
      <div className="form-row">
        <div className="form-group">
          <label htmlFor="file">Enter Proof</label>
          <input
            type="file"
            id="proof"
            name="proof"
           
            value={formData.proof}
            onChange={(e)=>setFile(e.target.files[0])}
            
          />
        </div>
        </div>

      <button type="submit" className="submit-btn">
        Submit Leave Request
      </button>
    </form>
  );
}

export default LeaveForm;