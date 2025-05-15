package com.example.demo.repository;

import com.example.demo.model.Spa;
import com.example.demo.model.Treatment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SpaRepository extends JpaRepository<Spa, Integer> {
    @Query("""
        SELECT s
        FROM Spa s
        JOIN Appointment a ON a.pet.id = s.pet.id
        WHERE s.manager.id = :managerId
    """)
    List<Spa> findSpaByManagerId(@Param("managerId") int managerId);
}