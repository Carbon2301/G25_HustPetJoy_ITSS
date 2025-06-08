package com.example.demo.service;

import com.example.demo.dto.AppointmentDto;
import com.example.demo.dto.ManagerDto;
import com.example.demo.model.Appointment;

import java.sql.Time;
import java.util.Date;
import java.util.List;

public interface AppointmentService {
    AppointmentDto save(AppointmentDto appointment);
    List<AppointmentDto> getAll();
    List<Appointment> findAll();
    ManagerDto findManagerByAppointmentId(int appointmentId);
    List<AppointmentDto> findAppointmentsWithManagers();
    AppointmentDto findAppointmentById(int appointmentId);
    List<AppointmentDto> findAppointmentByDoctorId(int managerId);
    List<AppointmentDto> findAppointmentByEmployeeId(int managerId);
    List<AppointmentDto> findAppointmentsByPetId(int petId);
    List<AppointmentDto> findAppointmentsByCustomerId(int customerId);
    List<String> getAvailableTimeSlots(int managerId, Date date);
    Boolean isSlotAvailable(int managerId, Date date, Time time);

}
