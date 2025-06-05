package com.example.demo.service;

import com.example.demo.dto.MedicineDto;
import com.example.demo.model.Medicine;

import java.util.List;
public interface MedicineService {
    MedicineDto save(MedicineDto medicine);
    List<MedicineDto> getAll();
    Medicine findByTypeAndMedicineName(String medicineName, String type);
//    Medicine save(Medicine medicine);

}
