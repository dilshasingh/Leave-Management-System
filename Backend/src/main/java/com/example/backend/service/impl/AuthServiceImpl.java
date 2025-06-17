package com.example.backend.service.impl;

import com.example.backend.model.Employee;
import com.example.backend.repository.EmployeeRepository;
import com.example.backend.service.AuthService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Map;
import java.util.Optional;

@Service
public class AuthServiceImpl implements AuthService {
    @Autowired
    private EmployeeRepository empRepo;

    @Autowired
    private PasswordEncoder passwordEncoder;

    private static final String ADMIN_EMAIL = "admin@rl.com";
    private static final String ADMIN_PASSWORD = "admin123";


    @Override
    public Map<String, Object> login(String email, String password) {
        if (ADMIN_EMAIL.equals(email) && ADMIN_PASSWORD.equals(password)) {
            return Map.of(
                    "empId", 0,
                    "empName", "Admin",
                    "email", email,
                    "role", "ADMIN"
            );
        }

        Optional<Employee> opt = empRepo.findByEmail(email);
        if (opt.isPresent() && passwordEncoder.matches(password, opt.get().getPassword())) {
            Employee emp = opt.get();
            return Map.of(
                    "empId", emp.getEmpId(),
                    "empName", emp.getEmpName(),
                    "email", emp.getEmail(),
                    "role", "EMPLOYEE"
            );
        } else {
            throw new RuntimeException("Invalid credentials");
        }
    }
}
