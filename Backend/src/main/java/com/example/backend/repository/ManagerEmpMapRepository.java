package com.example.backend.repository;

import com.example.backend.model.*;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface ManagerEmpMapRepository extends JpaRepository<ManagerEmpMap, ManagerEmpId> {
    @Query("SELECT m.empId FROM ManagerEmpMap m WHERE m.manId = :manId")
    List<Long> findEmpIdsByManId(Long manId);

    List<ManagerEmpMap> findByManId(Long manId);
    ManagerEmpMap findByEmpId(Long empId);

    void deleteAllByEmpId(Long empId);


}