package com.example.demo.repository;

import com.example.demo.model.Appointment;
import com.example.demo.model.Manager;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Date;
import java.util.List;
import java.util.Optional;

@Repository
public interface AppointmentRepository extends JpaRepository<Appointment, Integer> {
    @Query("""
    SELECT DISTINCT d
    FROM Manager d
    LEFT JOIN Treatment t ON d.id = t.manager.id
    LEFT JOIN Spa s ON d.id = s.manager.id
    WHERE (t.appointment.id = :appointmentId OR s.appointment.id = :appointmentId)
""")
    Optional<Manager> findAppointmentWithManager(@Param("appointmentId") int appointmentId);

    @Query("SELECT a FROM Appointment a WHERE a.id = :id")
    Appointment findById(@Param("id") int id);

    @Query("""
        SELECT a
        FROM Appointment a
        JOIN Treatment t ON a.id = t.appointment.id
        WHERE t.manager.id = :managerId
    """)
    List<Appointment> findAppointmentByDoctorId(@Param("managerId") int managerId);

    @Query("""
        SELECT a
        FROM Appointment a
        JOIN Spa s ON a.id = s.appointment.id
        WHERE s.manager.id = :managerId
    """)
    List<Appointment> findAppointmentByEmployeeId(@Param("managerId") int managerId);

    @Query("""
        SELECT a
        FROM Appointment a
        WHERE a.pet.id = :petId
    """)
    List<Appointment> findAppointmentsByPetId(@Param("petId") int petId);

    @Query("""
        SELECT a
        FROM Appointment a
        Join Pet p ON a.pet.id = p.id
        where p.customer.id = :userId
    """)
    List<Appointment> findAppointmentsByCustomerId(@Param("userId") int customerId);

    @Query("""
        SELECT a
        FROM Appointment a
        JOIN Treatment t ON a.id = t.appointment.id
        WHERE t.manager.id = :managerId
        AND a.appointmentDate = :date
    """)
    List<Appointment> findByManagerIdAndAppointmentDate(@Param("managerId") int managerId, @Param("date") Date date);

    @Query("""
        SELECT a
        FROM Appointment a 
        JOIN Spa s on s.appointment.id = a.id   
    """)
    List<Appointment> findAllSpaAppointment();
}

