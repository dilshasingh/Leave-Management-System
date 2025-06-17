package com.example.backend.model;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@IdClass(ManagerEmpId.class)
@Table(name = "manager_emp_map")
public class ManagerEmpMap {
    @Id
    private Long manId;

    @Id
    private Long empId;
}
