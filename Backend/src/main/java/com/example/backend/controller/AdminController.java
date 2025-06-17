package com.example.backend.controller;

import com.example.backend.dto.EmpManDTO;
import com.example.backend.model.Employee;
import com.example.backend.model.ManagerEmpMap;
import com.example.backend.service.AdminService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@CrossOrigin(origins = "http://localhost:5173")
@RestController
@RequestMapping("/api/admin")
public class AdminController {


    @Autowired
    private AdminService adminService;

    @GetMapping("/fetch")
    public ResponseEntity<List<EmpManDTO>> getAllEmployees() {
        return ResponseEntity.ok(adminService.getAllEmployees());
    }


    //Use service layer
    //Serialization and deserialization
    @PostMapping("/create")
    public ResponseEntity<Map<String, Object>> createEmployee(@RequestBody Map<String, String> empData) { //Add validation
        try {
            Map<String, Object> result = adminService.createEmployee(empData);
            return ResponseEntity.ok(result);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body(Map.of("error", e.getMessage()));
        }
    }

    @PutMapping("/update/{empID}")
    public ResponseEntity<Employee> editEmployee(@PathVariable long empID, @RequestBody Map<String, String> empData) {
        return ResponseEntity.ok(adminService.editEmployee(empID, empData));
    }

    @GetMapping("/all-managers")
    public ResponseEntity<List<Employee>> getAllManagers() {
        return ResponseEntity.ok(adminService.getAllManagers());
    }

    @PutMapping("/update/{empId}/{manId}")
    public ResponseEntity<ManagerEmpMap> updateMangager(@PathVariable long empId, @PathVariable long manId){
        try {
            return ResponseEntity.ok(adminService.updateManager(empId, manId));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @DeleteMapping("delete/{empId}")
    public ResponseEntity<Object> deleteEmployee(@PathVariable long empId) {
        try{
            return ResponseEntity.ok(adminService.deleteEmployee(empId));
        }
        catch (Exception e){
            return ResponseEntity.status(HttpStatus.CONFLICT).body(e.getMessage());
        }

    }


}
