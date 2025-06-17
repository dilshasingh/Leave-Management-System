package com.example.backend.service;

import com.example.backend.model.LeaveRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;

import java.util.List;
import java.util.Map;

public interface LeaveService {
    LeaveRequest submitLeave(LeaveRequest request);
    List<LeaveRequest> getOwnHistory(Long empId);
    List<Map<String, Object>> getManagerRequests(Long manId) ;
    List<Map<String, Object>> getPendingManagerRequests(Long manId);
    LeaveRequest updateLeaveStatus(Long leaveId, String status);
    int getLeaveCount(Long empId);
    List<Map<String, Object>> getMonthlyLeaveCount(Long empId);
    List<Map<String, Object>>  getLeaveTypeCounts(Long empId);
    List<Map<String, Object>> getLeaveTypeDates(Long empId);
    List<Map<String, Object>> getLeaveStatusCount(Long empId);
}
