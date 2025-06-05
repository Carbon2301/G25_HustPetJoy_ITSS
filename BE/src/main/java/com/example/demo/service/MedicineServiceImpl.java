package com.example.demo.service;

import com.example.demo.dto.MedicineDto;
import com.example.demo.model.Medicine;
import com.example.demo.repository.MedicineRepository;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;

import java.util.List;


@Service
@RequiredArgsConstructor
public class MedicineServiceImpl implements MedicineService {

    private final MedicineRepository medicineRepository;

    private final ModelMapper modelMapper;

    @Override
    public MedicineDto save(MedicineDto medicineDto) {
        Medicine medicine = toEntity(medicineDto);
        medicine = medicineRepository.save(medicine);
        return toDto(medicine);
    }

    @Override
    public List<MedicineDto> getAll() {
        List<Medicine> medicine = medicineRepository.findAll();
        return medicine.stream().map(this::toDto).toList();
    }

    private Medicine toEntity(MedicineDto medicineDto) {
        Medicine Medicine = modelMapper.map(medicineDto, Medicine.class);
        return Medicine;
    }

    private MedicineDto toDto(Medicine medicine) {
        MedicineDto medicineDto = modelMapper.map(medicine, MedicineDto.class);
        return medicineDto;
    }

    @Override
    public Medicine findByTypeAndMedicineName(String medicineName, String type){
        return medicineRepository.findByTypeAndMedicineName(medicineName, type);
    }


}
