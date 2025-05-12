package com.example.demo.repository;

import com.example.demo.model.Treatment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface TreatmentRepository extends JpaRepository<Treatment, Integer> {
    @Query("""
        SELECT t
        FROM Treatment t
        JOIN Appointment a ON a.pet.id = t.pet.id
        WHERE t.manager.id = :managerId
    """)
    List<Treatment> findTreatmentByManagerId(@Param("managerId") int managerId);

    @Query("""
        SELECT t
        FROM Treatment t
        JOIN Appointment a ON a.id = t.appointment.id
        Where a.id = :appointmentId
    """)
    Treatment findTreatmentByAppointmentid(int appointmentId);

}
