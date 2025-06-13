package com.example.demo.service;

import com.example.demo.dto.TreatmentDto;
import com.example.demo.model.Treatment;
import com.example.demo.repository.TreatmentRepository;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
@RequiredArgsConstructor
public class TreatmentServiceImpl implements TreatmentService {

    private final ModelMapper modelMapper;

    private final TreatmentRepository treatmentRepository;

    @Override
    public TreatmentDto save(TreatmentDto treatmentDto) {
        Treatment treatment = toEntity(treatmentDto);
        treatment = treatmentRepository.save(treatment);
        return toDto(treatment);
    }

    private Treatment toEntity(TreatmentDto treatmentDto) {
        Treatment treatment = modelMapper.map(treatmentDto, Treatment.class);
        return treatment;
    }

    private TreatmentDto toDto(Treatment treatment) {
        int petId = treatment.getPet().getId();
        int managerId = treatment.getManager().getId();
        TreatmentDto treatmentDto = modelMapper.map(treatment, TreatmentDto.class);
        treatmentDto.setPetId(petId);
        treatmentDto.setManagerId(managerId);
        return treatmentDto;
    }

    @Override
    public List<TreatmentDto> findTreatmentByManagerId(int managerId) {
        List<Treatment> treatments = treatmentRepository.findTreatmentByManagerId(managerId);
        return treatments.stream().map(this::toDto).toList();
    }

    @Override
    public Treatment findTreatmentByAppointmentid(int appointmentId){
        return treatmentRepository.findTreatmentByAppointmentid(appointmentId);
    }
}
