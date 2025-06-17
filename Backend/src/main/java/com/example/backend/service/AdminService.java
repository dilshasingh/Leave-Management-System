package com.example.backend.service;

import com.example.backend.dto.EmpManDTO;
import com.example.backend.model.Employee;
import com.example.backend.model.ManagerEmpMap;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;

import java.util.List;
import java.util.Map;

public interface AdminService {
     List<EmpManDTO> getAllEmployees();
     Map<String, Object> createEmployee(Map<String, String> empData);
     Employee editEmployee( long empID,  Map<String, String> empData);
     List<Employee> getAllManagers();
     ManagerEmpMap updateManager(long empId, long manId);
     Object deleteEmployee (long empId);
}
