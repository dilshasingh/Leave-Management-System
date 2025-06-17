package com.example.backend.service.impl;

import com.example.backend.dto.EmpManDTO;
import com.example.backend.model.Employee;
import com.example.backend.model.ManagerEmpMap;
import com.example.backend.repository.EmployeeRepository;
import com.example.backend.repository.LeaveRequestRepository;
import com.example.backend.repository.ManagerEmpMapRepository;
import com.example.backend.service.AdminService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;

@Service
public class AdminServiceImpl implements AdminService {

    @Autowired
    private EmployeeRepository empRepo;

    @Autowired
    private ManagerEmpMapRepository manEmpMapRepo;

    @Autowired
    private LeaveRequestRepository leaveRepo;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Override
    public List<EmpManDTO> getAllEmployees() {
        List<EmpManDTO> res = empRepo.findAllEmployeesWithManagers();
//        List<Map<String, Object>> result = new ArrayList<>();
//
//        for (Object[] row : res) {
//            Long empId = (Long) row[0];
//            String empName = (String) row[1];
//            String email = (String) row[2];
//
//            Long manId = (Long) row[3];
//            String manName = (String) row[4];
//            String manEmail = (String) row[5];
//
//            // Use a POJO/DTO/Model
//            Map<String, Object> emp = new HashMap<>();
//            emp.put("empId", empId);
//            emp.put("empName", empName);
//            emp.put("email", email);
//            emp.put("manId", manId);
//            emp.put("manName", manName);
//            emp.put("manEmail", manEmail);
//            result.add(emp);
//
//        }

        return res;
    }

    @Override
    public Map<String, Object> createEmployee(Map<String, String> empData) {
        Optional<Employee> e = empRepo.findByEmail(empData.get("email"));
        if(e.isPresent()) {
            throw new RuntimeException("Employee with this email already exists.");

        }

        Employee emp = new Employee();
        emp.setEmpName(empData.get("empName"));
        emp.setEmail(empData.get("email"));
//        System.out.println(empData.get("password"));
//        System.out.println(passwordEncoder.encode(empData.get("password")));
        emp.setPassword(passwordEncoder.encode(empData.get("password")));
        empRepo.save(emp);

        Long managerId = Long.parseLong(empData.get("managerId"));
        ManagerEmpMap map = new ManagerEmpMap(managerId, emp.getEmpId());
        manEmpMapRepo.save(map);

        Map<String, Object> result = new HashMap<>();
        result.put("empId", emp.getEmpId());
        result.put("empName", emp.getEmpName());
        result.put("email", emp.getEmail());
//        result.put("password", emp.getPassword());
        result.put("managerId", managerId);
        return result;
    }

    @Override
    public Employee editEmployee(long empID, Map<String, String> empData) {
        Employee emp = empRepo.findByEmpId(empID);

        //        System.out.println(emp);
        //        System.out.println(empData);
        emp.setEmpName(empData.get("empName"));
        emp.setEmail(empData.get("email"));
        empRepo.save(emp);

        return emp;
    }

    @Override
    public List<Employee> getAllManagers() {
        return empRepo.findAll();
    }

    @Override
    public ManagerEmpMap updateManager(long empId, long manId) {
        ManagerEmpMap existingMap = manEmpMapRepo.findByEmpId(empId);
        if (existingMap != null) {
            manEmpMapRepo.delete(existingMap);
        }
        ManagerEmpMap newMap = new ManagerEmpMap(manId, empId);
        return manEmpMapRepo.save(newMap);
    }

    @Override
    @Transactional
    public Object deleteEmployee(long empId) {
        List<ManagerEmpMap> sub =  manEmpMapRepo.findByManId(empId);
        if(!sub.isEmpty()){
            throw new RuntimeException("Cannot delete employee. They are a manager with assigned subordinates");
//            return "Cannot delete employee. They are a manager with assigned subordinates.";
        }
//        System.out.println(empId);
//        System.out.println("user");
//        System.out.println(empRepo.findByEmpId(empId));

        leaveRepo.deleteAllByEmpId(empId);
        manEmpMapRepo.deleteAllByEmpId(empId);
        empRepo.deleteByEmpId(empId);
        return "Deleted Successfully";
    }
}
