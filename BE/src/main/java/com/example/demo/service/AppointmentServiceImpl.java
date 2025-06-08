package com.example.demo.service;

import com.example.demo.dto.AppointmentDto;
import com.example.demo.dto.ManagerDto;
import com.example.demo.model.Appointment;
import com.example.demo.model.Customer;
import com.example.demo.model.Manager;
import com.example.demo.model.Pet;
import com.example.demo.repository.AppointmentRepository;
import com.example.demo.repository.CustomerRepository;
import com.example.demo.repository.PetRepository;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;

import java.sql.Time;
import java.time.LocalTime;
import java.util.*;
import java.util.stream.Collectors;

import static java.util.Arrays.stream;


@Service
@RequiredArgsConstructor
public class AppointmentServiceImpl implements AppointmentService {

    private final AppointmentRepository appointmentRepository;

    private final CustomerRepository customerRepository;

    private final PetRepository petRepository;

    private final ModelMapper modelMapper;

    @Override
    public AppointmentDto save(AppointmentDto AppointmentDto) {
        Appointment appointment = toEntity(AppointmentDto);
        appointment = appointmentRepository.save(appointment);
        return toDto(appointment);
    }

    @Override
    public List<AppointmentDto> getAll() {
        List<Appointment> appointments = appointmentRepository.findAll();
        return appointments.stream().map(this::toDto).toList();
    }

    private Appointment toEntity(AppointmentDto appointmentDto) {
        Optional<Pet> pet = petRepository.findById(appointmentDto.getPetId());
        Appointment appointment = modelMapper.map(appointmentDto, Appointment.class);
        appointment.setPet(pet.orElse(null));
        return appointment;
    }

    private AppointmentDto toDto(Appointment appointment) {
        int petId = appointment.getPet().getId();
        AppointmentDto appointmentDto = modelMapper.map(appointment, AppointmentDto.class);
        appointmentDto.setPetId(petId);
        return appointmentDto;
    }

    @Override
    public List<Appointment> findAll() {
        List<Appointment> appointments = appointmentRepository.findAll();
        return appointments;
    }

    @Override
    public ManagerDto findManagerByAppointmentId(int appointmentId) {
        // Find Manager associated with the Appointment by ID
        Optional<Manager> managerOptional = appointmentRepository.findAppointmentWithManager(appointmentId);
        return managerOptional.map(d -> new ManagerDto(d.getId(), d.getName(), d.getImgUrl(), d.getSpeciality()))
                .orElse(null); // Return null if no Manager found
    }

    @Override
    public List<AppointmentDto> findAppointmentsWithManagers() {
        List<Appointment> appointments = appointmentRepository.findAll();
        return appointments.stream().map(appointment -> {
            AppointmentDto appointmentDto = toDto(appointment);
            ManagerDto managerDto = findManagerByAppointmentId(appointment.getId());
            appointmentDto.setManager(managerDto);  // Set ManagerDto in AppointmentDto
            return appointmentDto;
        }).collect(Collectors.toList());
    }

    @Override
    public AppointmentDto findAppointmentById(int appointmentId) {
        return toDto(appointmentRepository.findById(appointmentId));
    }

    @Override
    public List<AppointmentDto> findAppointmentByDoctorId(int managerId) {
        List<Appointment> appointments = appointmentRepository.findAppointmentByDoctorId(managerId);
        return appointments.stream().map(this::toDto).toList();
    }

    @Override
    public List<AppointmentDto> findAppointmentByEmployeeId(int managerId) {
        List<Appointment> appointments = appointmentRepository.findAppointmentByEmployeeId(managerId);
        return appointments.stream().map(this::toDto).toList();
    }

    @Override
    public List<AppointmentDto> findAppointmentsByPetId(int petId) {
        List<Appointment> appointments = appointmentRepository.findAppointmentsByPetId(petId);
        return appointments.stream().map(this::toDto).toList();
    }

    @Override
    public List<AppointmentDto> findAppointmentsByCustomerId(int customerId) {
        List<Appointment> appointments = appointmentRepository.findAppointmentsByCustomerId(customerId);
        List<AppointmentDto> appointmentDtos = appointments.stream().map(this::toDto).toList();
        for (AppointmentDto appointment : appointmentDtos) {
            ManagerDto manager = findManagerByAppointmentId(appointment.getAppointmentId());
            appointment.setManager(manager);
            Pet pet = petRepository.getById(appointment.getPetId());
            appointment.setPetImgUrl(pet.getImage());
        }
        return appointmentDtos;
    }


    @Override
    public List<String> getAvailableTimeSlots(int managerId, Date appointmentDate) {

        List<String> allTimeSlots = generateTimeSlots(LocalTime.of(9, 0), LocalTime.of(17, 0), 30);

        // Fetch all booked appointments for the manager on the given date
        List<String> bookedTimeSlots = appointmentRepository
                .findByManagerIdAndAppointmentDate(managerId, appointmentDate)
                .stream()
                .map(appointment -> appointment.getAppointmentTime().toString()) // Trích xuất và chuyển đổi thời gian cuộc hẹn thành chuỗi
                .collect(Collectors.toList());

        // Filter out booked time slots
        List<String> availableTimeSlots = allTimeSlots.stream()
                .filter(slot -> !bookedTimeSlots.contains(slot))
                .collect(Collectors.toList());

        return availableTimeSlots;

    }


    private List<String> generateTimeSlots(LocalTime startTime, LocalTime endTime, int intervalMinutes) {
        List<String> timeSlots = new ArrayList<>();
        LocalTime currentTime = startTime;

        while (currentTime.isBefore(endTime)) {
            timeSlots.add(currentTime.toString());
            currentTime = currentTime.plusMinutes(intervalMinutes);
        }

        return timeSlots;
    }

    @Override
    public Boolean isSlotAvailable(int managerId, Date appointmentDate, Time appointmentTime) {
        // Fetch appointments for the given manager and date
        List<Appointment> existingAppointments = appointmentRepository.findByManagerIdAndAppointmentDate(managerId, appointmentDate);

        // Check if any appointment matches the given time
        for (Appointment appointment : existingAppointments) {
            if (appointment.getAppointmentTime().equals(appointmentTime)) {
                return false; // Slot is already booked
            }
        }

        return true; // Slot is available
    }

}
