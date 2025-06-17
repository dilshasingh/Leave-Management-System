package com.example.backend.model;

import lombok.*;

import java.io.Serializable;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ManagerEmpId implements Serializable {
    private Long manId;
    private Long empId;
}