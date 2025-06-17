package com.example.backend.repository;

import com.example.backend.dto.EmpManDTO;
import com.example.backend.model.Employee;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface EmployeeRepository extends JpaRepository<Employee, Long> {
    Optional<Employee> findByEmailAndPassword(String email, String password);

    @Query("SELECT e.empId, e.empName, e.email, e2.empId, e2.empName, e2.email " +
            "FROM Employee e " +
            "LEFT JOIN ManagerEmpMap m on e.empId=m.empId " +
            "LEFT JOIN Employee e2 on e2.empId = m.manId")
    List<EmpManDTO> findAllEmployeesWithManagers();



    Employee findByEmpId(Long empId);

    void deleteByEmpId(Long empId);

    Optional<Employee> findByEmail(String email);

}