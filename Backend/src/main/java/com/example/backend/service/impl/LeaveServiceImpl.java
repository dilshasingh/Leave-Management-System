package com.example.backend.service.impl;

import com.example.backend.model.LeaveRequest;
import com.example.backend.repository.LeaveRequestRepository;
import com.example.backend.repository.ManagerEmpMapRepository;
import com.example.backend.service.LeaveService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.format.TextStyle;
import java.time.temporal.ChronoUnit;
import java.util.*;

@Service
public class LeaveServiceImpl implements LeaveService {

    @Autowired
    private LeaveRequestRepository leaveRepo;

    @Autowired
    private ManagerEmpMapRepository mapRepo;

    @Override
    public LeaveRequest submitLeave(LeaveRequest request) {
        request.setStatus("Pending");
        return leaveRepo.save(request);
    }

    @Override
    public List<LeaveRequest> getOwnHistory(Long empId) {
        return leaveRepo.findByEmpId(empId);
    }

    @Override
    public List<Map<String, Object>> getManagerRequests(Long manId) {
        List<Long> empIds = mapRepo.findEmpIdsByManId(manId);
        List<Object[]> res =  leaveRepo.findByEmpIds(empIds);
        List<Map<String, Object>> res1 = new ArrayList<>();
        for (Object[] o : res) {
            Map<String, Object> map = new HashMap<>();
            map.put("leaveId", o[0]);
            map.put("name", o[1]);
            map.put("type", o[2]);
            map.put("startDate", o[3]);
            map.put("endDate", o[4]);
            map.put("reason", o[5]);
            map.put("status", o[6]);
            res1.add(map);
        }

        return res1;
    }

    @Override
    public List<Map<String, Object>> getPendingManagerRequests(Long manId) {
        List<Long> empIds = mapRepo.findEmpIdsByManId(manId);
        List<Object[]> res =  leaveRepo.findPendingByEmpIds(empIds);
        List<Map<String, Object>> res1 = new ArrayList<>();
        for (Object[] o : res) {
            Map<String, Object> map = new HashMap<>();
            map.put("leaveId", o[0]);
            map.put("name", o[1]);
            map.put("type", o[2]);
            map.put("startDate", o[3]);
            map.put("endDate", o[4]);
            map.put("reason", o[5]);
            res1.add(map);
        }
        return res1;
    }

    @Override
    public LeaveRequest updateLeaveStatus(Long leaveId, String status) {
        LeaveRequest leave = leaveRepo.findById(leaveId).orElseThrow();
        leave.setStatus(status);
        return leaveRepo.save(leave);
    }

    @Override
    public int getLeaveCount(Long empId) {
        List<Object[]> ranges = leaveRepo.findAcceptedLeaveDateRanges(empId);
        long totalDays = 0;
        for (Object[] range : ranges) {
            String startStr = (String) range[0];
            String endStr = (String) range[1];
            LocalDate startDate = LocalDate.parse(startStr);
            LocalDate endDate = LocalDate.parse(endStr);
            totalDays += ChronoUnit.DAYS.between(startDate, endDate) + 1;
        }

        return (int) totalDays;
    }

    @Override
    public List<Map<String, Object>> getMonthlyLeaveCount(Long empId) {
        List<Object[]> ranges = leaveRepo.findAcceptedLeaveDateRanges(empId);
        Map<String, Integer> monthCountMap = new TreeMap<>();

        for (Object[] range : ranges) {
            String startStr = (String) range[0];
            String endStr = (String) range[1];

            LocalDate startDate = LocalDate.parse(startStr);
            LocalDate endDate = LocalDate.parse(endStr);

            for (LocalDate date = startDate; !date.isAfter(endDate); date = date.plusDays(1)) {
                String month = date.getMonth().getDisplayName(TextStyle.SHORT, Locale.ENGLISH).toLowerCase();
                monthCountMap.put(month, monthCountMap.getOrDefault(month, 0) + 1);
            }
        }

        List<Map<String, Object>> response = new ArrayList<>();
        for (Map.Entry<String, Integer> entry : monthCountMap.entrySet()) {
            Map<String, Object> item = new HashMap<>();
            item.put("month", entry.getKey());
            item.put("count", entry.getValue());
            response.add(item);
        }
        return response;
    }

    @Override
    public List<Map<String, Object>> getLeaveTypeCounts(Long empId) {
        List<Object[]> results = leaveRepo.findLeaveTypesWithDates(empId);
        Map<String, Long> map = new HashMap<>();

        for (Object[] row : results) {
            String type = (String) row[0];
            String startStr = (String) row[1];
            String endStr = (String) row[2];
            LocalDate start = LocalDate.parse(startStr);
            LocalDate end = LocalDate.parse(endStr);


            long days = ChronoUnit.DAYS.between(start, end) + 1;

            map.put(type, map.getOrDefault(type, 0L) + days);
        }

        List<Map<String, Object>> response = new ArrayList<>();
        for (Map.Entry<String, Long> entry : map.entrySet()) {
            Map<String, Object> item = new HashMap<>();
            item.put("name", entry.getKey());
            item.put("value", entry.getValue());
            response.add(item);
        }
        return response;
    }

    @Override
    public List<Map<String, Object>> getLeaveTypeDates(Long empId) {
        List<Object[]> results = leaveRepo.findLeaveTypesWithDates(empId);
        Map<String, List<LocalDate>> map = new HashMap<>();

        for (Object[] row : results) {
            String type = (String) row[0];
            String startStr = (String) row[1];
            String endStr = (String) row[2];
            LocalDate start = LocalDate.parse(startStr);
            LocalDate end = LocalDate.parse(endStr);


            List<LocalDate> allDates = new ArrayList<>();
            for (LocalDate date = start; !date.isAfter(end); date = date.plusDays(1)) {
                allDates.add(date);
            }

            map.computeIfAbsent(type, k -> new ArrayList<>()).addAll(allDates);
        }

        List<Map<String, Object>> response = new ArrayList<>();
        for (Map.Entry<String, List<LocalDate>> entry : map.entrySet()) {
            Map<String, Object> item = new HashMap<>();
            item.put("name", entry.getKey());
            item.put("dates", entry.getValue());
            response.add(item);
        }
        return response;
    }

    @Override
    public List<Map<String, Object>> getLeaveStatusCount(Long empId) {
        List<Object[]> results = leaveRepo.countStatusByEmpId(empId);
        Map<String, Long> map = new HashMap<>();

        for (Object[] row : results) {
            String status = (String) row[0];
            Long count = (Long) row[1];
            map.put(status, count);
        }
        List<Map<String, Object>> response = new ArrayList<>();
        for (Map.Entry<String, Long> entry : map.entrySet()) {
            Map<String, Object> item = new HashMap<>();
            item.put("status", entry.getKey());
            item.put("value", entry.getValue());
            response.add(item);
        }
        return response;
    }
}
