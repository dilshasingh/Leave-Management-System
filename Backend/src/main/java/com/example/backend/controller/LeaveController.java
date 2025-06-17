package com.example.backend.controller;

import com.example.backend.model.*;
import com.example.backend.service.LeaveService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;


import java.util.*;

@CrossOrigin(origins = "http://localhost:5173")
@RestController
@RequestMapping("/api")
public class LeaveController {

    @Autowired
    private LeaveService leaveService;


    @PostMapping("/leave")
    public ResponseEntity<LeaveRequest> submitLeave(@RequestBody LeaveRequest request) {
        return ResponseEntity.ok(leaveService.submitLeave(request));
    }

//    @PostMapping(value = "/leave", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
//    public LeaveRequest submitLeave(
//            @RequestPart("leave") LeaveRequest request,
//            @RequestPart(value = "proof", required = false) MultipartFile proofFile
//    ) throws IOException {
//        if (proofFile != null && !proofFile.isEmpty()) {
//            request.setProof(proofFile.getBytes());
//        } else {
//            request.setProof(null);
//        }
//        request.setStatus("pending");
//        return leaveRepo.save(request);
//    }



    @GetMapping("/leave/history/{empId}")
    public ResponseEntity<List<LeaveRequest>> getOwnHistory(@PathVariable Long empId) {
        return ResponseEntity.ok(leaveService.getOwnHistory(empId));
    }

    @GetMapping("/leave/requests/{manId}")
    public ResponseEntity<List<Map<String, Object>>> getManagerRequests(@PathVariable Long manId) {
        return ResponseEntity.ok(leaveService.getManagerRequests(manId));
    }

    @GetMapping("/leave/requests/pending/{manId}")
    public ResponseEntity<List<Map<String, Object>>> getPendingManagerRequests(@PathVariable Long manId) {
        return ResponseEntity.ok(leaveService.getPendingManagerRequests(manId));

    }

//    @GetMapping("/leave/requests/pending/{manId}")
//    public List<Object[]> getPendingManagerRequests(@PathVariable Long manId) {
//        List<Long> empIds = mapRepo.findEmpIdsByManId(manId);
//        return leaveRepo.findPendingByEmpIds(empIds);
//    }



    @PutMapping("/leave/status/{leaveId}")
    public ResponseEntity<LeaveRequest> updateLeaveStatus(@PathVariable Long leaveId, @RequestParam String status) {
        return ResponseEntity.ok(leaveService.updateLeaveStatus(leaveId, status));
    }

//    @GetMapping("leave/count/{empId}")
//    public int getLeaveCount(@PathVariable Long empId) {
//        long count = leaveRepo.countAcceptedByEmpId(empId);
//        return (int) count;
//    }

    @GetMapping("leave/count/{empId}")
    public int getLeaveCount(@PathVariable Long empId) {
        return leaveService.getLeaveCount(empId);
    }

    @GetMapping("leave/monthwise/{empId}")
    public ResponseEntity<List<Map<String, Object>>> getMonthlyLeaveCount(@PathVariable Long empId) {
        return ResponseEntity.ok(leaveService.getMonthlyLeaveCount(empId));
    }


//    @GetMapping("leave/type-count/{empId}")
//    public Map<String, Long> getLeaveTypeCounts(@PathVariable Long empId) {
//        List<Object[]> results = leaveRepo.countLeaveTypesByEmpId(empId);
//        Map<String, Long> response = new HashMap<>();
//        for (Object[] row : results) {
//            String type = (String) row[0];
//            Long count = (Long) row[1];
//            response.put(type, count);
//        }
//        return response;
//    }

    @GetMapping("leave/type-count/{empId}")
    public ResponseEntity<List<Map<String, Object>>>  getLeaveTypeCounts(@PathVariable Long empId) {
        return ResponseEntity.ok(leaveService.getLeaveTypeCounts(empId));
    }

    @GetMapping("leave/type-dates/{empId}")
    public ResponseEntity<List<Map<String, Object>>> getLeaveTypeDates(@PathVariable Long empId) {
        return ResponseEntity.ok(leaveService.getLeaveTypeDates(empId));
    }


    @GetMapping("leave/status-count/{empId}")
    public ResponseEntity<List<Map<String, Object>>> getLeaveStatusCount(@PathVariable Long empId) {
        return ResponseEntity.ok(leaveService.getLeaveStatusCount(empId));
    }




}
