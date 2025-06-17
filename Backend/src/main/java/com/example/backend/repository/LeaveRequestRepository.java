package com.example.backend.repository;

import com.example.backend.model.LeaveRequest;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface LeaveRequestRepository extends JpaRepository<LeaveRequest, Long> {
    List<LeaveRequest> findByEmpId(Long empId);

    @Query("SELECT l.leaveId,e.empName,  l.type, l.startDate,  l.endDate, l.reason, l.status FROM LeaveRequest l JOIN Employee e ON e.empId = l.empId WHERE l.empId IN :empIds")
    List<Object[]> findByEmpIds(List<Long> empIds);

    @Query("SELECT l.leaveId,e.empName,  l.type, l.startDate,  l.endDate, l.reason FROM LeaveRequest l JOIN Employee e ON e.empId = l.empId WHERE l.empId IN :empIds AND l.status = 'Pending'")
    List<Object[]> findPendingByEmpIds(List<Long> empIds);


    @Query("SELECT l.startDate, l.endDate FROM LeaveRequest l WHERE l.empId = :empId AND l.status = 'Accepted'")
    List<Object[]> findAcceptedLeaveDateRanges(Long empId);


    @Query("SELECT l.type, COUNT(l) FROM LeaveRequest l WHERE l.empId = :empId and l.status = 'Accepted' GROUP BY l.type")
    List<Object[]> countLeaveTypesByEmpId(Long empId);

    @Query("SELECT l.type, l.startDate, l.endDate FROM LeaveRequest l WHERE l.empId = :empId AND l.status = 'Accepted'")
    List<Object[]> findLeaveTypesWithDates(Long empId);

    @Query("SELECT l.status, COUNT(l) FROM LeaveRequest l WHERE l.empId = :empId  GROUP BY l.status")
    List<Object[]> countStatusByEmpId(Long empId);

    void deleteAllByEmpId(Long empId);


}