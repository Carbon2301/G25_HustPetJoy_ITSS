package com.example.demo.service;

import com.example.demo.dto.CustomerDto;
import com.example.demo.dto.PetDto;

import java.util.List;

public interface PetService {
    List<PetDto> findAll();
    String findNameById(int id);
    String findImgUrlById(int id);
    List<PetDto> findPetByDoctorId(int managerId);
    List<PetDto> findPetByEmployeeId(int managerId);
    List<PetDto> findPetByCustomerId(int petId);
    PetDto save(PetDto petDto);
    PetDto findPetById(int id);
}
