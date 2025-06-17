import React, { useState, useEffect } from 'react';
import '../styles/AdminView.css';
import axios from "axios";
import { useNavigate } from "react-router-dom"; 

function AdminView() {
  const [employees, setEmployees] = useState([]);
  const [filteredEmployees, setFilteredEmployees] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isUpdateManagerModalOpen, setIsUpdateManagerModalOpen] = useState(false);
  const [currentEmployee, setCurrentEmployee] = useState(null);
  const [newEmployee, setNewEmployee] = useState({ 
    empName: '', 
    email: '', 
    password: '',
    managerId: '' 
  });

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [employeesPerPage, setEmployeesPerPage] = useState(5);

  const [managers, setManagers] = useState([]);
  const [selectedManagerId, setSelectedManagerId] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const term = (searchTerm || "").toLowerCase();
    
    if (term === "") {
      setFilteredEmployees(employees);
    } else {
      const filtered = employees.filter(emp =>
        emp.empName?.toLowerCase().includes(term) ||
        emp.empId?.toString().toLowerCase().includes(term) ||
        emp.email?.toLowerCase().includes(term) ||
        emp.manId?.toString().toLowerCase().includes(term) ||
        emp.manEmail?.toLowerCase().includes(term) ||
        emp.manName?.toLowerCase().includes(term)
      );
      setFilteredEmployees(filtered);
    }

    setCurrentPage(1);
  }, [searchTerm, employees]);

  const totalEmployees = filteredEmployees.length;
  const totalPages = Math.ceil(totalEmployees / employeesPerPage);
  const startIndex = (currentPage - 1) * employeesPerPage;
  const endIndex = startIndex + employeesPerPage;
  const currentEmployees = filteredEmployees.slice(startIndex, endIndex);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handleEmployeesPerPageChange = (e) => {
    setEmployeesPerPage(parseInt(e.target.value));
    setCurrentPage(1);
  };

  //  page numbers for pagination
  const getPageNumbers = () => {
    const pageNumbers = [];
    const maxVisiblePages = 5;
    
    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i);
      }
    } else {
      const startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
      const endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
      
      if (startPage > 1) {
        pageNumbers.push(1);
        if (startPage > 2) pageNumbers.push('...');
      }
      
      for (let i = startPage; i <= endPage; i++) {
        pageNumbers.push(i);
      }
      
      if (endPage < totalPages) {
        if (endPage < totalPages - 1) pageNumbers.push('...');
        pageNumbers.push(totalPages);
      }
    }
    
    return pageNumbers;
  };

  const fetchManagers = async () => {
    try {
      const fetchMan = await axios.get("http://localhost:8080/api/admin/all-managers");
      setManagers(fetchMan.data);
    } catch (error) {
      console.log(error);
    }
  }
    
  useEffect(() => {
    fetchManagers();
  }, []);

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewEmployee({ ...newEmployee, [name]: value });
  };

  // Add new employee
  const handleAddEmployee = async () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(newEmployee.email)) {
      alert("Please enter a valid email address.");
      return;
    }
    try {
      const fetchMan = await axios.get("http://localhost:8080/api/admin/all-managers");
      setManagers(fetchMan.data);
      console.log(newEmployee);
      const res = await axios.post("http://localhost:8080/api/admin/create", newEmployee);
      fetchUsers();
      setIsAddModalOpen(false);
    } catch (error) {
      console.log(error);
    }
  };

  // Edit employee
  const handleEditEmployee = async () => {
    try {
      console.log("currnt");
      console.log(currentEmployee);
      const res = await axios.put(`http://localhost:8080/api/admin/update/${currentEmployee.empId}`, currentEmployee);
    } catch (error) {
      console.log(error)
    }
    fetchUsers();
    setIsEditModalOpen(false);
  }

  // Delete employee
  const handleDeleteEmployee = async () => {
    try {
      const res = await axios.delete(`http://localhost:8080/api/admin/delete/${currentEmployee.empId}`);
      fetchUsers(); 
      fetchManagers();
      setIsDeleteModalOpen(false);
    } catch (error) {

      if (error.response && error.response.status === 409) {
        window.alert("Cannot delete employee who is a manager");
      } else {
        console.error("Error deleting employee:", error);
        window.alert("An error occurred while deleting the employee.");
      }
      setIsDeleteModalOpen(false);
    }
  };

  // Update manager
  const handleUpdateManager = async () => {
    if (currentEmployee && selectedManagerId) {
      const res = await axios.put(`http://localhost:8080/api/admin/update/${currentEmployee.empId}/${selectedManagerId}`);
      fetchUsers();
      setIsUpdateManagerModalOpen(false);
    }
  };

  const openEditModal = (employee) => {
    setCurrentEmployee(employee);
    setIsEditModalOpen(true);
  };

  const openDeleteModal = (employee) => {
    setCurrentEmployee(employee);
    setIsDeleteModalOpen(true);
  };

  const openUpdateManagerModal = (employee) => {
    setCurrentEmployee(employee);
    setSelectedManagerId(employee.manId || '');
    setIsUpdateManagerModalOpen(true);
  };
  
  const fetchUsers = async () => {
    try {
      const response = await axios.get(`http://localhost:8080/api/admin/fetch`);
      setEmployees(response.data); 
      console.log(response.data);
    } catch (error) {
      console.error("Failed to fetch data:", error);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleLogout = () => {
    sessionStorage.removeItem("user");
    sessionStorage.clear(); 
    navigate("/");   
  };

  return (
    <div className="app">
      {/* Sidebar */}
      <div className="sidebar">
        <div className="logo">Admin Portal</div>
        <ul>
          <li className="active">Home</li>
     
        </ul>
      </div>

      
      <div className="main-content">
        <button className="logout-btn" onClick={handleLogout}>
          <span className="btn-icon">🚪</span>
          Logout
        </button>
        <div className="central-content">
          
          <div className="header">
            <input 
              id="search-input"
              type="text"
              placeholder="Search employees..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <button className="add-button" onClick={() => setIsAddModalOpen(true)}>
              + Add Employee
            </button>
          </div>

          {/* Pagination Controls Top */}
          <div className="pagination-controls-top">
            <div className="pagination-info">
              Showing {startIndex + 1} to {Math.min(endIndex, totalEmployees)} of {totalEmployees} employees
            </div>
            <div className="entries-per-page">
              <label>Show </label>
              <select value={employeesPerPage} onChange={handleEmployeesPerPageChange}>
                <option value={5}>5</option>
                <option value={10}>10</option>
                <option value={25}>25</option>
                <option value={50}>50</option>
                <option value={100}>100</option>
              </select>
              <label> entries</label>
            </div>
          </div>

          {/* Employee Table */}
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Employee ID</th>
                  <th>Email</th>
                  <th>Manager ID</th>
                  <th>Manager Name</th>
                  <th>Manager Email</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {currentEmployees.map(employee => (
                  <tr key={employee.empId}>
                    <td>{employee.empName}</td>
                    <td>{employee.empId}</td>
                    <td>{employee.email}</td>
                    <td>{employee.manId || 'N/A'}</td>
                    <td>{employee.manName || 'N/A'}</td>
                    <td>{employee.manEmail || 'N/A'}</td>
                    <td className="actions">
                      <button className="edit-btn" onClick={() => openEditModal(employee)}>
                        Edit
                      </button>
                      <button className="update-manager-btn" onClick={() => openUpdateManagerModal(employee)}>
                        Update Manager
                      </button>
                      <button className="delete-btn" onClick={() => openDeleteModal(employee)}>
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
                {currentEmployees.length === 0 && (
                  <tr>
                    <td colSpan="7" className="no-data">
                      {searchTerm ? 'No employees found matching your search.' : 'No employees found.'}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination Controls Bottom */}
          {totalPages > 1 && (
            <div className="pagination-controls">
              <button 
                className="pagination-btn" 
                onClick={handlePreviousPage}
                disabled={currentPage === 1}
              >
                Previous
              </button>
              
              <div className="pagination-numbers">
                {getPageNumbers().map((pageNum, index) => (
                  <span key={index}>
                    {pageNum === '...' ? (
                      <span className="pagination-ellipsis">...</span>
                    ) : (
                      <button
                        className={`pagination-number ${currentPage === pageNum ? 'active' : ''}`}
                        onClick={() => handlePageChange(pageNum)}
                      >
                        {pageNum}
                      </button>
                    )}
                  </span>
                ))}
              </div>
              
              <button 
                className="pagination-btn" 
                onClick={handleNextPage}
                disabled={currentPage === totalPages}
              >
                Next
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Add Employee Modal */}
      {isAddModalOpen && (
        <div className="modal">
          <div className="modal-content">
            <h2>Add New Employee</h2>
            <div className="form-group">
              <label className='admin-label'>Name</label>
              <input 
                type="text" 
                name="empName"
                value={newEmployee.empName}
                onChange={handleInputChange}
              />
            </div>
            <div className="form-group">
              <label className='admin-label'>Email</label>
              <input 
                type="email" 
                name="email"
                value={newEmployee.email}
                onChange={handleInputChange}
              />
            </div>
            <div className="form-group">
              <label className='admin-label'>Password</label>
              <input 
                type="password" 
                name="password"
                value={newEmployee.password}
                onChange={handleInputChange}
              />
            </div>
            <div className="form-group">
              <label className='admin-label'>Manager</label>
              <select
                name="managerId"
                value={newEmployee.managerId}
                onChange={handleInputChange}
                style={{ color: 'black' }}
              >
                <option value="">Select Manager</option>
                {managers.map(manager => (
                  <option key={manager.empId} value={manager.empId}>
                    {manager.empName} (ID: {manager.empId})
                  </option>
                ))}
              </select>
            </div>
            <div className="modal-actions">
              <button onClick={() => setIsAddModalOpen(false)}>Cancel</button>
              <button className="save-btn" onClick={handleAddEmployee}>Save</button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Employee Modal */}
      {isEditModalOpen && currentEmployee && (
        <div className="modal">
          <div className="modal-content">
            <h2>Edit Employee</h2>
            <div className="form-group">
              <label className='admin-label'>Name</label>
              <input 
                type="text" 
                value={currentEmployee.empName}
                onChange={(e) => setCurrentEmployee({...currentEmployee, empName: e.target.value})}
              />
            </div>
            <div className="form-group">
              <label className='admin-label'>Email</label>
              <input 
                type="email" 
                value={currentEmployee.email}
                onChange={(e) => setCurrentEmployee({...currentEmployee, email: e.target.value})}
              />
            </div>
            <div className="modal-actions">
              <button onClick={() => setIsEditModalOpen(false)}>Cancel</button>
              <button className="save-btn" onClick={handleEditEmployee}>Update</button>
            </div>
          </div>
        </div>
      )}

      {/* Update Manager Modal */}
      {isUpdateManagerModalOpen && currentEmployee && (
        <div className="modal">
          <div className="modal-content">
            <h2>Update Manager for {currentEmployee.empName}</h2>
            <div className="form-group">
              <label className="man-label">Select Manager</label>
              <select
                value={selectedManagerId}
                onChange={(e) => setSelectedManagerId(e.target.value)}
                style={{ color: 'black' }}
              >
                <option value="">Select Manager</option>
                {managers.map(manager => (
                  <option key={manager.empId} value={manager.empId}>
                    {manager.empName} (ID: {manager.empId})
                  </option>
                ))}
              </select>
            </div>
            <div className="modal-actions">
              <button onClick={() => setIsUpdateManagerModalOpen(false)}>Cancel</button>
              <button className="save-btn" onClick={handleUpdateManager}>Update</button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {isDeleteModalOpen && currentEmployee && (
        <div className="modal">
          <div className="modal-content">
            <h2>Confirm Deletion</h2>
            <p>Are you sure you want to delete {currentEmployee.empName}?</p>
            <div className="modal-actions">
              <button onClick={() => setIsDeleteModalOpen(false)}>Cancel</button>
              <button className="delete-btn" onClick={handleDeleteEmployee}>Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminView;