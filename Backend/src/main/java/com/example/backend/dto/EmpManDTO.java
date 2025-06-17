package com.example.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class EmpManDTO {
    private Long empId;
    private String empName;
    private String email;
    private Long manID;
    private String manName;
    private String manEmail;
}
