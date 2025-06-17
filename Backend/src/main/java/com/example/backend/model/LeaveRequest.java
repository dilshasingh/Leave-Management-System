// LeaveRequest.java
package com.example.backend.model;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "leave_requests")
public class LeaveRequest {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long leaveId;

    private Long empId;
    private String type;
    private String startDate;
    private String endDate;
    private String reason;
    private String proof;
    private String status = "Pending";

}
