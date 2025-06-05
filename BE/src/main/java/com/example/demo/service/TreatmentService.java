package com.example.demo.service;

import com.example.demo.dto.TreatmentDto;
import com.example.demo.model.Treatment;

import java.util.List;

public interface TreatmentService {
    List<TreatmentDto> findTreatmentByManagerId(int managerId);
    TreatmentDto save(TreatmentDto treatmentDto );
    Treatment findTreatmentByAppointmentid(int appointmentId);
}
